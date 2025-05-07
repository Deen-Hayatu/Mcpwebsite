import { Express, Request, Response } from "express";
import { mfaService } from "./mfa-service";
import { z } from "zod";
import { mfaUserSchema } from "@shared/schema";
import QRCode from "qrcode";

/**
 * Register MFA-related API routes
 */
export function registerMfaRoutes(app: Express): void {
  // Generate a new MFA secret for setup
  app.post("/api/auth/mfa/generate", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user!.id;
      const { secret, otpAuthUrl } = await mfaService.generateMfaSecret(userId);

      // Generate a QR code for the OTP auth URL
      const qrCodeImage = await QRCode.toDataURL(otpAuthUrl);

      // Store the secret temporarily in the session for the enable endpoint
      req.session.tempMfaSecret = secret;

      res.json({
        secret: secret,
        qrCode: qrCodeImage,
      });
    } catch (error) {
      console.error("MFA setup error:", error);
      res.status(500).json({ message: "Failed to set up MFA" });
    }
  });

  // Enable MFA for a user (after validation with token)
  app.post("/api/auth/mfa/enable", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tokenSchema = z.object({
      token: z.string().min(6).max(8),
    });

    try {
      const { token } = tokenSchema.parse(req.body);
      const userId = req.user!.id;
      const secret = req.session.tempMfaSecret;

      if (!secret) {
        return res.status(400).json({ message: "MFA setup not initiated" });
      }

      const success = await mfaService.enableMfa(userId, secret, token);

      if (success) {
        // Delete the temp secret from session
        delete req.session.tempMfaSecret;
        
        // Get the backup codes to return to the user
        const [user] = await db
          .select({ mfaBackupCodes: users.mfaBackupCodes })
          .from(users)
          .where(eq(users.id, userId));
        
        res.json({ 
          success: true,
          backupCodes: user?.mfaBackupCodes || []
        });
      } else {
        res.status(400).json({ message: "Invalid verification code" });
      }
    } catch (error) {
      console.error("MFA enable error:", error);
      res.status(500).json({ message: "Failed to enable MFA" });
    }
  });

  // Disable MFA for a user
  app.post("/api/auth/mfa/disable", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user!.id;
      await mfaService.disableMfa(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("MFA disable error:", error);
      res.status(500).json({ message: "Failed to disable MFA" });
    }
  });

  // Verify MFA token during login
  app.post("/api/auth/mfa/verify", async (req: Request, res: Response) => {
    if (!req.session.mfaUserId) {
      return res.status(400).json({ message: "No MFA authentication in progress" });
    }

    const tokenSchema = z.object({
      token: z.string().min(6).max(12),
    });

    try {
      const { token } = tokenSchema.parse(req.body);
      const userId = req.session.mfaUserId;

      const isValid = await mfaService.verifyMfaForUser(userId, token);

      if (isValid) {
        // Clean up session MFA data
        delete req.session.mfaUserId;
        
        // Complete the login process
        const user = await storage.getUser(userId);
        
        // Login the user through Passport
        req.login(user, (err) => {
          if (err) {
            return res.status(500).json({ message: "Login failed after MFA" });
          }
          
          res.json({ success: true, user });
        });
      } else {
        res.status(400).json({ message: "Invalid verification code" });
      }
    } catch (error) {
      console.error("MFA verification error:", error);
      res.status(500).json({ message: "Failed to verify MFA token" });
    }
  });

  // Regenerate backup codes
  app.post("/api/auth/mfa/backup-codes", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user!.id;
      const backupCodes = await mfaService.regenerateBackupCodes(userId);
      res.json({ backupCodes });
    } catch (error) {
      console.error("MFA backup codes error:", error);
      res.status(500).json({ message: "Failed to regenerate backup codes" });
    }
  });
}

// Import for the middleware using private function
import { db } from "../../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { storage } from "../../storage";

/**
 * Middleware to check if MFA is required for the current session
 */
export function mfaRequiredMiddleware(req: Request, res: Response, next: Function) {
  // Skip if user is not authenticated
  if (!req.isAuthenticated()) {
    return next();
  }

  // Skip if this is an MFA verification request
  if (req.path === '/api/auth/mfa/verify') {
    return next();
  }

  // Check if the user has MFA enabled and we're not already in an MFA verification process
  const userHasMfa = req.user!.mfaEnabled;
  const mfaVerified = req.session.mfaVerified;

  if (userHasMfa && !mfaVerified) {
    // Store the user ID in the session for the verification step
    req.session.mfaUserId = req.user!.id;
    
    // Log them out - they'll need to complete MFA
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      
      return res.status(403).json({ 
        requireMfa: true,
        message: "MFA verification required" 
      });
    });
  } else {
    next();
  }
}