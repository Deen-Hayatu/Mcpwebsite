import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Security models and tables
export const securityTokens = pgTable("security_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tokenType: text("token_type").notNull(), // 'password_reset', 'email_verification', etc.
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isRevoked: boolean("is_revoked").default(false),
  usedAt: timestamp("used_at"),
});

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionId: text("session_id").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  isActive: boolean("is_active").default(true),
  isRevoked: boolean("is_revoked").default(false),
});

export const loginAttempts = pgTable("login_attempts", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isSuccessful: boolean("is_successful").default(false),
});

export const securityAuditLogs = pgTable("security_audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: text("metadata"),
});

// Schema types
export const insertSecurityTokenSchema = createInsertSchema(securityTokens).pick({
  userId: true,
  tokenType: true,
  token: true,
  expiresAt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).pick({
  userId: true,
  sessionId: true,
  ipAddress: true,
  userAgent: true,
  expiresAt: true,
});

export const insertLoginAttemptSchema = createInsertSchema(loginAttempts).pick({
  username: true,
  ipAddress: true,
  userAgent: true,
  isSuccessful: true,
});

export const insertSecurityAuditLogSchema = createInsertSchema(securityAuditLogs).pick({
  userId: true,
  action: true,
  resourceType: true,
  resourceId: true,
  ipAddress: true,
  userAgent: true,
  metadata: true,
});

// Types
export type SecurityToken = typeof securityTokens.$inferSelect;
export type InsertSecurityToken = z.infer<typeof insertSecurityTokenSchema>;

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

export type LoginAttempt = typeof loginAttempts.$inferSelect;
export type InsertLoginAttempt = z.infer<typeof insertLoginAttemptSchema>;

export type SecurityAuditLog = typeof securityAuditLogs.$inferSelect;
export type InsertSecurityAuditLog = z.infer<typeof insertSecurityAuditLogSchema>;

// Enums for security operations
export enum TokenType {
  PASSWORD_RESET = 'password_reset',
  EMAIL_VERIFICATION = 'email_verification',
  API_KEY = 'api_key',
}

export enum AuditAction {
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DELETED = 'user_deleted',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  PASSWORD_RESET_REQUESTED = 'password_reset_requested',
  PASSWORD_RESET_COMPLETED = 'password_reset_completed',
  EMAIL_VERIFIED = 'email_verified',
  PERMISSION_CHANGED = 'permission_changed',
  ADMIN_ACTION = 'admin_action',
  RESOURCE_CREATED = 'resource_created',
  RESOURCE_UPDATED = 'resource_updated',
  RESOURCE_DELETED = 'resource_deleted',
  SECURITY_EVENT = 'security_event',
}

export enum ResourceType {
  USER = 'user',
  POLICY_BRIEF = 'policy_brief',
  EVENT = 'event',
  PROGRAM = 'program',
  SUBSCRIBER = 'subscriber',
  DONATION = 'donation',
  APPLICATION = 'application',
}