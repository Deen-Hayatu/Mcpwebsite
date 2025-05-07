import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { verifyMfaWithBackupCodes } from '../services/mfa/mfa-service';
import { db } from '../db';
import { userSessions } from '@shared/schema';

/**
 * Middleware that checks if MFA verification is required
 * If MFA is enabled for a user, they need to provide a valid MFA token to proceed
 */
export function requireMfaVerification(req: Request, res: Response, next: NextFunction) {
  // Skip MFA check if user is not authenticated
  if (!req.isAuthenticated() || !req.user) {
    return next();
  }

  // Skip MFA check if the request is for MFA verification or other MFA-related routes
  // or if it's for public API routes that don't require authentication
  if (
    req.path.includes('/api/mfa/') ||
    req.path.includes('/api/login') ||
    req.path.includes('/api/logout') ||
    req.path.includes('/api/register') ||
    req.path.includes('/api/policy-briefs') ||
    req.path.includes('/api/events') ||
    req.path.includes('/api/programs') ||
    req.path.includes('/api/subscribe') ||
    req.path.includes('/api/unsubscribe') ||
    req.path.includes('/api/contact') ||
    req.path.includes('/api/gallery') ||
    req.path.includes('/api/staff') ||
    req.path.includes('/api/chatbot')
  ) {
    return next();
  }

  // If user has MFA enabled, check if they've completed MFA verification for this session
  if (req.user.mfaEnabled) {
    // Check if session has MFA verified flag
    const isMfaVerified = req.session.mfaVerified === true;
    
    if (!isMfaVerified) {
      // User needs to complete MFA verification
      return res.status(403).json({
        message: 'MFA verification required',
        requiresMfa: true
      });
    }
  }

  // MFA is verified or not required, proceed
  next();
}

/**
 * Middleware to verify MFA token during login
 * This is used in the login flow when MFA is enabled
 */
export async function verifyMfaToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, userId } = req.body;
    
    if (!token || !userId) {
      return res.status(400).json({ message: 'MFA token and user ID are required' });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.mfaEnabled || !user.mfaSecret) {
      return res.status(400).json({ message: 'MFA is not enabled for this user' });
    }
    
    // Verify the token
    const isValid = verifyMfaWithBackupCodes(token, user.mfaSecret, user.mfaBackupCodes || []);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid MFA token' });
    }
    
    // If it was a backup code, update the list to remove the used code
    if (user.mfaBackupCodes && user.mfaBackupCodes.includes(token)) {
      const updatedBackupCodes = user.mfaBackupCodes.filter(code => code !== token);
      await storage.updateMfaBackupCodes(userId, updatedBackupCodes);
    }
    
    // Mark session as MFA verified
    if (req.session) {
      req.session.mfaVerified = true;
      
      // Record the session
      const sessionId = req.sessionID;
      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'] || '';
      
      await storage.saveTempMfaSecret(userId, ''); // Clear any temp secret
      
      // Create or update the user session record
      await db.insert(userSessions).values({
        userId,
        sessionId,
        ipAddress,
        userAgent,
        isActive: true,
        lastActivity: new Date()
      }).onConflictDoUpdate({
        target: userSessions.sessionId,
        set: {
          lastActivity: new Date(),
          isActive: true
        }
      });
    }
    
    next();
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to verify MFA token' 
    });
  }
}