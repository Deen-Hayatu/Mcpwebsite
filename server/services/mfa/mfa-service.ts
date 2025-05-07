import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { storage } from '../../storage';

/**
 * Generates a new MFA secret and QR code for a user
 */
export async function generateMfaSecret(userId: number, email: string) {
  // Generate a new secret
  const secret = speakeasy.generateSecret({
    length: 20,
    name: `MPC Ghana (${email})`
  });

  // Store temporary secret in the database or session
  await storage.saveTempMfaSecret(userId, secret.base32);

  // Generate QR code
  const qrCodeUrl = secret.otpauth_url;
  const qrCode = await QRCode.toDataURL(qrCodeUrl || '');

  return {
    secret: secret.base32,
    qrCode
  };
}

/**
 * Verifies an MFA token against a user's secret
 */
export function verifyMfaToken(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token
  });
}

/**
 * Verifies an MFA token directly with secret and backup codes
 * Used for verification without storing state
 */
export function verifyMfaWithBackupCodes(token: string, secret: string, backupCodes: string[] = []): boolean {
  // First check standard TOTP
  const isValidTotp = verifyMfaToken(token, secret);
  
  if (isValidTotp) {
    return true;
  }
  
  // If TOTP fails, check backup codes
  return backupCodes.includes(token);
}

/**
 * Enables MFA for a user
 */
export async function enableMfa(userId: number, token: string, secret: string) {
  // Verify the token first
  const isValid = verifyMfaToken(token, secret);
  
  if (!isValid) {
    throw new Error('Invalid verification code');
  }

  // Generate backup codes
  const backupCodes = generateBackupCodes();
  
  // Save the verified secret and backup codes to the user's account
  await storage.enableMfa(userId, secret, backupCodes);
  
  return { backupCodes };
}

/**
 * Disables MFA for a user
 */
export async function disableMfa(userId: number) {
  await storage.disableMfa(userId);
}

/**
 * Verifies an MFA token for login and handles backup codes
 * This is the primary verification method that should be used for login flows
 */
export async function verifyMfaForLogin(userId: number, token: string) {
  const user = await storage.getUser(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (!user.mfaEnabled || !user.mfaSecret) {
    throw new Error('MFA is not enabled for this user');
  }
  
  // Check standard TOTP token
  const isValid = verifyMfaToken(token, user.mfaSecret);
  
  if (isValid) {
    return user;
  }
  
  // If TOTP verification fails, check if token matches any backup code
  if (user.mfaBackupCodes && user.mfaBackupCodes.includes(token)) {
    // It's a backup code, consume it by removing it from the list
    const updatedBackupCodes = user.mfaBackupCodes.filter(code => code !== token);
    await storage.updateMfaBackupCodes(userId, updatedBackupCodes);
    return user;
  }
  
  // Both TOTP and backup code verification failed
  throw new Error('Invalid verification code');
}

/**
 * Generates a set of backup codes
 */
function generateBackupCodes(): string[] {
  const codes: string[] = [];
  
  // Generate 10 backup codes
  for (let i = 0; i < 10; i++) {
    // Generate a random 8-character code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  
  return codes;
}