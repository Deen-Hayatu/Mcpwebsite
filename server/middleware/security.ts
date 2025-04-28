import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import { expressCspHeader, NONCE, SELF, INLINE } from 'express-csp-header';

/**
 * Configure and return security middleware for Express
 */
export const configureSecurityMiddleware = (app: any) => {
  // Enable trust proxy if running behind a reverse proxy (common in production)
  app.set('trust proxy', 1);

  // Configure CORS
  const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://mpcghana.org', 'https://www.mpcghana.org']
      : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
    maxAge: 86400, // 24 hours
  };
  app.use(cors(corsOptions));

  // Apply Helmet - Set security-related HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // We'll configure CSP separately for more control
    })
  );

  // Configure Content-Security-Policy header
  app.use(
    expressCspHeader({
      directives: {
        'default-src': [SELF],
        'script-src': [SELF, NONCE, 'https://storage.googleapis.com', 'https://cdn.jsdelivr.net', 'https://js.stripe.com', 'https://checkout.paypal.com'],
        'style-src': [SELF, NONCE, 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net', INLINE],
        'font-src': [SELF, 'https://fonts.gstatic.com', 'data:'],
        'img-src': [SELF, 'data:', 'https://res.cloudinary.com', 'https://storage.googleapis.com', 'https://*.stripe.com'],
        'connect-src': [SELF, 'https://api.perplexity.ai', 'https://api.stripe.com', 'https://api.paystack.co'],
        'frame-src': [SELF, 'https://js.stripe.com', 'https://checkout.paypal.com', 'https://standard.paystack.co'],
        'form-action': [SELF],
        'frame-ancestors': [SELF],
        'base-uri': [SELF],
        'block-all-mixed-content': true,
      },
    })
  );

  // Add X-XSS-Protection header
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Prevent parameter pollution
  app.use(hpp());

  // Data sanitization against XSS
  app.use(xss());

  // Set up rate limiting - protect against brute force attacks
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per IP in 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
  });
  app.use('/api/', generalLimiter);

  // More strict rate limiting for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Max 10 requests per IP in 1 hour
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts, please try again after an hour.',
  });
  app.use('/api/login', authLimiter);
  app.use('/api/register', authLimiter);

  // CSRF protection middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Skip CSRF for non-mutation operations
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    const csrfToken = req.headers['x-csrf-token'] as string;
    const storedToken = req.session?.csrfToken;

    if (!csrfToken || !storedToken || csrfToken !== storedToken) {
      return res.status(403).json({ message: 'CSRF token validation failed' });
    }

    next();
  });

  // Generate CSRF token for each session
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.session) {
      return next();
    }
    
    if (!req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    
    // Make CSRF token available to frontend
    res.setHeader('X-CSRF-Token', req.session.csrfToken);
    next();
  });

  return app;
};

/**
 * Middleware to ensure routes are accessible only to authenticated users
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized: Authentication required' });
  }
  next();
};

/**
 * Middleware to ensure routes are accessible only to admin users
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated() || !req.user?.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admin privileges required' });
  }
  next();
};

/**
 * Sanitize user input to prevent injection attacks
 */
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return input.replace(/[<>&'"]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return char;
      }
    });
  } else if (typeof input === 'object' && input !== null) {
    if (Array.isArray(input)) {
      return input.map(item => sanitizeInput(item));
    } else {
      const sanitizedObject: any = {};
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          sanitizedObject[key] = sanitizeInput(input[key]);
        }
      }
      return sanitizedObject;
    }
  }
  return input;
};

/**
 * Middleware to sanitize request body
 */
export const sanitizeBody = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  next();
};

/**
 * Generate a secure random token
 */
export const generateSecureToken = (length = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash data with a secure algorithm
 */
export const hashData = (data: string, salt?: string): { hash: string; salt: string } => {
  const useSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(data, useSalt, 1000, 64, 'sha512')
    .toString('hex');

  return { hash, salt: useSalt };
};

/**
 * Verify a hashed value against its original
 */
export const verifyHash = (data: string, hash: string, salt: string): boolean => {
  const hashedData = hashData(data, salt);
  return hashedData.hash === hash;
};