// Import server routes for Vercel deployment
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { Express, Request, Response } from 'express';
import { 
  policyBriefs, 
  staffMembers, 
  researchMetrics, 
  events, 
  programs, 
  publications, 
  galleryImages,
  newsletters,
  subscribers,
  contactMessages
} from '../shared/schema';

// Initialize database connection for Vercel
let db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql);
  }
  return db;
}

// Storage implementation for Vercel
const storage = {
  async getPolicyBriefs() {
    const database = getDb();
    return await database.select().from(policyBriefs);
  },
  
  async getPolicyBrief(id: number) {
    const database = getDb();
    const results = await database.select().from(policyBriefs).where(eq(policyBriefs.id, id));
    return results[0] || null;
  },
  
  async getStaffMembers() {
    const database = getDb();
    return await database.select().from(staffMembers);
  },
  
  async getFeaturedStaffMembers() {
    const database = getDb();
    return await database.select().from(staffMembers).where(eq(staffMembers.isFeatured, true));
  },
  
  async getResearchMetrics() {
    const database = getDb();
    return await database.select().from(researchMetrics);
  },
  
  async getEvents() {
    const database = getDb();
    return await database.select().from(events);
  },
  
  async getPrograms() {
    const database = getDb();
    return await database.select().from(programs);
  },
  
  async getPublications() {
    const database = getDb();
    return await database.select().from(publications);
  },
  
  async getGalleryImages() {
    const database = getDb();
    return await database.select().from(galleryImages);
  },
  
  async getNewsletters() {
    const database = getDb();
    return await database.select().from(newsletters);
  },
  
  async createSubscriber(data: { email: string; name?: string }) {
    const database = getDb();
    const [subscriber] = await database.insert(subscribers).values(data).returning();
    return subscriber;
  },
  
  async createContactMessage(data: { name: string; email: string; subject: string; message: string }) {
    const database = getDb();
    const [message] = await database.insert(contactMessages).values(data).returning();
    return message;
  }
};

export async function registerRoutes(app: Express) {
  console.log('Initializing Vercel API routes...');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: !!process.env.DATABASE_URL
    });
  });
  
  // Policy briefs routes
  app.get('/api/policy-briefs', async (_req: Request, res: Response) => {
    try {
      const briefs = await storage.getPolicyBriefs();
      res.json(briefs);
    } catch (error: any) {
      console.error('Error fetching policy briefs:', error);
      res.status(500).json({ error: 'Failed to fetch policy briefs', details: error.message });
    }
  });
  
  app.get('/api/policy-briefs/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const brief = await storage.getPolicyBrief(id);
      if (!brief) {
        return res.status(404).json({ error: 'Policy brief not found' });
      }
      res.json(brief);
    } catch (error: any) {
      console.error('Error fetching policy brief:', error);
      res.status(500).json({ error: 'Failed to fetch policy brief', details: error.message });
    }
  });
  
  // Staff members routes
  app.get('/api/staff', async (_req: Request, res: Response) => {
    try {
      const staff = await storage.getStaffMembers();
      res.json(staff);
    } catch (error: any) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ error: 'Failed to fetch staff members', details: error.message });
    }
  });
  
  app.get('/api/staff/featured', async (_req: Request, res: Response) => {
    try {
      const staff = await storage.getFeaturedStaffMembers();
      res.json(staff);
    } catch (error: any) {
      console.error('Error fetching featured staff:', error);
      res.status(500).json({ error: 'Failed to fetch featured staff', details: error.message });
    }
  });
  
  // Research metrics routes
  app.get('/api/research-metrics', async (_req: Request, res: Response) => {
    try {
      const metrics = await storage.getResearchMetrics();
      res.json(metrics);
    } catch (error: any) {
      console.error('Error fetching research metrics:', error);
      res.status(500).json({ error: 'Failed to fetch research metrics', details: error.message });
    }
  });
  
  // Events routes
  app.get('/api/events', async (_req: Request, res: Response) => {
    try {
      const eventsList = await storage.getEvents();
      res.json(eventsList);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events', details: error.message });
    }
  });
  
  // Programs routes
  app.get('/api/programs', async (_req: Request, res: Response) => {
    try {
      const programsList = await storage.getPrograms();
      res.json(programsList);
    } catch (error: any) {
      console.error('Error fetching programs:', error);
      res.status(500).json({ error: 'Failed to fetch programs', details: error.message });
    }
  });
  
  // Publications routes
  app.get('/api/publications', async (_req: Request, res: Response) => {
    try {
      const publicationsList = await storage.getPublications();
      res.json(publicationsList);
    } catch (error: any) {
      console.error('Error fetching publications:', error);
      res.status(500).json({ error: 'Failed to fetch publications', details: error.message });
    }
  });
  
  // Gallery routes
  app.get('/api/gallery', async (_req: Request, res: Response) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error: any) {
      console.error('Error fetching gallery:', error);
      res.status(500).json({ error: 'Failed to fetch gallery', details: error.message });
    }
  });
  
  // Newsletters routes
  app.get('/api/newsletters', async (_req: Request, res: Response) => {
    try {
      const newslettersList = await storage.getNewsletters();
      res.json(newslettersList);
    } catch (error: any) {
      console.error('Error fetching newsletters:', error);
      res.status(500).json({ error: 'Failed to fetch newsletters', details: error.message });
    }
  });
  
  // Newsletter subscription
  app.post('/api/subscribe', async (req: Request, res: Response) => {
    try {
      const { email, name } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      const subscriber = await storage.createSubscriber({ email, name });
      res.status(201).json({ success: true, subscriber });
    } catch (error: any) {
      console.error('Error creating subscriber:', error);
      if (error.message?.includes('unique')) {
        return res.status(409).json({ error: 'Email already subscribed' });
      }
      res.status(500).json({ error: 'Failed to subscribe', details: error.message });
    }
  });
  
  // Contact form
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      await storage.createContactMessage({ name, email, subject, message });
      res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error: any) {
      console.error('Error creating contact message:', error);
      res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
  });
  
  console.log('Vercel API routes initialized successfully');
  return app;
}
