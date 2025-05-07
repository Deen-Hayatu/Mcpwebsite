import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

declare module 'express-session' {
  interface SessionData {
    mfaUserId?: number;
    tempMfaSecret?: string;
    mfaVerified?: boolean;
  }
}

// List of paths that should not require MFA verification
const PUBLIC_PATHS = [
  '/api/mfa/verify',
  '/api/user',
  '/api/login',
  '/api/register',
  '/api/policy-briefs',
  '/api/research-metrics',
  '/api/staff',
  '/api/staff/featured',
  '/api/gallery',
  '/api/chatbot',
  '/api/contact',
  '/api/subscribe',
  '/api/unsubscribe',
  '/api/events',
  '/api/newsletters'
];

// Paths that start with these prefixes will be considered public
const PUBLIC_PATH_PREFIXES = [
  '/api/policy-briefs/',
  '/api/gallery/',
  '/api/staff/',
  '/api/events/',
  '/api/research-metrics/'
];

/**
 * Middleware to enforce MFA verification for routes that require it
 */
export function requireMfaVerification(req: Request, res: Response, next: NextFunction) {
  // Check if the path is public and should bypass MFA check
  const path = req.path;
  
  if (isPublicPath(path)) {
    return next();
  }
  
  // If not authenticated, no need for MFA check
  if (!req.isAuthenticated() || !req.user) {
    return next();
  }
  
  // If user doesn't have MFA enabled, no need for MFA check
  if (!req.user.mfaEnabled) {
    return next();
  }
  
  // If MFA is already verified in the session, proceed
  if (req.session && req.session.mfaVerified) {
    return next();
  }
  
  // Store user ID for MFA verification
  if (req.session) {
    req.session.mfaUserId = req.user.id;
  }
  
  // Return 403 to indicate MFA verification is required
  return res.status(403).json({
    message: "MFA verification required",
    requireMfa: true,
    userId: req.user.id
  });
}

/**
 * Check if a path is public and should bypass MFA verification
 */
function isPublicPath(path: string): boolean {
  // Check exact path matches
  if (PUBLIC_PATHS.includes(path)) {
    return true;
  }
  
  // Check path prefixes
  for (const prefix of PUBLIC_PATH_PREFIXES) {
    if (path.startsWith(prefix)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Middleware to track user sessions
 */
export function trackUserSession(req: Request, res: Response, next: NextFunction) {
  // Only track sessions for authenticated users
  if (req.isAuthenticated() && req.user && req.sessionID) {
    // Get IP address
    const ip = 
      (req.headers['x-forwarded-for'] as string) || 
      req.socket.remoteAddress || 
      'unknown';
    
    // Get user agent
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Update session activity asynchronously (don't wait for it)
    storage.updateUserSession(
      req.user.id, 
      req.sessionID, 
      ip.split(',')[0].trim(), // Use the first IP if forwarded
      userAgent
    ).catch(error => {
      console.error('Error tracking user session:', error);
    });
  }
  
  next();
}