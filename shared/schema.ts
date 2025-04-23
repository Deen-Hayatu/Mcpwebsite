import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
});

// Policy Briefs table
export const policyBriefs = pgTable("policy_briefs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
});

export const insertPolicyBriefSchema = createInsertSchema(policyBriefs).pick({
  title: true,
  date: true,
  excerpt: true,
  content: true,
});

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  time: text("time").notNull(),
  description: text("description").notNull(),
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  date: true,
  location: true,
  time: true,
  description: true,
});

// Programs table
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
});

export const insertProgramSchema = createInsertSchema(programs).pick({
  title: true,
  description: true,
});

// Newsletter Subscribers table
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  subscribed: boolean("subscribed").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
  name: true,
});

// Contact Messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type PolicyBrief = typeof policyBriefs.$inferSelect;
export type InsertPolicyBrief = z.infer<typeof insertPolicyBriefSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;

export const researchMetrics = pgTable("research_metrics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  value: integer("value").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  description: text("description"),
});

export const insertResearchMetricSchema = createInsertSchema(researchMetrics).pick({
  name: true,
  category: true,
  value: true,
  date: true,
  description: true,
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

// Event Registrations table
export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  notes: text("notes"),
  status: text("status").default("registered").notNull(),
});

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).pick({
  eventId: true,
  name: true,
  email: true,
  phone: true,
  notes: true,
  status: true,
});

export type ResearchMetric = typeof researchMetrics.$inferSelect;
export type InsertResearchMetric = z.infer<typeof insertResearchMetricSchema>;

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
