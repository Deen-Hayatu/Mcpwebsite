import { db } from "../db";
import { 
  securityTokens, securityAuditLogs, loginAttempts, userSessions,
  TokenType, AuditAction, ResourceType,
  type InsertSecurityToken, type InsertSecurityAuditLog, 
  type InsertLoginAttempt, type InsertUserSession
} from "../models/security";
import crypto from "crypto";
import { eq, lt, and, desc, sql } from "drizzle-orm";
import { Request } from "express";

/**
 * Service for handling security-related operations
 */
export class SecurityService {
  
  /**
   * Create a security token (e.g., password reset, email verification)
   */
  async createSecurityToken(
    userId: number, 
    tokenType: TokenType,
    expiresInMinutes: number = 60
  ): Promise<string> {
    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    
    // Calculate expiry time
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
    
    // Insert into database
    await db.insert(securityTokens).values({
      userId,
      tokenType,
      token,
      expiresAt,
    });
    
    return token;
  }
  
  /**
   * Validate a security token
   */
  async validateSecurityToken(
    userId: number,
    token: string,
    tokenType: TokenType
  ): Promise<boolean> {
    const now = new Date();
    
    // Find the token
    const [result] = await db
      .select()
      .from(securityTokens)
      .where(
        and(
          eq(securityTokens.userId, userId),
          eq(securityTokens.token, token),
          eq(securityTokens.tokenType, tokenType),
          eq(securityTokens.isRevoked, false),
          sql`${securityTokens.expiresAt} > ${now.toISOString()}`
        )
      );
    
    return !!result;
  }
  
  /**
   * Invalidate a security token
   */
  async invalidateSecurityToken(
    userId: number,
    token: string,
    tokenType: TokenType
  ): Promise<void> {
    await db
      .update(securityTokens)
      .set({ 
        isRevoked: true,
        usedAt: new Date()
      })
      .where(
        and(
          eq(securityTokens.userId, userId),
          eq(securityTokens.token, token),
          eq(securityTokens.tokenType, tokenType)
        )
      );
  }
  
  /**
   * Clean up expired and used tokens
   */
  async cleanupTokens(): Promise<void> {
    const now = new Date();
    
    // Remove tokens that are expired or have been used
    await db
      .delete(securityTokens)
      .where(
        or(
          sql`${securityTokens.expiresAt} < ${now.toISOString()}`,
          eq(securityTokens.isRevoked, true)
        )
      );
  }
  
  /**
   * Log a security-related event
   */
  async logSecurityEvent(
    data: {
      userId?: number;
      action: AuditAction;
      resourceType?: ResourceType;
      resourceId?: string | number;
      ipAddress?: string;
      userAgent?: string;
      metadata?: string;
    }
  ): Promise<void> {
    await db.insert(securityAuditLogs).values(data);
  }
  
  /**
   * Record a login attempt
   */
  async recordLoginAttempt(
    username: string,
    isSuccessful: boolean,
    ipAddress: string,
    userAgent?: string
  ): Promise<void> {
    await db.insert(loginAttempts).values({
      username,
      isSuccessful,
      ipAddress,
      userAgent,
    });
  }
  
  /**
   * Check if an IP address is making too many login attempts
   */
  async checkBruteForceByIP(
    ipAddress: string,
    maxAttempts: number = 5,
    timeWindowMinutes: number = 15
  ): Promise<boolean> {
    const timeWindow = new Date();
    timeWindow.setMinutes(timeWindow.getMinutes() - timeWindowMinutes);
    
    // Count recent failed attempts
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(loginAttempts)
      .where(
        and(
          eq(loginAttempts.ipAddress, ipAddress),
          eq(loginAttempts.isSuccessful, false),
          sql`${loginAttempts.timestamp} > ${timeWindow.toISOString()}`
        )
      );
    
    return (result?.count || 0) >= maxAttempts;
  }
  
  /**
   * Check if a username is being targeted with too many login attempts
   */
  async checkBruteForceByUsername(
    username: string,
    maxAttempts: number = 5,
    timeWindowMinutes: number = 15
  ): Promise<boolean> {
    const timeWindow = new Date();
    timeWindow.setMinutes(timeWindow.getMinutes() - timeWindowMinutes);
    
    // Count recent failed attempts
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(loginAttempts)
      .where(
        and(
          eq(loginAttempts.username, username),
          eq(loginAttempts.isSuccessful, false),
          sql`${loginAttempts.timestamp} > ${timeWindow.toISOString()}`
        )
      );
    
    return (result?.count || 0) >= maxAttempts;
  }
  
  /**
   * Create a user session record
   */
  async createUserSession(
    userId: number,
    sessionId: string,
    ipAddress?: string,
    userAgent?: string,
    expiryHours: number = 24
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiryHours);
    
    await db.insert(userSessions).values({
      userId,
      sessionId,
      ipAddress,
      userAgent,
      expiresAt,
    });
  }
  
  /**
   * Update session last activity timestamp
   */
  async updateSessionActivity(
    sessionId: string
  ): Promise<void> {
    await db
      .update(userSessions)
      .set({ lastActivity: new Date() })
      .where(eq(userSessions.sessionId, sessionId));
  }
  
  /**
   * Revoke a specific user session
   */
  async revokeSession(
    sessionId: string
  ): Promise<void> {
    await db
      .update(userSessions)
      .set({ 
        isActive: false,
        isRevoked: true
      })
      .where(eq(userSessions.sessionId, sessionId));
  }
  
  /**
   * Revoke all sessions for a user except the current one
   */
  async revokeOtherSessions(
    userId: number,
    currentSessionId: string
  ): Promise<void> {
    await db
      .update(userSessions)
      .set({ 
        isActive: false,
        isRevoked: true
      })
      .where(
        and(
          eq(userSessions.userId, userId),
          not(eq(userSessions.sessionId, currentSessionId))
        )
      );
  }
  
  /**
   * Get user's active sessions
   */
  async getUserActiveSessions(
    userId: number
  ): Promise<Array<{ id: number, ipAddress: string | null, userAgent: string | null, createdAt: Date }>> {
    return await db
      .select({
        id: userSessions.id,
        ipAddress: userSessions.ipAddress,
        userAgent: userSessions.userAgent,
        createdAt: userSessions.createdAt
      })
      .from(userSessions)
      .where(
        and(
          eq(userSessions.userId, userId),
          eq(userSessions.isActive, true),
          eq(userSessions.isRevoked, false),
          sql`${userSessions.expiresAt} > ${new Date().toISOString()}`
        )
      )
      .orderBy(desc(userSessions.lastActivity));
  }
  
  /**
   * Clean up expired sessions
   */
  async cleanupSessions(): Promise<void> {
    const now = new Date();
    
    // Deactivate expired sessions
    await db
      .update(userSessions)
      .set({ isActive: false })
      .where(
        and(
          eq(userSessions.isActive, true),
          sql`${userSessions.expiresAt} < ${now.toISOString()}`
        )
      );
    
    // Delete very old sessions (e.g., more than 30 days old)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    await db
      .delete(userSessions)
      .where(sql`${userSessions.createdAt} < ${thirtyDaysAgo.toISOString()}`);
  }
  
  /**
   * Get client IP from request
   */
  getClientIP(req: Request): string {
    return (
      req.headers['x-forwarded-for'] as string || 
      req.socket.remoteAddress || 
      'unknown'
    );
  }
  
  /**
   * Get security-related headers for responses
   */
  getSecurityHeaders(): Record<string, string> {
    return {
      // Two-year duration with preload directive for HSTS browser inclusion
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'same-origin',
      'Permissions-Policy': 'geolocation=(self), microphone=(), camera=()',
      // Add certificate transparency for EV/OV expectations
      'Expect-CT': 'enforce, max-age=30',
      // Added for browser compatibility with OV/EV certificates
      'Access-Control-Allow-Origin': 'https://mpcghana.org',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Cross-Origin-Opener-Policy': 'same-origin'
    };
  }
}

// Create singleton instance
export const securityService = new SecurityService();

// Helper function for "or" condition
function or(...conditions: unknown[]) {
  return sql`(${sql.join(conditions, sql` OR `)})`;
}

// Helper function for "not" condition
function not(condition: unknown) {
  return sql`NOT (${condition})`;
}