import { pgTable, text, serial, integer, boolean, date, timestamp, numeric, jsonb, uuid } from "drizzle-orm/pg-core";
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
  type: text("type").default("brief").notNull(), // 'brief', 'paper', or 'opinion'
  author: text("author"), // For opinion pieces, we can specify the author
});

export const insertPolicyBriefSchema = createInsertSchema(policyBriefs).pick({
  title: true,
  date: true,
  excerpt: true,
  content: true,
  type: true,
  author: true,
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
  transactionId: text("transaction_id"),
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
  transactionId: true,
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

// Annotations table - for collaborative annotations on policy briefs and other documents
export const annotations = pgTable("annotations", {
  id: serial("id").primaryKey(),
  documentType: text("document_type").notNull(), // e.g., "policy_brief", "research_paper"
  documentId: integer("document_id").notNull(),
  userId: integer("user_id").references(() => users.id),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  text: text("text").notNull(),
  position: jsonb("position").notNull(), // Stores selection position data: {startOffset, endOffset, startContainer, endContainer}
  highlight: text("highlight").notNull(), // The highlighted text
  color: text("color").default("#ffeb3b"), // Highlight color
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isPublic: boolean("is_public").default(false), // Whether the annotation is visible to all users
  isEdited: boolean("is_edited").default(false),
  replyToId: integer("reply_to_id"), // For threaded discussions
});

export const insertAnnotationSchema = createInsertSchema(annotations).pick({
  documentType: true,
  documentId: true,
  userId: true,
  userName: true,
  userEmail: true,
  text: true,
  position: true,
  highlight: true,
  color: true,
  isPublic: true,
  replyToId: true,
});

// Notes table - for personal or shared notes about a document
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").references(() => users.id),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  documentType: text("document_type").notNull(), // e.g., "policy_brief", "research_paper"
  documentId: integer("document_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isPublic: boolean("is_public").default(false), // Whether the note is shared with others
  tags: text("tags").array().default([]),
});

export const insertNoteSchema = createInsertSchema(notes).pick({
  title: true,
  content: true,
  userId: true,
  userName: true,
  userEmail: true,
  documentType: true,
  documentId: true,
  isPublic: true,
  tags: true,
});

// Annotation sharing table - for managing access to private annotations
export const annotationSharing = pgTable("annotation_sharing", {
  id: serial("id").primaryKey(),
  annotationId: integer("annotation_id").notNull().references(() => annotations.id),
  sharedWithEmail: text("shared_with_email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  invitationAccepted: boolean("invitation_accepted").default(false),
  shareToken: uuid("share_token").defaultRandom().notNull(),
});

export const insertAnnotationSharingSchema = createInsertSchema(annotationSharing).pick({
  annotationId: true,
  sharedWithEmail: true,
  shareToken: true,
});

// Note sharing table - for managing access to private notes
export const noteSharing = pgTable("note_sharing", {
  id: serial("id").primaryKey(),
  noteId: integer("note_id").notNull().references(() => notes.id),
  sharedWithEmail: text("shared_with_email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  invitationAccepted: boolean("invitation_accepted").default(false),
  shareToken: uuid("share_token").defaultRandom().notNull(),
});

export const insertNoteSharingSchema = createInsertSchema(noteSharing).pick({
  noteId: true,
  sharedWithEmail: true,
  shareToken: true,
});

// We'll add relations using drizzle query builders instead

// Export types for annotations and notes
export type Annotation = typeof annotations.$inferSelect;
export type InsertAnnotation = z.infer<typeof insertAnnotationSchema>;

export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;

export type AnnotationSharing = typeof annotationSharing.$inferSelect;
export type InsertAnnotationSharing = z.infer<typeof insertAnnotationSharingSchema>;

export type NoteSharing = typeof noteSharing.$inferSelect;
export type InsertNoteSharing = z.infer<typeof insertNoteSharingSchema>;

// Gallery Images table - for program and event images
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  programId: integer("program_id").references(() => programs.id),
  eventId: integer("event_id").references(() => events.id),
  category: text("category").notNull(), // e.g., "program", "event", "campus_tour"
  uploadedBy: text("uploaded_by").notNull(),
  uploadedByEmail: text("uploaded_by_email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isPublic: boolean("is_public").default(true),
  tags: text("tags").array().default([]),
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).pick({
  title: true,
  description: true,
  imageUrl: true,
  programId: true,
  eventId: true,
  category: true,
  uploadedBy: true,
  uploadedByEmail: true,
  isPublic: true,
  tags: true,
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;

// Staff Members table - for organization's team profiles
export const staffMembers = pgTable("staff_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(), // Job title
  email: text("email"),
  phone: text("phone"),
  bio: text("bio").notNull(),
  education: text("education").array(), // Array of education entries
  expertise: text("expertise").array(), // Array of expertise areas
  photoUrl: text("photo_url"),
  socialLinks: jsonb("social_links"), // JSON structure for LinkedIn, Twitter, etc.
  publications: text("publications").array(),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0), // For custom ordering on the team page
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStaffMemberSchema = createInsertSchema(staffMembers).pick({
  name: true,
  position: true,
  email: true,
  phone: true,
  bio: true,
  education: true,
  expertise: true,
  photoUrl: true,
  socialLinks: true,
  publications: true,
  isFeatured: true,
  sortOrder: true,
});

export type StaffMember = typeof staffMembers.$inferSelect;
export type InsertStaffMember = z.infer<typeof insertStaffMemberSchema>;

// Newsletters table
export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  htmlContent: text("html_content").notNull(),
  authorId: integer("author_id").references(() => users.id),
  authorName: text("author_name").notNull(),
  status: text("status").default("draft").notNull(), // draft, sent, scheduled
  sentAt: timestamp("sent_at"),
  scheduledFor: timestamp("scheduled_for"),
  recipientCount: integer("recipient_count").default(0),
  openCount: integer("open_count").default(0),
  clickCount: integer("click_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertNewsletterSchema = createInsertSchema(newsletters).pick({
  title: true,
  subject: true,
  content: true,
  htmlContent: true,
  authorId: true,
  authorName: true,
  status: true,
  scheduledFor: true,
});

export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
