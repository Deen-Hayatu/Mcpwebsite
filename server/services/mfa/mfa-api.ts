import { Request, Response } from 'express';
import { 
  generateMfaSecret, 
  enableMfa, 
  disableMfa, 
  verifyMfaForLogin 
} from './mfa-service';
import { storage } from '../../storage';

/**
 * API route to generate MFA secret for a user
 */
export async function generateMfaSecretHandler(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Get user email
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const email = user.email || 'user@mpcghana.org';
    const { secret, qrCode } = await generateMfaSecret(userId, email);
    
    // Store the temp secret in session for later verification
    if (req.session) {
      req.session.tempMfaSecret = secret;
    }
    
    res.json({ secret, qrCode });
  } catch (error) {
    console.error('MFA generation error:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to generate MFA secret' 
    });
  }
}

/**
 * API route to enable MFA for a user
 */
export async function enableMfaHandler(req: Request, res: Response) {
  try {
    const { userId, token, secret } = req.body;
    
    if (!userId || !token) {
      return res.status(400).json({ message: 'User ID and token are required' });
    }
    
    // Use the provided secret or the one from the session
    const secretToUse = secret || req.session?.tempMfaSecret;
    
    if (!secretToUse) {
      return res.status(400).json({ message: 'No MFA secret found. Please generate a new one.' });
    }
    
    const result = await enableMfa(userId, token, secretToUse);
    
    // Clear the temp secret from session
    if (req.session) {
      delete req.session.tempMfaSecret;
    }
    
    res.json(result);
  } catch (error) {
    console.error('MFA enable error:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Failed to enable MFA' 
    });
  }
}

/**
 * API route to disable MFA for a user
 */
export async function disableMfaHandler(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    await disableMfa(userId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('MFA disable error:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to disable MFA' 
    });
  }
}

/**
 * API route to verify MFA during login
 */
export async function verifyMfaHandler(req: Request, res: Response) {
  try {
    const { userId, token } = req.body;
    
    if (!userId || !token) {
      return res.status(400).json({ message: 'User ID and token are required' });
    }
    
    // Verify the MFA token
    const user = await verifyMfaForLogin(userId, token);
    
    // Set login status in session (mark MFA as verified)
    if (req.session) {
      req.session.mfaVerified = true;
      delete req.session.mfaUserId;
    }
    
    // Return user without password
    const { password, mfaSecret, ...userWithoutSensitiveData } = user;
    
    res.json(userWithoutSensitiveData);
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Invalid verification code' 
    });
  }
}

/**
 * API route to get security information for a user
 */
export async function getSecurityInfoHandler(req: Request, res: Response) {
  try {
    // Must be authenticated to access
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Get active sessions for the user
    const sessions = await storage.getActiveSessions(req.user.id);
    
    // Get current session ID
    const currentSessionId = req.sessionID;
    
    res.json({
      sessions,
      currentSessionId
    });
  } catch (error) {
    console.error('Security info error:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to get security information' 
    });
  }
}

/**
 * API route to terminate a session
 */
export async function terminateSessionHandler(req: Request, res: Response) {
  try {
    const { userId, sessionId } = req.body;
    
    if (!userId || !sessionId) {
      return res.status(400).json({ message: 'User ID and session ID are required' });
    }
    
    // Verify user owns this session or is an admin
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    // Terminate the session
    await storage.terminateSession(userId, sessionId);
    
    // If terminating current session, logout
    if (sessionId === req.sessionID) {
      req.logout((err) => {
        if (err) {
          console.error('Logout error:', err);
        }
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Terminate session error:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to terminate session' 
    });
  }
}