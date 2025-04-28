import crypto from "crypto";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// Promisify scrypt
const scryptAsync = promisify(scrypt);

/**
 * Constants for password security
 */
const ITERATIONS = 10000;
const KEY_LENGTH = 64;
const SALT_LENGTH = 32;
const DIGEST = 'sha512';
const PEPPER = process.env.PASSWORD_PEPPER || 'default-pepper-replace-in-production';

/**
 * Hash a password using a secure algorithm
 * @param password Plain text password
 * @returns Password hash and salt, joined by a dot
 */
export async function hashPassword(password: string): Promise<string> {
  // Add pepper to password before hashing
  const pepperedPassword = `${password}${PEPPER}`;
  
  // Generate random salt
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  
  // Hash password with scrypt
  const derivedKey = await scryptAsync(pepperedPassword, salt, KEY_LENGTH) as Buffer;
  
  // Return the hashed password with salt
  return `${derivedKey.toString('hex')}.${salt}`;
}

/**
 * Verify a password against a hash
 * @param password Plain text password to verify
 * @param storedHash The stored hash.salt combination
 * @returns Boolean indicating if password matches
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  // Add pepper to password before hashing
  const pepperedPassword = `${password}${PEPPER}`;
  
  // Extract hash and salt
  const [hash, salt] = storedHash.split('.');
  
  // Hash the supplied password
  const derivedKey = await scryptAsync(pepperedPassword, salt, KEY_LENGTH) as Buffer;
  
  // Compare hashes using timing-safe comparison
  return timingSafeEqual(derivedKey.toString('hex'), hash);
}

/**
 * Check password strength
 * @param password Password to check
 * @returns Object with score and feedback
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  // Length check (up to 5 points)
  if (password.length >= 8) score += 1;
  if (password.length >= 10) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 14) score += 1;
  if (password.length >= 16) score += 1;
  
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters long');
  }
  
  // Character variety checks (up to 4 points)
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include at least one lowercase letter');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include at least one uppercase letter');
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Include at least one number');
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Include at least one special character');
  
  // Common patterns and dictionary words (penalties)
  const commonPatterns = [
    /^12345/, /password/i, /admin/i, /user/i, /qwerty/i,
    /abc123/i, /letmein/i, /welcome/i, /monkey/i, /sunshine/i
  ];
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      score = Math.max(0, score - 2);
      feedback.push('Avoid common words and patterns');
      break;
    }
  }
  
  // Sequential characters check (penalty)
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid sequential characters');
  }
  
  // Repeated characters check (penalty)
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid repeated characters');
  }
  
  return {
    score: Math.min(10, score), // Max score of 10
    feedback: feedback.length > 0 ? feedback : ['Password is strong']
  };
}

/**
 * Generate a cryptographically secure random password
 * @param length Length of password to generate
 * @returns A secure random password
 */
export function generateSecurePassword(length = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
  let password = '';
  
  const randomBytesCount = Math.ceil((length * 2) / 3); // Get more entropy than needed
  const randomBuffer = randomBytes(randomBytesCount);
  
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBuffer[i % randomBytesCount] % charset.length;
    password += charset[randomIndex];
  }
  
  return password;
}

/**
 * Compare two strings in a timing-safe manner to prevent timing attacks
 * @param a First string
 * @param b Second string
 * @returns Boolean indicating if strings match
 */
function timingSafeEqual(a: string, b: string): boolean {
  // Convert strings to Buffers for comparison
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  
  // If lengths are different, create a dummy buffer the same size as a
  if (bufA.length !== bufB.length) {
    const dummyBuffer = Buffer.alloc(bufA.length);
    return crypto.timingSafeEqual(bufA, dummyBuffer) && false;
  }
  
  // Compare Buffers
  return crypto.timingSafeEqual(bufA, bufB);
}