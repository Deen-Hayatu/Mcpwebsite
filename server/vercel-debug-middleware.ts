import { Request, Response, NextFunction } from "express";
import { db, pool } from "./db";
import * as schema from "@shared/schema";

/**
 * Special middleware that attempts to verify database connection
 * in Vercel environment and logs detailed information about issues
 */
export const vercelDbConnectionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Only run this in Vercel environment on API routes
  if (!process.env.VERCEL || !req.path.startsWith('/api')) {
    return next();
  }

  // For monitoring and debugging
  console.log(`[Vercel Debug] Received ${req.method} request to ${req.path}`);
  console.log(`[Vercel Debug] Environment variables present:`, {
    DATABASE_URL: !!process.env.DATABASE_URL,
    PGHOST: !!process.env.PGHOST,
    PGPORT: !!process.env.PGPORT,
    PGUSER: !!process.env.PGUSER,
    PGDATABASE: !!process.env.PGDATABASE,
    VERCEL: process.env.VERCEL,
  });

  try {
    // Try to execute a simple query to test the database connection
    const startTime = Date.now();
    console.log(`[Vercel Debug] Testing database connection...`);

    // First, test the pool directly
    await pool.query('SELECT 1 as result');
    
    // Then try a simple Drizzle query to ensure ORM is working
    const result = await db.select({ count: schema.users.id }).from(schema.users);
    
    const duration = Date.now() - startTime;
    console.log(`[Vercel Debug] Database connection successful (${duration}ms)`);
    
    next();
  } catch (error) {
    console.error(`[Vercel Debug] Database connection error:`, error);
    
    // Try to get more information about the connection
    try {
      console.log(`[Vercel Debug] Current pool status:`, {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
      });
    } catch (poolError) {
      console.error(`[Vercel Debug] Failed to get pool status:`, poolError);
    }
    
    // For critical paths like staff data, try a special direct DB connection
    if (req.path.includes('/api/staff')) {
      console.log(`[Vercel Debug] Attempting backup connection method for staff data...`);
      try {
        // Create a new one-time connection
        const { Pool } = require('@neondatabase/serverless');
        const tempPool = new Pool({ 
          connectionString: process.env.DATABASE_URL,
          ssl: true,
          keepAlive: false,
          connectionTimeoutMillis: 10000
        });
        
        // Try a direct query
        const result = await tempPool.query('SELECT * FROM staff_members ORDER BY sort_order');
        
        console.log(`[Vercel Debug] Backup connection successful, retrieved ${result.rows.length} staff members`);
        
        // Return the staff data directly
        return res.json(result.rows);
      } catch (backupError) {
        console.error(`[Vercel Debug] Backup connection also failed:`, backupError);
        
        // Fall back to error response
        return res.status(500).json({
          error: "Failed to connect to database in Vercel environment",
          message: "Please try again later or contact support"
        });
      }
    }
    
    // Continue to the normal route handler which will likely fail
    // but we've logged detailed information
    next();
  }
};