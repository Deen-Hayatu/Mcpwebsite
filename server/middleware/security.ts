import { Express, Request, Response, NextFunction } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import xssClean from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import { expressCspHeader, INLINE, NONE, SELF } from "express-csp-header";
import { securityService } from "../services/security";
import session from "express-session";
import crypto from "crypto";

/**
 * Configure all security middleware for Express app
 */
export function configureSecurityMiddleware(app: Express): void {
  // Set trust proxy to true for proper IP detection behind proxies
  app.set('trust proxy', 1);
  
  // Set security headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: false, // We'll configure CSP separately
    crossOriginEmbedderPolicy: false, // For compatibility with some iframe content
  }));
  
  // Enhanced Content Security Policy for OV/EV certificate requirements
  app.use(expressCspHeader({
    directives: {
      'default-src': [SELF],
      'script-src': [
        SELF, 
        // Payment gateway scripts
        'https://js.stripe.com', 
        'https://checkout.paystack.com',
        'https://www.paypal.com',
        // Utility scripts  
        'https://polyfill.io', 
        'https://cdn.jsdelivr.net'
      ],
      'script-src-attr': [NONE], // Prevent inline event handlers
      'style-src': [
        SELF, 
        INLINE, 
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net'
      ],
      'img-src': [
        SELF, 
        'data:', 
        'https://res.cloudinary.com', 
        'https://cdn.jsdelivr.net',
        'https://*.stripe.com'
      ],
      'font-src': [
        SELF, 
        'https://fonts.gstatic.com',
        'https://cdn.jsdelivr.net'
      ],
      'frame-src': [
        SELF, 
        'https://js.stripe.com', 
        'https://checkout.paystack.com',
        'https://www.paypal.com',
        'https://www.youtube-nocookie.com', // Privacy-enhanced YouTube
        'https://www.google.com'
      ],
      'connect-src': [
        SELF, 
        'https://api.stripe.com', 
        'https://api.paystack.co',
        'https://api.perplexity.ai'
      ],
      'object-src': [NONE],
      'base-uri': [SELF],
      'form-action': [SELF],
      'frame-ancestors': [SELF],
      'manifest-src': [SELF],
      'media-src': [SELF, 'https://res.cloudinary.com'],
      'worker-src': [SELF, 'blob:'],
      'upgrade-insecure-requests': [],
      'block-all-mixed-content': [],
    },
    reportOnly: process.env.NODE_ENV !== 'production', // Report only in development
  }));
  
  // Enable CORS
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://mpcghana.org', 'https://www.mpcghana.org', /\.mpcghana\.org$/]
      : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
    maxAge: 86400, // 24 hours
  }));
  
  // Rate limiting
  const standardLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
    skip: (req: Request) => req.path.startsWith('/assets/'),
  });
  
  // Stricter rate limiting for authentication routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many authentication attempts, please try again later.',
  });
  
  // Apply rate limiting
  app.use('/api/', standardLimiter);
  app.use('/api/auth', authLimiter);
  app.use('/api/login', authLimiter);
  app.use('/api/register', authLimiter);
  app.use('/api/password-reset', authLimiter);
  
  // Prevent parameter pollution
  app.use(hpp());
  
  // Sanitize data
  app.use(xssClean());
  
  // Setup CSRF protection
  setupCsrfProtection(app);
  
  // Security tracking middleware
  app.use(securityHeadersMiddleware);
  app.use(requestIdentifierMiddleware);
}

/**
 * Setup CSRF protection
 */
function setupCsrfProtection(app: Express): void {
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Skip CSRF check for GET, HEAD, OPTIONS requests
    const safeMethod = /^(GET|HEAD|OPTIONS)$/.test(req.method);
    
    // Skip CSRF check for routes with specific tokens/external API calls
    const isTrustedApiPath = req.path.startsWith('/api/webhooks/') || 
                             req.path.startsWith('/api/external/');
    
    if (safeMethod || isTrustedApiPath) {
      return next();
    }
    
    // Check if session exists and has csrfToken
    if (!req.session || !req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(64).toString('hex');
      return next();
    }
    
    // Get token from header or body
    const csrfToken = 
      req.headers['x-csrf-token'] || 
      req.headers['x-xsrf-token'] ||
      req.body._csrf;
    
    // Validate token
    if (!csrfToken || csrfToken !== req.session.csrfToken) {
      return res.status(403).json({
        message: 'Invalid or missing CSRF token',
      });
    }
    
    // Generate new token for next request
    req.session.csrfToken = crypto.randomBytes(64).toString('hex');
    next();
  });
  
  // Middleware to include CSRF token in response headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.csrfToken) {
      res.setHeader('X-CSRF-Token', req.session.csrfToken);
    }
    next();
  });
}

/**
 * Add security headers to all responses
 */
function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction): void {
  const headers = securityService.getSecurityHeaders();
  
  for (const [header, value] of Object.entries(headers)) {
    res.setHeader(header, value);
  }
  
  next();
}

/**
 * Add request identifier for tracking and debugging
 */
function requestIdentifierMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = crypto.randomBytes(16).toString('hex');
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}

/**
 * Sanitize request body to prevent XSS attacks
 */
export function sanitizeBody(req: Request, res: Response, next: NextFunction): void {
  if (req.body) {
    sanitizeObject(req.body);
  }
  next();
}

/**
 * Recursively sanitize an object to prevent XSS
 */
function sanitizeObject(obj: any): void {
  if (!obj || typeof obj !== 'object') {
    return;
  }
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        // Basic XSS protection for strings
        obj[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize nested objects
        sanitizeObject(value);
      }
    }
  }
}

/**
 * Sanitize a string to prevent XSS
 */
function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, (match) => {
      return match === '<' ? '&lt;' : '&gt;';
    })
    .replace(/javascript:/gi, 'blocked:')
    .replace(/on\w+=/gi, 'data-blocked=');
}