import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { configureSecurityMiddleware, sanitizeBody } from "./middleware/security";
import { setupAuth } from "./auth";
import { securityService } from "./services/security";
import { AuditAction, ResourceType } from "./models/security";
import crypto from "crypto";

// Generate a secure Session Secret if not provided
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = crypto.randomBytes(64).toString('hex');
  console.warn("Warning: SESSION_SECRET not set. Using auto-generated secret for this session.");
}

// Create the Express application
const app = express();

// Export the app for Vercel deployment
export { app };

// Apply security middleware
configureSecurityMiddleware(app);

// Setup core middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Sanitize all request bodies to prevent XSS
app.use(sanitizeBody);

// Setup authentication
setupAuth(app);

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Sanitize the log message to prevent log injection
  const sanitizeForLog = (input: string) => {
    return input.replace(/[\r\n\t]/g, '');
  };

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${sanitizeForLog(req.method)} ${sanitizeForLog(path)} ${res.statusCode} in ${duration}ms`;
      
      // Only log non-sensitive information
      if (capturedJsonResponse && !path.includes('/auth') && !path.includes('/login')) {
        try {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        } catch (e) {
          logLine += ` :: [Cannot stringify response]`;
        }
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
      
      // Log security-relevant events
      if (req.user && (res.statusCode >= 400 || path.includes('/admin'))) {
        securityService.logSecurityEvent({
          userId: req.user.id,
          action: res.statusCode >= 400 ? AuditAction.SECURITY_EVENT : AuditAction.ADMIN_ACTION,
          resourceType: path.split('/')[2] as any as ResourceType,
          resourceId: path.split('/')[3],
          ipAddress: securityService.getClientIP(req),
          userAgent: req.headers['user-agent']
        }).catch(err => console.error('Error logging security event:', err));
      }
    }
  });

  // Add security headers to all responses
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  
  next();
});

// Main application initialization
(async () => {
  // Register API routes and get the server instance
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    // Log the error
    console.error(`Error [${err.status || 500}]:`, err.message, err.stack);
    
    // Get status code
    const status = err.status || err.statusCode || 500;
    
    // Don't expose error details in production
    const message = process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';
    
    // Set security headers
    const securityHeaders = securityService.getSecurityHeaders();
    for (const [header, value] of Object.entries(securityHeaders)) {
      res.setHeader(header, value);
    }
    
    // Send error response
    res.status(status).json({ 
      message,
      // Add request ID for tracking in logs
      requestId: req.headers['x-request-id'] || crypto.randomBytes(8).toString('hex')
    });
    
    // Log security event for server errors
    if (status >= 500) {
      securityService.logSecurityEvent({
        userId: req.user?.id,
        action: AuditAction.SECURITY_EVENT,
        resourceType: ResourceType.RESOURCE_CREATED,
        ipAddress: securityService.getClientIP(req),
        userAgent: req.headers['user-agent'],
        metadata: JSON.stringify({ 
          path: req.path,
          method: req.method,
          statusCode: status,
          errorMessage: err.message
        })
      }).catch(e => console.error('Error logging security event:', e));
    }
  });

  // Setup Vite for development or static serving for production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port} in ${app.get('env')} mode`);
  });
  
  // Schedule security maintenance tasks
  const HOUR_MS = 60 * 60 * 1000;
  setInterval(() => {
    securityService.cleanupTokens()
      .catch(err => console.error('Error cleaning up tokens:', err));
    
    securityService.cleanupSessions()
      .catch(err => console.error('Error cleaning up sessions:', err));
  }, HOUR_MS);
})();
