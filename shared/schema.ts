import { pgTable, text, serial, integer, boolean, date, timestamp, numeric } from "drizzle-orm/pg-core";
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

// Membership Applications table
export const membershipApplications = pgTable("membership_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  membershipType: text("membership_type").notNull(),
  address: text("address").notNull(),
  heardAbout: text("heard_about"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("pending").notNull(),
});

export const insertMembershipApplicationSchema = createInsertSchema(membershipApplications).pick({
  name: true,
  email: true,
  phone: true,
  membershipType: true,
  address: true,
  heardAbout: true,
  status: true,
});

export type MembershipApplication = typeof membershipApplications.$inferSelect;
export type InsertMembershipApplication = z.infer<typeof insertMembershipApplicationSchema>;

// Donations table
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  donationType: text("donation_type").notNull(),
  donationAmount: numeric("donation_amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  message: text("message"),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("pending").notNull(),
});

export const insertDonationSchema = createInsertSchema(donations).pick({
  name: true,
  email: true,
  donationType: true,
  donationAmount: true,
  paymentMethod: true,
  message: true,
  isAnonymous: true,
  status: true,
});

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

// Volunteer Applications table
export const volunteerApplications = pgTable("volunteer_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  skills: text("skills").notNull(),
  availability: text("availability").notNull(),
  areasOfInterest: text("areas_of_interest").array().notNull(),
  motivation: text("motivation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("pending").notNull(),
});

export const insertVolunteerApplicationSchema = createInsertSchema(volunteerApplications).pick({
  name: true,
  email: true,
  phone: true,
  skills: true,
  availability: true,
  areasOfInterest: true,
  motivation: true,
  status: true,
});

export type VolunteerApplication = typeof volunteerApplications.$inferSelect;
export type InsertVolunteerApplication = z.infer<typeof insertVolunteerApplicationSchema>;

// Discussion Forum Registrations table
export const discussionForumRegistrations = pgTable("discussion_forum_registrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  interests: text("interests").array().notNull(),
  policyIdeas: text("policy_ideas").notNull(),
  preferredPlatform: text("preferred_platform").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("registered").notNull(),
});

export const insertDiscussionForumRegistrationSchema = createInsertSchema(discussionForumRegistrations).pick({
  name: true,
  email: true,
  interests: true,
  policyIdeas: true,
  preferredPlatform: true,
  status: true,
});

export type DiscussionForumRegistration = typeof discussionForumRegistrations.$inferSelect;
export type InsertDiscussionForumRegistration = z.infer<typeof insertDiscussionForumRegistrationSchema>;

// Fellowship Applications table
export const fellowshipApplications = pgTable("fellowship_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  institution: text("institution").notNull(),
  researchInterests: text("research_interests").notNull(),
  cv: text("cv").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("pending").notNull(),
});

export const insertFellowshipApplicationSchema = createInsertSchema(fellowshipApplications).pick({
  name: true,
  email: true,
  phone: true,
  institution: true,
  researchInterests: true,
  cv: true,
  status: true,
});

export type FellowshipApplication = typeof fellowshipApplications.$inferSelect;
export type InsertFellowshipApplication = z.infer<typeof insertFellowshipApplicationSchema>;

// Student Chapter Applications table
export const studentChapterApplications = pgTable("student_chapter_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  university: text("university").notNull(),
  studentId: text("student_id").notNull(),
  program: text("program").notNull(),
  graduationYear: text("graduation_year").notNull(),
  statement: text("statement").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("pending").notNull(),
});

export const insertStudentChapterApplicationSchema = createInsertSchema(studentChapterApplications).pick({
  name: true,
  email: true,
  university: true,
  studentId: true,
  program: true,
  graduationYear: true,
  statement: true,
  status: true,
});

export type StudentChapterApplication = typeof studentChapterApplications.$inferSelect;
export type InsertStudentChapterApplication = z.infer<typeof insertStudentChapterApplicationSchema>;

// Career Applications table
export const careerApplications = pgTable("career_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  position: text("position").notNull(),
  education: text("education").notNull(),
  experience: text("experience").notNull(),
  resumeLink: text("resume_link").notNull(),
  coverLetter: text("cover_letter").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("pending").notNull(),
});

export const insertCareerApplicationSchema = createInsertSchema(careerApplications).pick({
  name: true,
  email: true,
  phone: true,
  position: true,
  education: true,
  experience: true,
  resumeLink: true,
  coverLetter: true,
  status: true,
});

export type CareerApplication = typeof careerApplications.$inferSelect;
export type InsertCareerApplication = z.infer<typeof insertCareerApplicationSchema>;
