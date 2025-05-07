import * as speakeasy from 'speakeasy';
import * as crypto from 'crypto';
import { db } from '../../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { securityService } from '../security';
import { AuditAction, ResourceType } from '../../models/security';

/**
 * Service for handling Multi-Factor Authentication
 */
export class MfaService {
  /**
   * Generate a new MFA secret for a user
   */
  async generateMfaSecret(userId: number): Promise<{ secret: string, otpAuthUrl: string }> {
    // Generate a new secret
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `MPC Ghana (${userId})`,
      issuer: 'MPC Ghana',
    });

    // Return the secret and OTP auth URL (for QR code generation)
    return {
      secret: secret.base32,
      otpAuthUrl: secret.otpauth_url || '',
    };
  }

  /**
   * Enable MFA for a user
   */
  async enableMfa(userId: number, secret: string, token: string): Promise<boolean> {
    // Verify the token before enabling MFA
    const isValid = this.verifyToken(secret, token);
    
    if (!isValid) {
      return false;
    }

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();
    
    // Update the user
    await db
      .update(users)
      .set({
        mfaEnabled: true,
        mfaSecret: secret,
        mfaBackupCodes: backupCodes,
      })
      .where(eq(users.id, userId));

    // Log the security event
    await securityService.logSecurityEvent({
      userId,
      action: AuditAction.SECURITY_EVENT,
      resourceType: ResourceType.USER,
      resourceId: userId,
      metadata: 'MFA Enabled',
    });

    return true;
  }

  /**
   * Disable MFA for a user
   */
  async disableMfa(userId: number): Promise<void> {
    await db
      .update(users)
      .set({
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: [],
      })
      .where(eq(users.id, userId));

    // Log the security event
    await securityService.logSecurityEvent({
      userId,
      action: AuditAction.SECURITY_EVENT,
      resourceType: ResourceType.USER,
      resourceId: userId,
      metadata: 'MFA Disabled',
    });
  }

  /**
   * Verify MFA token for a user
   */
  async verifyMfaForUser(userId: number, token: string): Promise<boolean> {
    // Get the user's MFA secret
    const [user] = await db
      .select({ mfaSecret: users.mfaSecret, mfaBackupCodes: users.mfaBackupCodes })
      .from(users)
      .where(eq(users.id, userId));

    if (!user || !user.mfaSecret) {
      return false;
    }

    // Check if the token is a valid OTP
    const isValid = this.verifyToken(user.mfaSecret, token);
    
    if (isValid) {
      return true;
    }

    // Check if the token is a valid backup code
    if (user.mfaBackupCodes && user.mfaBackupCodes.includes(token)) {
      // Remove the used backup code
      const updatedBackupCodes = user.mfaBackupCodes.filter(code => code !== token);
      
      await db
        .update(users)
        .set({ 
          mfaBackupCodes: updatedBackupCodes,
        })
        .where(eq(users.id, userId));

      // Log the security event
      await securityService.logSecurityEvent({
        userId,
        action: AuditAction.SECURITY_EVENT,
        resourceType: ResourceType.USER,
        resourceId: userId,
        metadata: 'MFA Backup Code Used',
      });
      
      return true;
    }

    return false;
  }

  /**
   * Verify a TOTP token
   */
  private verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 1, // Allow a 30-second window on either side for clock drift
    });
  }

  /**
   * Generate backup codes for MFA
   */
  private generateBackupCodes(count: number = 10, length: number = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length)
        .toUpperCase();
      
      // Format as XXXX-XXXX-XX
      const formattedCode = `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 10)}`;
      codes.push(formattedCode);
    }
    
    return codes;
  }

  /**
   * Regenerate backup codes for a user
   */
  async regenerateBackupCodes(userId: number): Promise<string[]> {
    const backupCodes = this.generateBackupCodes();
    
    await db
      .update(users)
      .set({ mfaBackupCodes: backupCodes })
      .where(eq(users.id, userId));

    // Log the security event
    await securityService.logSecurityEvent({
      userId,
      action: AuditAction.SECURITY_EVENT,
      resourceType: ResourceType.USER,
      resourceId: userId,
      metadata: 'MFA Backup Codes Regenerated',
    });
    
    return backupCodes;
  }
}

// Create singleton instance
export const mfaService = new MfaService();