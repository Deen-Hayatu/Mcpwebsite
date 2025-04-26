// Special Vercel serverless API handler for research metrics
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
  console.log('[Vercel Research Metrics API] Processing research metrics request');
  
  try {
    // Direct database connection (bypassing Drizzle ORM for reliability in serverless)
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
      keepAlive: false,
      connectionTimeoutMillis: 10000
    });

    // Handle category filter
    const category = req.query.category;
    
    let query = 'SELECT * FROM research_metrics';
    const queryParams: string[] = [];
    
    if (category) {
      query += ' WHERE category = $1';
      // Handle both string and array cases
      queryParams.push(Array.isArray(category) ? category[0] : category);
    }
    
    query += ' ORDER BY date DESC';

    // Execute query
    const result = await pool.query(query, queryParams);
    console.log(`[Vercel Research Metrics API] Successfully retrieved ${result.rows.length} research metrics`);
    
    // Close pool
    await pool.end();
    
    // Transform the raw SQL result to match the expected schema format
    const transformedData = result.rows.map(row => {
      return {
        id: row.id,
        name: row.name,
        category: row.category,
        value: parseInt(row.value, 10), // Ensure the value is an integer
        date: row.date || new Date().toISOString(),
        description: row.description || null
      };
    });

    // Return transformed data
    res.status(200).json(transformedData);
  } catch (error) {
    console.error('[Vercel Research Metrics API] Error fetching research metrics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch research metrics', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}