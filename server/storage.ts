import { 
  users, type User, type InsertUser,
  policyBriefs, type PolicyBrief, type InsertPolicyBrief,
  events, type Event, type InsertEvent,
  programs, type Program, type InsertProgram
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
}

export const storage = new DatabaseStorage();
