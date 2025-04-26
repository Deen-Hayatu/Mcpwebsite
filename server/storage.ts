import { 
  users, type User, type InsertUser,
  policyBriefs, type PolicyBrief, type InsertPolicyBrief,
  events, type Event, type InsertEvent,
  programs, type Program, type InsertProgram,
  subscribers, type Subscriber, type InsertSubscriber,
  contactMessages, type ContactMessage, type InsertContactMessage,
  researchMetrics, type ResearchMetric, type InsertResearchMetric,
  eventRegistrations, type EventRegistration, type InsertEventRegistration,
  membershipApplications, type MembershipApplication, type InsertMembershipApplication,
  donations, type Donation, type InsertDonation,
  volunteerApplications, type VolunteerApplication, type InsertVolunteerApplication,
  discussionForumRegistrations, type DiscussionForumRegistration, type InsertDiscussionForumRegistration,
  fellowshipApplications, type FellowshipApplication, type InsertFellowshipApplication,
  studentChapterApplications, type StudentChapterApplication, type InsertStudentChapterApplication,
  careerApplications, type CareerApplication, type InsertCareerApplication,
  annotations, type Annotation, type InsertAnnotation,
  notes, type Note, type InsertNote,
  annotationSharing, type AnnotationSharing, type InsertAnnotationSharing,
  noteSharing, type NoteSharing, type InsertNoteSharing,
  galleryImages, type GalleryImage, type InsertGalleryImage,
  staffMembers, type StaffMember, type InsertStaffMember,
  newsletters, type Newsletter, type InsertNewsletter
} from "@shared/schema";
import { db } from "./db";
import { eq, and, isNull } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Policy Brief methods
  getPolicyBriefs(): Promise<PolicyBrief[]>;
  getPolicyBrief(id: number): Promise<PolicyBrief | undefined>;
  createPolicyBrief(brief: InsertPolicyBrief): Promise<PolicyBrief>;
  updatePolicyBrief(id: number, brief: Partial<InsertPolicyBrief>): Promise<PolicyBrief | undefined>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Program methods
  getPrograms(): Promise<Program[]>;
  getProgram(id: number): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  
  // Subscriber methods
  getSubscribers(): Promise<Subscriber[]>;
  getActiveSubscribers(): Promise<Subscriber[]>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  unsubscribe(email: string): Promise<boolean>;
  
  // Newsletter methods
  getNewsletters(): Promise<Newsletter[]>;
  getNewsletter(id: number): Promise<Newsletter | undefined>;
  createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  updateNewsletter(id: number, updates: Partial<Newsletter>): Promise<Newsletter | undefined>;
  
  // Contact Message methods
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<boolean>;
  
  // Research Metrics methods
  getResearchMetrics(): Promise<ResearchMetric[]>;
  getResearchMetricsByCategory(category: string): Promise<ResearchMetric[]>;
  createResearchMetric(metric: InsertResearchMetric): Promise<ResearchMetric>;
  
  // Event Registration methods
  getEventRegistrations(): Promise<EventRegistration[]>;
  getEventRegistrationsByEvent(eventId: number): Promise<EventRegistration[]>;
  getEventRegistration(id: number): Promise<EventRegistration | undefined>;
  registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration>;
  updateRegistrationStatus(id: number, status: string): Promise<boolean>;

  // Membership Application methods
  getMembershipApplications(): Promise<MembershipApplication[]>;
  getMembershipApplication(id: number): Promise<MembershipApplication | undefined>;
  createMembershipApplication(application: InsertMembershipApplication): Promise<MembershipApplication>;
  updateMembershipApplicationStatus(id: number, status: string): Promise<boolean>;

  // Donation methods
  getDonations(): Promise<Donation[]>;
  getDonation(id: number): Promise<Donation | undefined>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonationStatus(id: number, status: string): Promise<boolean>;

  // Volunteer Application methods
  getVolunteerApplications(): Promise<VolunteerApplication[]>;
  getVolunteerApplication(id: number): Promise<VolunteerApplication | undefined>;
  createVolunteerApplication(application: InsertVolunteerApplication): Promise<VolunteerApplication>;
  updateVolunteerApplicationStatus(id: number, status: string): Promise<boolean>;

  // Discussion Forum Registration methods
  getDiscussionForumRegistrations(): Promise<DiscussionForumRegistration[]>;
  getDiscussionForumRegistration(id: number): Promise<DiscussionForumRegistration | undefined>;
  createDiscussionForumRegistration(registration: InsertDiscussionForumRegistration): Promise<DiscussionForumRegistration>;
  updateDiscussionForumRegistrationStatus(id: number, status: string): Promise<boolean>;

  // Fellowship Application methods
  getFellowshipApplications(): Promise<FellowshipApplication[]>;
  getFellowshipApplication(id: number): Promise<FellowshipApplication | undefined>;
  createFellowshipApplication(application: InsertFellowshipApplication): Promise<FellowshipApplication>;
  updateFellowshipApplicationStatus(id: number, status: string): Promise<boolean>;

  // Student Chapter Application methods
  getStudentChapterApplications(): Promise<StudentChapterApplication[]>;
  getStudentChapterApplication(id: number): Promise<StudentChapterApplication | undefined>;
  createStudentChapterApplication(application: InsertStudentChapterApplication): Promise<StudentChapterApplication>;
  updateStudentChapterApplicationStatus(id: number, status: string): Promise<boolean>;

  // Career Application methods
  getCareerApplications(): Promise<CareerApplication[]>;
  getCareerApplication(id: number): Promise<CareerApplication | undefined>;
  createCareerApplication(application: InsertCareerApplication): Promise<CareerApplication>;
  updateCareerApplicationStatus(id: number, status: string): Promise<boolean>;
  
  // Annotation methods
  getAnnotations(documentType: string, documentId: number): Promise<Annotation[]>;
  getAnnotation(id: number): Promise<Annotation | undefined>;
  createAnnotation(annotation: InsertAnnotation): Promise<Annotation>;
  updateAnnotation(id: number, text: string): Promise<Annotation | undefined>;
  deleteAnnotation(id: number): Promise<boolean>;
  getAnnotationReplies(annotationId: number): Promise<Annotation[]>;
  toggleAnnotationVisibility(id: number): Promise<Annotation | undefined>;
  
  // Note methods
  getNotes(documentType: string, documentId: number): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  getUserNotes(userEmail: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, title: string, content: string, tags?: string[]): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  toggleNoteVisibility(id: number): Promise<Note | undefined>;
  
  // Annotation sharing methods
  shareAnnotation(sharing: InsertAnnotationSharing): Promise<AnnotationSharing>;
  getAnnotationSharings(annotationId: number): Promise<AnnotationSharing[]>;
  acceptAnnotationSharing(token: string): Promise<boolean>;
  deleteAnnotationSharing(id: number): Promise<boolean>;
  
  // Note sharing methods
  shareNote(sharing: InsertNoteSharing): Promise<NoteSharing>;
  getNoteSharings(noteId: number): Promise<NoteSharing[]>;
  acceptNoteSharing(token: string): Promise<boolean>;
  deleteNoteSharing(id: number): Promise<boolean>;
  
  // Gallery Image methods
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImagesByCategory(category: string): Promise<GalleryImage[]>;
  getGalleryImagesByProgram(programId: number): Promise<GalleryImage[]>;
  getGalleryImagesByEvent(eventId: number): Promise<GalleryImage[]>;
  getGalleryImage(id: number): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, updates: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: number): Promise<boolean>;
  
  // Staff Member methods
  getStaffMembers(): Promise<StaffMember[]>;
  getFeaturedStaffMembers(): Promise<StaffMember[]>;
  getStaffMember(id: number): Promise<StaffMember | undefined>;
  createStaffMember(member: InsertStaffMember): Promise<StaffMember>;
  updateStaffMember(id: number, updates: Partial<InsertStaffMember>): Promise<StaffMember | undefined>;
  deleteStaffMember(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Policy Brief methods
  async getPolicyBriefs(): Promise<PolicyBrief[]> {
    return await db.select().from(policyBriefs);
  }
  
  async getPolicyBrief(id: number): Promise<PolicyBrief | undefined> {
    const [brief] = await db.select().from(policyBriefs).where(eq(policyBriefs.id, id));
    return brief || undefined;
  }
  
  async createPolicyBrief(brief: InsertPolicyBrief): Promise<PolicyBrief> {
    const [newBrief] = await db
      .insert(policyBriefs)
      .values(brief)
      .returning();
    return newBrief;
  }
  
  async updatePolicyBrief(id: number, brief: Partial<InsertPolicyBrief>): Promise<PolicyBrief | undefined> {
    try {
      const [updatedBrief] = await db
        .update(policyBriefs)
        .set(brief)
        .where(eq(policyBriefs.id, id))
        .returning();
      return updatedBrief || undefined;
    } catch (error) {
      console.error("Error updating policy brief:", error);
      return undefined;
    }
  }
  
  // Event methods
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db
      .insert(events)
      .values(event)
      .returning();
    return newEvent;
  }
  
  // Program methods
  async getPrograms(): Promise<Program[]> {
    return await db.select().from(programs);
  }
  
  async getProgram(id: number): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program || undefined;
  }
  
  async createProgram(program: InsertProgram): Promise<Program> {
    const [newProgram] = await db
      .insert(programs)
      .values(program)
      .returning();
    return newProgram;
  }
  
  // Subscriber methods
  async getSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers).where(eq(subscribers.subscribed, true));
  }
  
  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber || undefined;
  }
  
  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    try {
      // Check if the email already exists
      const existingSubscriber = await this.getSubscriberByEmail(subscriber.email);
      
      // If the email exists and is unsubscribed, update it to subscribed
      if (existingSubscriber && !existingSubscriber.subscribed) {
        const [updated] = await db
          .update(subscribers)
          .set({ subscribed: true, name: subscriber.name })
          .where(eq(subscribers.email, subscriber.email))
          .returning();
        return updated;
      }
      
      // If the email doesn't exist, create a new subscriber
      if (!existingSubscriber) {
        const [newSubscriber] = await db
          .insert(subscribers)
          .values(subscriber)
          .returning();
        return newSubscriber;
      }
      
      // If the email exists and is already subscribed, return the existing entry
      return existingSubscriber;
    } catch (error) {
      console.error("Error creating subscriber:", error);
      throw error;
    }
  }
  
  async unsubscribe(email: string): Promise<boolean> {
    try {
      const result = await db
        .update(subscribers)
        .set({ subscribed: false })
        .where(eq(subscribers.email, email))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error("Error unsubscribing:", error);
      return false;
    }
  }
  
  async getActiveSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers).where(eq(subscribers.subscribed, true));
  }
  
  // Newsletter methods
  async getNewsletters(): Promise<Newsletter[]> {
    return await db.select().from(newsletters).orderBy(newsletters.createdAt);
  }
  
  async getNewsletter(id: number): Promise<Newsletter | undefined> {
    const [newsletter] = await db.select().from(newsletters).where(eq(newsletters.id, id));
    return newsletter || undefined;
  }
  
  async createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const [newNewsletter] = await db
      .insert(newsletters)
      .values(newsletter)
      .returning();
    return newNewsletter;
  }
  
  async updateNewsletter(id: number, updates: Partial<Newsletter>): Promise<Newsletter | undefined> {
    try {
      const [updatedNewsletter] = await db
        .update(newsletters)
        .set(updates)
        .where(eq(newsletters.id, id))
        .returning();
      return updatedNewsletter || undefined;
    } catch (error) {
      console.error("Error updating newsletter:", error);
      return undefined;
    }
  }
  
  // Contact Message methods
  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      return await db.select()
        .from(contactMessages)
        .orderBy(contactMessages.createdAt);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return [];
    }
  }
  
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    try {
      const [message] = await db.select()
        .from(contactMessages)
        .where(eq(contactMessages.id, id));
      return message || undefined;
    } catch (error) {
      console.error("Error fetching contact message:", error);
      return undefined;
    }
  }
  
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    try {
      const [newMessage] = await db
        .insert(contactMessages)
        .values(message)
        .returning();
      return newMessage;
    } catch (error) {
      console.error("Error creating contact message:", error);
      throw error;
    }
  }
  
  async markContactMessageAsRead(id: number): Promise<boolean> {
    try {
      const result = await db
        .update(contactMessages)
        .set({ isRead: true })
        .where(eq(contactMessages.id, id))
        .returning();
        
      return result.length > 0;
    } catch (error) {
      console.error("Error marking contact message as read:", error);
      return false;
    }
  }
  
  // Research Metrics methods
  async getResearchMetrics(): Promise<ResearchMetric[]> {
    try {
      return await db.select().from(researchMetrics);
    } catch (error) {
      console.error("Error fetching research metrics:", error);
      return [];
    }
  }
  
  async getResearchMetricsByCategory(category: string): Promise<ResearchMetric[]> {
    try {
      return await db.select()
        .from(researchMetrics)
        .where(eq(researchMetrics.category, category));
    } catch (error) {
      console.error(`Error fetching research metrics for category ${category}:`, error);
      return [];
    }
  }
  
  async createResearchMetric(metric: InsertResearchMetric): Promise<ResearchMetric> {
    try {
      const [newMetric] = await db
        .insert(researchMetrics)
        .values(metric)
        .returning();
      return newMetric;
    } catch (error) {
      console.error("Error creating research metric:", error);
      throw error;
    }
  }
  
  // Event Registration methods
  async getEventRegistrations(): Promise<EventRegistration[]> {
    try {
      return await db.select()
        .from(eventRegistrations)
        .orderBy(eventRegistrations.createdAt);
    } catch (error) {
      console.error("Error fetching event registrations:", error);
      return [];
    }
  }
  
  async getEventRegistrationsByEvent(eventId: number): Promise<EventRegistration[]> {
    try {
      return await db.select()
        .from(eventRegistrations)
        .where(eq(eventRegistrations.eventId, eventId))
        .orderBy(eventRegistrations.createdAt);
    } catch (error) {
      console.error(`Error fetching registrations for event ${eventId}:`, error);
      return [];
    }
  }
  
  async getEventRegistration(id: number): Promise<EventRegistration | undefined> {
    try {
      const [registration] = await db.select()
        .from(eventRegistrations)
        .where(eq(eventRegistrations.id, id));
      return registration || undefined;
    } catch (error) {
      console.error("Error fetching event registration:", error);
      return undefined;
    }
  }
  
  async registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration> {
    try {
      // Verify that the event exists
      const event = await this.getEvent(registration.eventId);
      if (!event) {
        throw new Error(`Event with ID ${registration.eventId} does not exist`);
      }
      
      // Create the registration
      const [newRegistration] = await db
        .insert(eventRegistrations)
        .values(registration)
        .returning();
      return newRegistration;
    } catch (error) {
      console.error("Error registering for event:", error);
      throw error;
    }
  }
  
  async updateRegistrationStatus(id: number, status: string): Promise<boolean> {
    try {
      const result = await db
        .update(eventRegistrations)
        .set({ status })
        .where(eq(eventRegistrations.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error("Error updating registration status:", error);
      return false;
    }
  }

  // Membership Application methods
  async getMembershipApplications(): Promise<MembershipApplication[]> {
    try {
      return await db.select()
        .from(membershipApplications)
        .orderBy(membershipApplications.createdAt);
    } catch (error) {
      console.error("Error fetching membership applications:", error);
      return [];
    }
  }
  
  async getMembershipApplication(id: number): Promise<MembershipApplication | undefined> {
    try {
      const [application] = await db.select()
        .from(membershipApplications)
        .where(eq(membershipApplications.id, id));
      return application || undefined;
    } catch (error) {
      console.error("Error fetching membership application:", error);
      return undefined;
    }
  }
  
  async createMembershipApplication(application: InsertMembershipApplication): Promise<MembershipApplication> {
    try {
      const [newApplication] = await db
        .insert(membershipApplications)
        .values(application)
        .returning();
      return newApplication;
    } catch (error) {
      console.error("Error creating membership application:", error);
      throw error;
    }
  }
  
  async updateMembershipApplicationStatus(id: number, status: string): Promise<boolean> {
    try {
      const result = await db
        .update(membershipApplications)
        .set({ status })
        .where(eq(membershipApplications.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error("Error updating membership application status:", error);
      return false;
    }
  }

  // Donation methods
  async getDonations(): Promise<Donation[]> {
    try {
      return await db.select()
        .from(donations)
        .orderBy(donations.createdAt);
    } catch (error) {
      console.error("Error fetching donations:", error);
      return [];
    }
  }
  
  async getDonation(id: number): Promise<Donation | undefined> {
    try {
      const [donation] = await db.select()
        .from(donations)
        .where(eq(donations.id, id));
      return donation || undefined;
    } catch (error) {
      console.error("Error fetching donation:", error);
      return undefined;
    }
  }
  
  async createDonation(donation: InsertDonation): Promise<Donation> {
    try {
      const [newDonation] = await db
        .insert(donations)
        .values(donation)
        .returning();
      return newDonation;
    } catch (error) {
      console.error("Error creating donation:", error);
      throw error;
    }
  }
  
  async updateDonationStatus(id: number, status: string): Promise<boolean> {
    try {
      const result = await db
        .update(donations)
        .set({ status })
        .where(eq(donations.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error("Error updating donation status:", error);
      return false;
    }
  }

  // Volunteer Application methods
  async getVolunteerApplications(): Promise<VolunteerApplication[]> {
    try {
      return await db.select()
        .from(volunteerApplications)
        .orderBy(volunteerApplications.createdAt);
    } catch (error) {
      console.error("Error fetching volunteer applications:", error);
      return [];
    }
  }
  
  async getVolunteerApplication(id: number): Promise<VolunteerApplication | undefined> {
    try {
      const [application] = await db.select()
        .from(volunteerApplications)
        .where(eq(volunteerApplications.id, id));
      return application || undefined;
    } catch (error) {
      console.error("Error fetching volunteer application:", error);
      return undefined;
    }
  }
  
  async createVolunteerApplication(application: InsertVolunteerApplication): Promise<VolunteerApplication> {
    try {
      const [newApplication] = await db
        .insert(volunteerApplications)
        .values(application)
        .returning();
      return newApplication;
    } catch (error) {
      console.error("Error creating volunteer application:", error);
      throw error;
    }
  }
  
  async updateVolunteerApplicationStatus(id: number, status: string): Promise<boolean> {
    try {
      const result = await db
        .update(volunteerApplications)
        .set({ status })
        .where(eq(volunteerApplications.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error("Error updating volunteer application status:", error);
      return false;
    }
  }

  // Discussion Forum Registration methods
  async getDiscussionForumRegistrations(): Promise<DiscussionForumRegistration[]> {
    try {
      return await db.select()
        .from(discussionForumRegistrations)
        .orderBy(discussionForumRegistrations.createdAt);
    } catch (error) {
      console.error("Error fetching discussion forum registrations:", error);
      return [];
    }
  }
  
  async getDiscussionForumRegistration(id: number): Promise<DiscussionForumRegistration | undefined> {
    try {
      const [registration] = await db.select()
        .from(discussionForumRegistrations)
        .where(eq(discussionForumRegistrations.id, id));
      return registration || undefined;
    } catch (error) {
      console.error("Error fetching discussion forum registration:", error);
      return undefined;
    }
  }
  
  async createDiscussionForumRegistration(registration: InsertDiscussionForumRegistration): Promise<DiscussionForumRegistration> {
    try {
      const [newRegistration] = await db
        .insert(discussionForumRegistrations)
        .values(registration)
        .returning();
      return newRegistration;
    } catch (error) {
      console.error("Error creating discussion forum registration:", error);
      throw error;
    }
  }
  
  async updateDiscussionForumRegistrationStatus(id: number, status: string): Promise<boolean> {
    try {
      const result = await db
        .update(discussionForumRegistrations)
        .set({ status })
        .where(eq(discussionForumRegistrations.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error("Error updating discussion forum registration status:", error);
      return false;
    }
  }

  // Fellowship Application methods
  async getFellowshipApplications(): Promise<FellowshipApplication[]> {
    try {
      return await db.select()
        .from(fellowshipApplications)
        .orderBy(fellowshipApplications.createdAt);
    } catch (error) {
      console.error("Error fetching fellowship applications:", error);
      return [];
    }
  }
  
  async getFellowshipApplication(id: number): Promise<FellowshipApplication | undefined> {
    try {
      const [application] = await db.select()
        .from(fellowshipApplications)
        .where(eq(fellowshipApplications.id, id));
      return application || undefined;
    } catch (error) {
      console.error("Error fetching fellowship application:", error);
      return undefined;
    }
  }
  
  async createFellowshipApplication(application: InsertFellowshipApplication): Promise<FellowshipApplication> {
    try {
      const [newApplication] = await db
        .insert(fellowshipApplications)
        .values(application)
        .returning();
      return newApplication;
    } catch (error) {
      console.error("Error creating fellowship application:", error);
      throw error;
    }
  }
  
  async updateFellowshipApplicationStatus(id: number, status: string): Promise<boolean> {
    try {
      const result = await db
        .update(fellowshipApplications)
        .set({ status })
        .where(eq(fellowshipApplications.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error("Error updating fellowship application status:", error);
      return false;
    }
  }

  // Student Chapter Application methods
  async getStudentChapterApplications(): Promise<StudentChapterApplication[]> {
    try {
      return await db.select()
        .from(studentChapterApplications)
        .orderBy(studentChapterApplications.createdAt);
    } catch (error) {
      console.error("Error fetching student chapter applications:", error);
      return [];
    }
  }
  
  async getStudentChapterApplication(id: number): Promise<StudentChapterApplication | undefined> {
    try {
      const [application] = await db.select()
        .from(studentChapterApplications)
        .where(eq(studentChapterApplications.id, id));
      return application || undefined;
    } catch (error) {
      console.error("Error fetching student chapter application:", error);
      return undefined;
    }
  }
  
  async createStudentChapterApplication(application: InsertStudentChapterApplication): Promise<StudentChapterApplication> {
    try {
      const [newApplication] = await db
        .insert(studentChapterApplications)
        .values(application)
        .returning();
      return newApplication;
    } catch (error) {
      console.error("Error creating student chapter application:", error);
      throw error;
    }
  }
  
  async updateStudentChapterApplicationStatus(id: number, status: string): Promise<boolean> {
    try {
      const result = await db
        .update(studentChapterApplications)
        .set({ status })
        .where(eq(studentChapterApplications.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error("Error updating student chapter application status:", error);
      return false;
    }
  }

  // Career Application methods
  async getCareerApplications(): Promise<CareerApplication[]> {
    try {
      return await db.select()
        .from(careerApplications)
        .orderBy(careerApplications.createdAt);
    } catch (error) {
      console.error("Error fetching career applications:", error);
      return [];
    }
  }
  
  async getCareerApplication(id: number): Promise<CareerApplication | undefined> {
    try {
      const [application] = await db.select()
        .from(careerApplications)
        .where(eq(careerApplications.id, id));
      return application || undefined;
    } catch (error) {
      console.error("Error fetching career application:", error);
      return undefined;
    }
  }
  
  async createCareerApplication(application: InsertCareerApplication): Promise<CareerApplication> {
    try {
      const [newApplication] = await db
        .insert(careerApplications)
        .values(application)
        .returning();
      return newApplication;
    } catch (error) {
      console.error("Error creating career application:", error);
      throw error;
    }
  }
  
  async updateCareerApplicationStatus(id: number, status: string): Promise<boolean> {
    try {
      const result = await db
        .update(careerApplications)
        .set({ status })
        .where(eq(careerApplications.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error("Error updating career application status:", error);
      return false;
    }
  }
  
  // Annotation methods
  async getAnnotations(documentType: string, documentId: number): Promise<Annotation[]> {
    try {
      return await db.select()
        .from(annotations)
        .where(eq(annotations.documentType, documentType))
        .where(eq(annotations.documentId, documentId))
        .where(isNull(annotations.replyToId)) // Get only top-level annotations, not replies
        .orderBy(annotations.createdAt);
    } catch (error) {
      console.error(`Error fetching annotations for ${documentType} ${documentId}:`, error);
      return [];
    }
  }
  
  async getAnnotation(id: number): Promise<Annotation | undefined> {
    try {
      const [annotation] = await db.select()
        .from(annotations)
        .where(eq(annotations.id, id));
      return annotation || undefined;
    } catch (error) {
      console.error(`Error fetching annotation ${id}:`, error);
      return undefined;
    }
  }
  
  async createAnnotation(annotation: InsertAnnotation): Promise<Annotation> {
    try {
      const [newAnnotation] = await db
        .insert(annotations)
        .values({
          ...annotation,
          updatedAt: new Date()
        })
        .returning();
      return newAnnotation;
    } catch (error) {
      console.error("Error creating annotation:", error);
      throw error;
    }
  }
  
  async updateAnnotation(id: number, text: string): Promise<Annotation | undefined> {
    try {
      const [updatedAnnotation] = await db
        .update(annotations)
        .set({ 
          text, 
          updatedAt: new Date(),
          isEdited: true 
        })
        .where(eq(annotations.id, id))
        .returning();
      return updatedAnnotation;
    } catch (error) {
      console.error(`Error updating annotation ${id}:`, error);
      return undefined;
    }
  }
  
  async deleteAnnotation(id: number): Promise<boolean> {
    try {
      // First delete all replies to this annotation
      await db
        .delete(annotations)
        .where(eq(annotations.replyToId, id));
        
      // Then delete the annotation itself
      const result = await db
        .delete(annotations)
        .where(eq(annotations.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting annotation ${id}:`, error);
      return false;
    }
  }
  
  async getAnnotationReplies(annotationId: number): Promise<Annotation[]> {
    try {
      return await db.select()
        .from(annotations)
        .where(eq(annotations.replyToId, annotationId))
        .orderBy(annotations.createdAt);
    } catch (error) {
      console.error(`Error fetching replies for annotation ${annotationId}:`, error);
      return [];
    }
  }
  
  async toggleAnnotationVisibility(id: number): Promise<Annotation | undefined> {
    try {
      // Get the current annotation to flip its visibility
      const annotation = await this.getAnnotation(id);
      if (!annotation) return undefined;
      
      const [updatedAnnotation] = await db
        .update(annotations)
        .set({ 
          isPublic: !annotation.isPublic,
          updatedAt: new Date() 
        })
        .where(eq(annotations.id, id))
        .returning();
        
      return updatedAnnotation;
    } catch (error) {
      console.error(`Error toggling visibility for annotation ${id}:`, error);
      return undefined;
    }
  }
  
  // Note methods
  async getNotes(documentType: string, documentId: number): Promise<Note[]> {
    try {
      return await db.select()
        .from(notes)
        .where(eq(notes.documentType, documentType))
        .where(eq(notes.documentId, documentId))
        .orderBy(notes.createdAt);
    } catch (error) {
      console.error(`Error fetching notes for ${documentType} ${documentId}:`, error);
      return [];
    }
  }
  
  async getNote(id: number): Promise<Note | undefined> {
    try {
      const [note] = await db.select()
        .from(notes)
        .where(eq(notes.id, id));
      return note || undefined;
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error);
      return undefined;
    }
  }
  
  async getUserNotes(userEmail: string): Promise<Note[]> {
    try {
      return await db.select()
        .from(notes)
        .where(eq(notes.userEmail, userEmail))
        .orderBy(notes.updatedAt);
    } catch (error) {
      console.error(`Error fetching notes for user ${userEmail}:`, error);
      return [];
    }
  }
  
  async createNote(note: InsertNote): Promise<Note> {
    try {
      const [newNote] = await db
        .insert(notes)
        .values({
          ...note,
          updatedAt: new Date()
        })
        .returning();
      return newNote;
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  }
  
  async updateNote(id: number, title: string, content: string, tags?: string[]): Promise<Note | undefined> {
    try {
      const updateData: any = { 
        title, 
        content,
        updatedAt: new Date()
      };
      
      // Only update tags if provided
      if (tags) {
        updateData.tags = tags;
      }
      
      const [updatedNote] = await db
        .update(notes)
        .set(updateData)
        .where(eq(notes.id, id))
        .returning();
        
      return updatedNote;
    } catch (error) {
      console.error(`Error updating note ${id}:`, error);
      return undefined;
    }
  }
  
  async deleteNote(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(notes)
        .where(eq(notes.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error);
      return false;
    }
  }
  
  async toggleNoteVisibility(id: number): Promise<Note | undefined> {
    try {
      // Get the current note to flip its visibility
      const note = await this.getNote(id);
      if (!note) return undefined;
      
      const [updatedNote] = await db
        .update(notes)
        .set({ 
          isPublic: !note.isPublic,
          updatedAt: new Date() 
        })
        .where(eq(notes.id, id))
        .returning();
        
      return updatedNote;
    } catch (error) {
      console.error(`Error toggling visibility for note ${id}:`, error);
      return undefined;
    }
  }
  
  // Annotation sharing methods
  async shareAnnotation(sharing: InsertAnnotationSharing): Promise<AnnotationSharing> {
    try {
      const [newSharing] = await db
        .insert(annotationSharing)
        .values(sharing)
        .returning();
      return newSharing;
    } catch (error) {
      console.error("Error sharing annotation:", error);
      throw error;
    }
  }
  
  async getAnnotationSharings(annotationId: number): Promise<AnnotationSharing[]> {
    try {
      return await db.select()
        .from(annotationSharing)
        .where(eq(annotationSharing.annotationId, annotationId));
    } catch (error) {
      console.error(`Error getting sharings for annotation ${annotationId}:`, error);
      return [];
    }
  }
  
  async acceptAnnotationSharing(token: string): Promise<boolean> {
    try {
      const result = await db
        .update(annotationSharing)
        .set({ invitationAccepted: true })
        .where(eq(annotationSharing.shareToken, token))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error(`Error accepting annotation sharing with token ${token}:`, error);
      return false;
    }
  }
  
  async deleteAnnotationSharing(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(annotationSharing)
        .where(eq(annotationSharing.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting annotation sharing ${id}:`, error);
      return false;
    }
  }
  
  // Note sharing methods
  async shareNote(sharing: InsertNoteSharing): Promise<NoteSharing> {
    try {
      const [newSharing] = await db
        .insert(noteSharing)
        .values(sharing)
        .returning();
      return newSharing;
    } catch (error) {
      console.error("Error sharing note:", error);
      throw error;
    }
  }
  
  async getNoteSharings(noteId: number): Promise<NoteSharing[]> {
    try {
      return await db.select()
        .from(noteSharing)
        .where(eq(noteSharing.noteId, noteId));
    } catch (error) {
      console.error(`Error getting sharings for note ${noteId}:`, error);
      return [];
    }
  }
  
  async acceptNoteSharing(token: string): Promise<boolean> {
    try {
      const result = await db
        .update(noteSharing)
        .set({ invitationAccepted: true })
        .where(eq(noteSharing.shareToken, token))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error(`Error accepting note sharing with token ${token}:`, error);
      return false;
    }
  }
  
  async deleteNoteSharing(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(noteSharing)
        .where(eq(noteSharing.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting note sharing ${id}:`, error);
      return false;
    }
  }

  // Gallery Images methods
  async getGalleryImages(): Promise<GalleryImage[]> {
    try {
      return await db.select().from(galleryImages).orderBy(galleryImages.createdAt);
    } catch (error) {
      console.error("Error getting gallery images:", error);
      return [];
    }
  }

  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    try {
      return await db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.category, category))
        .orderBy(galleryImages.createdAt);
    } catch (error) {
      console.error(`Error getting gallery images for category ${category}:`, error);
      return [];
    }
  }

  async getGalleryImagesByProgram(programId: number): Promise<GalleryImage[]> {
    try {
      return await db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.programId, programId))
        .orderBy(galleryImages.createdAt);
    } catch (error) {
      console.error(`Error getting gallery images for program ${programId}:`, error);
      return [];
    }
  }

  async getGalleryImagesByEvent(eventId: number): Promise<GalleryImage[]> {
    try {
      return await db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.eventId, eventId))
        .orderBy(galleryImages.createdAt);
    } catch (error) {
      console.error(`Error getting gallery images for event ${eventId}:`, error);
      return [];
    }
  }

  async getGalleryImage(id: number): Promise<GalleryImage | undefined> {
    try {
      const [image] = await db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.id, id));
      return image;
    } catch (error) {
      console.error(`Error getting gallery image ${id}:`, error);
      return undefined;
    }
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    try {
      const [newImage] = await db
        .insert(galleryImages)
        .values(image)
        .returning();
      return newImage;
    } catch (error) {
      console.error("Error creating gallery image:", error);
      throw error;
    }
  }

  async updateGalleryImage(id: number, updates: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    try {
      const [updatedImage] = await db
        .update(galleryImages)
        .set(updates)
        .where(eq(galleryImages.id, id))
        .returning();
      return updatedImage;
    } catch (error) {
      console.error(`Error updating gallery image ${id}:`, error);
      return undefined;
    }
  }

  async deleteGalleryImage(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(galleryImages)
        .where(eq(galleryImages.id, id))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting gallery image ${id}:`, error);
      return false;
    }
  }

  // Staff Member methods
  async getStaffMembers(): Promise<StaffMember[]> {
    try {
      return await db.select()
        .from(staffMembers)
        .orderBy(staffMembers.sortOrder);
    } catch (error) {
      console.error("Error fetching staff members:", error);
      return [];
    }
  }
  
  async getFeaturedStaffMembers(): Promise<StaffMember[]> {
    try {
      return await db.select()
        .from(staffMembers)
        .where(eq(staffMembers.isFeatured, true))
        .orderBy(staffMembers.sortOrder);
    } catch (error) {
      console.error("Error fetching featured staff members:", error);
      return [];
    }
  }
  
  async getStaffMember(id: number): Promise<StaffMember | undefined> {
    try {
      const [member] = await db.select()
        .from(staffMembers)
        .where(eq(staffMembers.id, id));
      return member || undefined;
    } catch (error) {
      console.error(`Error fetching staff member ${id}:`, error);
      return undefined;
    }
  }
  
  async createStaffMember(member: InsertStaffMember): Promise<StaffMember> {
    try {
      const [newMember] = await db
        .insert(staffMembers)
        .values(member)
        .returning();
      return newMember;
    } catch (error) {
      console.error("Error creating staff member:", error);
      throw error;
    }
  }
  
  async updateStaffMember(id: number, updates: Partial<InsertStaffMember>): Promise<StaffMember | undefined> {
    try {
      const [updatedMember] = await db
        .update(staffMembers)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(staffMembers.id, id))
        .returning();
      return updatedMember || undefined;
    } catch (error) {
      console.error(`Error updating staff member ${id}:`, error);
      return undefined;
    }
  }
  
  async deleteStaffMember(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(staffMembers)
        .where(eq(staffMembers.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting staff member ${id}:`, error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();