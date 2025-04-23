import { 
  users, type User, type InsertUser,
  policyBriefs, type PolicyBrief, type InsertPolicyBrief,
  events, type Event, type InsertEvent,
  programs, type Program, type InsertProgram,
  subscribers, type Subscriber, type InsertSubscriber
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Policy Brief methods
  getPolicyBriefs(): Promise<PolicyBrief[]>;
  getPolicyBrief(id: number): Promise<PolicyBrief | undefined>;
  createPolicyBrief(brief: InsertPolicyBrief): Promise<PolicyBrief>;
  
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
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  unsubscribe(email: string): Promise<boolean>;
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
}

export const storage = new DatabaseStorage();
