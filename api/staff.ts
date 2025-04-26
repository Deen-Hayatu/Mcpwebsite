// Special Vercel serverless API handler for staff
import type { IncomingMessage, ServerResponse } from 'http';
import { Pool } from '@neondatabase/serverless';

// Simple type definitions for our handler
type VercelRequest = IncomingMessage & {
  query: Record<string, string | string[]>;
  method?: string;
};

type VercelResponse = ServerResponse & {
  status(code: number): VercelResponse;
  json(body: any): void;
  setHeader(name: string, value: string): VercelResponse;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only handle GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Log diagnostics for debugging
  console.log('[Vercel Staff API] Processing staff data request');
  console.log('[Vercel Staff API] Environment check:', {
    DATABASE_URL: !!process.env.DATABASE_URL,
    PGHOST: !!process.env.PGHOST,
    PGPORT: !!process.env.PGPORT,
    PGUSER: !!process.env.PGUSER,
    PGDATABASE: !!process.env.PGDATABASE
  });

  try {
    // Direct database connection (bypassing Drizzle ORM for reliability in serverless)
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
      keepAlive: false,
      connectionTimeoutMillis: 10000
    });

    // Handle featured filter
    const isFeatured = req.query.featured === 'true';
    
    let query = 'SELECT * FROM staff_members';
    if (isFeatured) {
      query += ' WHERE is_featured = true';
    }
    query += ' ORDER BY sort_order';

    // Execute query
    const result = await pool.query(query);
    console.log(`[Vercel Staff API] Successfully retrieved ${result.rows.length} staff members`);
    
    // Close pool
    await pool.end();
    
    // Return data
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('[Vercel Staff API] Error fetching staff data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch staff data', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}