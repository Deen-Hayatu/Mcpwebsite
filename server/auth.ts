import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session, { SessionData } from "express-session";

// Extend the session types to include our MFA-related properties
declare module 'express-session' {
  interface SessionData {
    mfaUserId?: number;
    tempMfaSecret?: string;
    mfaVerified?: boolean;
  }
}
import { storage } from "./storage";
import { hashPassword, verifyPassword } from "./utils/password";
import { securityService } from "./services/security";
import { AuditAction, ResourceType, TokenType } from "./models/security";
import { User } from "@shared/schema";
import crypto from "crypto";
import { registerMfaRoutes, mfaRequiredMiddleware } from "./services/mfa/mfa-api";

// Extend Express User with our User type
declare global {
  namespace Express {
    // Define the User interface directly to avoid recursive reference
    interface User {
      id: number;
      username: string;
      password: string;
      email: string;
      isAdmin: boolean | null;
      mfaEnabled: boolean | null;
      mfaSecret: string | null;
      mfaBackupCodes: string[] | null;
      role: string | null;
      permissions: string[] | null;
      accountLocked: boolean | null;
      lockReason: string | null;
      passwordLastChanged: Date | null;
      requirePasswordChange: boolean | null;
      emailVerified: boolean | null;
      lastLoginAt: Date | null;
      lastLoginIp: string | null;
    }
  }
}

/**
 * Setup authentication middleware and routes
 */
export function setupAuth(app: Express) {
  // Configure session
  const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
  
  // Generate a secure session secret if not provided
  if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = crypto.randomBytes(64).toString('hex');
    console.warn("Warning: SESSION_SECRET not set. Using auto-generated secret for this session.");
  }
  
  const sessionOptions: session.SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: SESSION_MAX_AGE,
      sameSite: 'lax'
    },
    name: 'mpcghana.sid' // Custom session name
  };
  
  // In production, configure secure cookies
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
  }
  
  // Initialize session
  app.use(session(sessionOptions));
  
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure Passport local strategy
  passport.use(new LocalStrategy(
    {
      usernameField: 'username', // or 'email' if you prefer
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      try {
        // Find user by username
        const user = await storage.getUserByUsername(username);
        
        // Get client IP for logging
        const ipAddress = securityService.getClientIP(req);
        const userAgent = req.headers['user-agent'];
        
        // Check if user exists and password is correct
        if (!user || !(await verifyPassword(password, user.password))) {
          // Log failed attempt
          await securityService.recordLoginAttempt(
            username, 
            false, 
            ipAddress, 
            userAgent
          );
          
          // Check for brute force attempts
          const isBruteForceIP = await securityService.checkBruteForceByIP(ipAddress);
          const isBruteForceUsername = await securityService.checkBruteForceByUsername(username);
          
          if (isBruteForceIP || isBruteForceUsername) {
            return done(null, false, { message: 'Too many failed attempts. Please try again later.' });
          }
          
          return done(null, false, { message: 'Invalid username or password' });
        }
        
        // Log successful login
        await securityService.recordLoginAttempt(
          username, 
          true, 
          ipAddress, 
          userAgent
        );
        
        // Log security event
        await securityService.logSecurityEvent({
          userId: user.id,
          action: AuditAction.USER_LOGIN,
          ipAddress,
          userAgent
        });
        
        // Create a session record
        await securityService.createUserSession(
          user.id,
          req.sessionID,
          ipAddress,
          userAgent
        );
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  // Authentication routes
  
  // Register new user
  app.post('/api/register', async (req, res, next) => {
    try {
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(req.body.password);
      
      // Create user
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword
      });
      
      // Log security event
      await securityService.logSecurityEvent({
        userId: user.id,
        action: AuditAction.USER_CREATED,
        ipAddress: securityService.getClientIP(req),
        userAgent: req.headers['user-agent']
      });
      
      // Login user
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Login user
  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Authentication failed' });
      }
      
      // Check if MFA is enabled for this user
      if (user.mfaEnabled) {
        // Store user ID in session for MFA verification
        req.session.mfaUserId = user.id;
        
        // Don't log in yet, wait for MFA verification
        return res.status(200).json({
          requireMfa: true,
          userId: user.id,
          message: 'MFA verification required'
        });
      }
      
      // If no MFA required, proceed with login
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Update last login information
        storage.updateUserLastLogin(user.id, securityService.getClientIP(req))
          .catch(console.error);
        
        // Remove sensitive data from response
        const { password, mfaSecret, mfaBackupCodes, ...userWithoutSensitiveData } = user;
        res.json(userWithoutSensitiveData);
      });
    })(req, res, next);
  });
  
  // Logout user
  app.post('/api/logout', (req, res, next) => {
    // Log security event before logging out
    if (req.isAuthenticated()) {
      securityService.logSecurityEvent({
        userId: req.user.id,
        action: AuditAction.USER_LOGOUT,
        ipAddress: securityService.getClientIP(req),
        userAgent: req.headers['user-agent']
      }).catch(console.error);
      
      // Revoke the session
      if (req.sessionID) {
        securityService.revokeSession(req.sessionID).catch(console.error);
      }
    }
    
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        
        res.clearCookie('mpcghana.sid');
        res.sendStatus(200);
      });
    });
  });
  
  // Get current user
  app.get('/api/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    
    // Remove sensitive data from response
    const { password, mfaSecret, mfaBackupCodes, ...userWithoutSensitiveData } = req.user!;
    res.json(userWithoutSensitiveData);
  });
  
  // Register MFA endpoints
  registerMfaRoutes(app);
  
  // Request password reset
  app.post('/api/password-reset/request', async (req, res, next) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // Check if user exists
      const user = await storage.getUserByUsername(email);
      
      // Don't reveal if user exists, but still log the request
      if (!user) {
        return res.json({ message: 'If a user with that email exists, a password reset link has been sent' });
      }
      
      // Generate reset token
      const resetToken = await securityService.createSecurityToken(
        user.id,
        TokenType.PASSWORD_RESET,
        60 // Token expires in 60 minutes
      );
      
      // In a real implementation, send an email with the reset token
      // For now, just return it in development mode
      const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}&userId=${user.id}`;
      
      // Log the security event
      await securityService.logSecurityEvent({
        userId: user.id,
        action: AuditAction.PASSWORD_RESET_REQUESTED,
        ipAddress: securityService.getClientIP(req),
        userAgent: req.headers['user-agent']
      });
      
      // In development, return the token for testing
      // In production, only send via email
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          message: 'Password reset link generated',
          resetLink,
          token: resetToken,
          userId: user.id
        });
      }
      
      // For production
      res.json({ message: 'If a user with that email exists, a password reset link has been sent' });
    } catch (error) {
      next(error);
    }
  });
  
  // Reset password with token
  app.post('/api/password-reset/reset', async (req, res, next) => {
    try {
      const { userId, token, newPassword } = req.body;
      
      if (!userId || !token || !newPassword) {
        return res.status(400).json({ message: 'User ID, reset token, and new password are required' });
      }
      
      // Check if user exists
      const user = await storage.getUserByUsername(userId);
      if (!user) {
        return res.status(400).json({ message: 'Invalid reset request' });
      }
      
      // Validate token
      const isValid = await securityService.validateSecurityToken(
        user.id,
        token,
        TokenType.PASSWORD_RESET
      );
      
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update password
      await storage.updateUserPassword(user.id, hashedPassword);
      
      // Invalidate token
      await securityService.invalidateSecurityToken(
        user.id,
        token,
        TokenType.PASSWORD_RESET
      );
      
      // Log security event
      await securityService.logSecurityEvent({
        userId: user.id,
        action: AuditAction.PASSWORD_RESET_COMPLETED,
        ipAddress: securityService.getClientIP(req),
        userAgent: req.headers['user-agent']
      });
      
      // Revoke all other sessions
      if (req.sessionID) {
        await securityService.revokeOtherSessions(user.id, req.sessionID);
      }
      
      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      next(error);
    }
  });
  
  // Get user's active sessions
  app.get('/api/user/sessions', async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'You must be logged in to view sessions' });
      }
      
      const sessions = await securityService.getUserActiveSessions(req.user.id);
      
      res.json({
        sessions,
        currentSessionId: req.sessionID
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Revoke a specific session
  app.post('/api/user/sessions/:sessionId/revoke', async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'You must be logged in to revoke sessions' });
      }
      
      const { sessionId } = req.params;
      
      // Prevent revoking current session
      if (sessionId === req.sessionID) {
        return res.status(400).json({ message: 'Cannot revoke current session' });
      }
      
      await securityService.revokeSession(sessionId);
      
      // Log security event
      await securityService.logSecurityEvent({
        userId: req.user.id,
        action: AuditAction.SECURITY_EVENT,
        resourceType: ResourceType.USER,
        resourceId: req.user.id.toString(),
        ipAddress: securityService.getClientIP(req),
        userAgent: req.headers['user-agent'],
        metadata: JSON.stringify({ action: 'session_revoked', sessionId })
      });
      
      res.json({ message: 'Session revoked successfully' });
    } catch (error) {
      next(error);
    }
  });
  
  // Revoke all other sessions
  app.post('/api/user/sessions/revoke-all', async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'You must be logged in to revoke sessions' });
      }
      
      await securityService.revokeOtherSessions(req.user.id, req.sessionID);
      
      // Log security event
      await securityService.logSecurityEvent({
        userId: req.user.id,
        action: AuditAction.SECURITY_EVENT,
        resourceType: ResourceType.USER,
        resourceId: req.user.id.toString(),
        ipAddress: securityService.getClientIP(req),
        userAgent: req.headers['user-agent'],
        metadata: JSON.stringify({ action: 'all_sessions_revoked' })
      });
      
      res.json({ message: 'All other sessions revoked successfully' });
    } catch (error) {
      next(error);
    }
  });
  
  // Add MFA middleware to check if MFA verification is required
  // This should be applied after authentication routes but before protected routes
  app.use(mfaRequiredMiddleware);
  
  // Middleware to update session activity
  app.use((req, res, next) => {
    if (req.isAuthenticated() && req.sessionID) {
      securityService.updateSessionActivity(req.sessionID).catch(console.error);
    }
    next();
  });
}