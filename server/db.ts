import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Only use webSocketConstructor in environments that support it (not Vercel Edge)
if (typeof process !== 'undefined' && !process.env.VERCEL) {
  neonConfig.webSocketConstructor = ws;
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Direct database connection for Vercel
const connectionOptions = { 
  connectionString: process.env.DATABASE_URL,
  // Add special handling for Vercel environment
  ...(process.env.VERCEL ? { 
    ssl: true,
    keepAlive: false, // Important for serverless environments
    connectionTimeoutMillis: 5000 // Shorter timeout for serverless
  } : {})
};

export const pool = new Pool(connectionOptions);
export const db = drizzle(pool, { schema });