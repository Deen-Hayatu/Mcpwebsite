import { Request, Response } from "express";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { storage } from "../../storage";

/**
 * Generate a new MFA secret for a user
 */
export async function generateMfaSecret(req: Request, res: Response) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Generate a new secret using speakeasy
    const secret = speakeasy.generateSecret({
      name: `MPC Ghana (${req.user.username})`,
      issuer: "Movement for Positive Change"
    });

    // Save the secret temporarily
    await storage.saveTempMfaSecret(req.user.id, secret.base32);

    // Generate QR code for the secret
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || "");

    // Generate backup codes
    const backupCodes = Array(10)
      .fill(0)
      .map(() => Math.random().toString(36).substring(2, 8).toUpperCase())
      .map(code => code.slice(0, 3) + "-" + code.slice(3));

    res.json({
      tempSecret: secret.base32,
      qrCode,
      backupCodes
    });
  } catch (error) {
    console.error("Error generating MFA secret:", error);
    res.status(500).json({ message: "Failed to generate MFA secret" });
  }
}

/**
 * Enable MFA for a user after verification
 */
export async function enableMfa(req: Request, res: Response) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { token, tempSecret, backupCodes } = req.body;

  if (!token || !tempSecret || !backupCodes || !Array.isArray(backupCodes)) {
    return res.status(400).json({ message: "Invalid MFA request" });
  }

  try {
    // Verify the token with the tempSecret
    const verified = speakeasy.totp.verify({
      secret: tempSecret,
      encoding: "base32",
      token: token.replace(/\s/g, "")
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Enable MFA for the user
    const updatedUser = await storage.enableMfa(req.user.id, tempSecret, backupCodes);

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to enable MFA" });
    }

    // Remove sensitive data before sending response
    const { password, mfaSecret, mfaBackupCodes, ...safeUserData } = updatedUser;

    res.json({
      message: "MFA enabled successfully",
      user: safeUserData
    });
  } catch (error) {
    console.error("Error enabling MFA:", error);
    res.status(500).json({ message: "Failed to enable MFA" });
  }
}

/**
 * Disable MFA for a user
 */
export async function disableMfa(req: Request, res: Response) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const updatedUser = await storage.disableMfa(req.user.id);

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to disable MFA" });
    }

    // Remove sensitive data before sending response
    const { password, mfaSecret, mfaBackupCodes, ...safeUserData } = updatedUser;

    res.json({
      message: "MFA disabled successfully",
      user: safeUserData
    });
  } catch (error) {
    console.error("Error disabling MFA:", error);
    res.status(500).json({ message: "Failed to disable MFA" });
  }
}

/**
 * Verify MFA token during login
 */
export async function verifyMfa(req: Request, res: Response) {
  const { userId, token, isBackupCode = false } = req.body;

  if (!userId || (!token && !isBackupCode)) {
    return res.status(400).json({ message: "Invalid MFA verification request" });
  }

  try {
    // Get the user
    const user = await storage.getUser(userId);

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      return res.status(400).json({ message: "User not found or MFA not enabled" });
    }

    let verified = false;

    if (isBackupCode) {
      // Verify backup code
      if (!user.mfaBackupCodes || !Array.isArray(user.mfaBackupCodes)) {
        return res.status(400).json({ message: "No backup codes available" });
      }

      const normalizedToken = token.trim().toUpperCase();
      const backupCodeIndex = user.mfaBackupCodes.indexOf(normalizedToken);

      if (backupCodeIndex !== -1) {
        // Remove the used backup code
        const updatedBackupCodes = [...user.mfaBackupCodes];
        updatedBackupCodes.splice(backupCodeIndex, 1);
        
        // Update the user's backup codes
        await storage.updateMfaBackupCodes(userId, updatedBackupCodes);
        verified = true;
      }
    } else if (user.mfaSecret) {
      // Verify TOTP
      verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: "base32",
        token: token.replace(/\s/g, "")
      });
    }

    if (!verified) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Mark the session as MFA verified
    if (req.session) {
      req.session.mfaVerified = true;
    }

    // Update last login
    const ip = (req.headers['x-forwarded-for'] as string) || 
               req.socket.remoteAddress || 
               'unknown';
    await storage.updateUserLastLogin(userId, ip.split(',')[0].trim());

    res.json({
      success: true,
      message: "MFA verification successful"
    });
  } catch (error) {
    console.error("Error verifying MFA:", error);
    res.status(500).json({ message: "Failed to verify MFA" });
  }
}

/**
 * Get user security information including active sessions
 */
export async function getSecurityInfo(req: Request, res: Response) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Get user sessions
    const sessions = await storage.getUserSessions(req.user.id);

    // Map sessions to include more readable device information
    const activeSessions = sessions.map(session => {
      const { browser, os } = parseUserAgent(session.userAgent || "unknown");
      
      return {
        id: session.id,
        sessionId: session.sessionId,
        current: session.sessionId === req.sessionID,
        ipAddress: session.ipAddress,
        browser,
        os,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity
      };
    });

    res.json({
      userId: req.user.id,
      mfaEnabled: req.user.mfaEnabled || false,
      lastLogin: req.user.lastLoginAt || null,
      lastLoginIp: req.user.lastLoginIp || null,
      passwordLastChanged: req.user.passwordLastChanged || null,
      activeSessions
    });
  } catch (error) {
    console.error("Error getting security info:", error);
    res.status(500).json({ message: "Failed to get security information" });
  }
}

/**
 * Terminate a user session
 */
export async function terminateSession(req: Request, res: Response) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required" });
  }

  // Prevent terminating the current session
  if (sessionId === req.sessionID) {
    return res.status(400).json({ message: "Cannot terminate the current session" });
  }

  try {
    const success = await storage.terminateUserSession(req.user.id, sessionId);

    if (!success) {
      return res.status(404).json({ message: "Session not found or already terminated" });
    }

    res.json({
      success: true,
      message: "Session terminated successfully"
    });
  } catch (error) {
    console.error("Error terminating session:", error);
    res.status(500).json({ message: "Failed to terminate session" });
  }
}

/**
 * Helper function to parse user agent string
 */
function parseUserAgent(userAgent: string): { browser: string, os: string } {
  // This is a simplified user agent parser
  const result = { browser: "Unknown", os: "Unknown" };

  // Detect browser
  if (userAgent.includes("Firefox")) {
    result.browser = "Firefox";
  } else if (userAgent.includes("Chrome") && !userAgent.includes("Edge") && !userAgent.includes("OPR")) {
    result.browser = "Chrome";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome") && !userAgent.includes("Edge")) {
    result.browser = "Safari";
  } else if (userAgent.includes("Edge") || userAgent.includes("Edg")) {
    result.browser = "Edge";
  } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
    result.browser = "Opera";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
    result.browser = "Internet Explorer";
  }

  // Detect OS
  if (userAgent.includes("Windows")) {
    result.os = "Windows";
  } else if (userAgent.includes("Mac OS")) {
    result.os = "macOS";
  } else if (userAgent.includes("Linux")) {
    result.os = "Linux";
  } else if (userAgent.includes("iPhone")) {
    result.os = "iOS";
  } else if (userAgent.includes("Android")) {
    result.os = "Android";
  }

  return result;
}