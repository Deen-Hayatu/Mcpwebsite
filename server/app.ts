import express, { type Express, type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";
import type { Server } from "http";
import { registerRoutes } from "./routes";
import { configureSecurityMiddleware, sanitizeBody } from "./middleware/security";
import { setupAuth } from "./auth";
import { securityService } from "./services/security";
import { AuditAction, ResourceType } from "./models/security";
import { log } from "./vite";

/**
 * Build an Express app with all middleware + API routes.
 *
 * Important: this does NOT call `listen()`. That is handled by `server/index.ts`
 * for long-lived environments, and by Vercel serverless handlers in `/api`.
 */
export async function createApp(): Promise<{ app: Express; server: Server }> {
  // Ensure stable secrets in production/serverless
  if (!process.env.SESSION_SECRET) {
    // In serverless this would break sessions between cold starts; require it in prod-like envs.
    if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
      throw new Error("SESSION_SECRET must be set in production/Vercel.");
    }
    process.env.SESSION_SECRET = crypto.randomBytes(64).toString("hex");
    console.warn(
      "Warning: SESSION_SECRET not set. Using auto-generated secret for this session.",
    );
  }

  const app = express();

  // Core parsers (must be before security middleware that inspects body)
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: false, limit: "10mb" }));

  // Sessions + auth must come before CSRF protection
  setupAuth(app);

  // Apply security middleware (helmet, cors, csrf, rate limits, etc.)
  configureSecurityMiddleware(app);

  // Sanitize request bodies to prevent XSS
  app.use(sanitizeBody);

  // Logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    // Sanitize the log message to prevent log injection
    const sanitizeForLog = (input: string) => input.replace(/[\r\n\t]/g, "");

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
        if (
          capturedJsonResponse &&
          !path.includes("/auth") &&
          !path.includes("/login")
        ) {
          try {
            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
          } catch {
            logLine += ` :: [Cannot stringify response]`;
          }
        }

        if (logLine.length > 200) {
          logLine = logLine.slice(0, 199) + "…";
        }

        log(logLine);

        // Log security-relevant events
        if (req.user && (res.statusCode >= 400 || path.includes("/admin"))) {
          securityService
            .logSecurityEvent({
              userId: req.user.id,
              action:
                res.statusCode >= 400
                  ? AuditAction.SECURITY_EVENT
                  : AuditAction.ADMIN_ACTION,
              resourceType: path.split("/")[2] as any as ResourceType,
              resourceId: path.split("/")[3],
              ipAddress: securityService.getClientIP(req),
              userAgent: req.headers["user-agent"],
            })
            .catch((err) =>
              console.error("Error logging security event:", err),
            );
        }
      }
    });

    // Add security headers to all responses
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Cache-Control", "no-store, max-age=0");

    next();
  });

  // Register API routes
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    console.error(`Error [${err.status || 500}]:`, err.message, err.stack);

    const status = err.status || err.statusCode || 500;
    const message =
      process.env.NODE_ENV === "production" && status === 500
        ? "Internal Server Error"
        : err.message || "Internal Server Error";

    // Set security headers
    const securityHeaders = securityService.getSecurityHeaders();
    for (const [header, value] of Object.entries(securityHeaders)) {
      res.setHeader(header, value);
    }

    res.status(status).json({
      message,
      requestId:
        req.headers["x-request-id"] || crypto.randomBytes(8).toString("hex"),
    });

    if (status >= 500) {
      securityService
        .logSecurityEvent({
          userId: req.user?.id,
          action: AuditAction.SECURITY_EVENT,
          resourceType: ResourceType.POLICY_BRIEF,
          ipAddress: securityService.getClientIP(req),
          userAgent: req.headers["user-agent"],
          metadata: JSON.stringify({
            path: req.path,
            method: req.method,
            statusCode: status,
            errorMessage: err.message,
          }),
        })
        .catch((e) => console.error("Error logging security event:", e));
    }
  });

  return { app, server };
}

