import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";

// Special config for Vercel serverless environment
const getVercelPool = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set for database connection");
  }

  // Configure Neon connection for Vercel
  const connectionOptions = {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
    // Important for Vercel serverless functions
    keepAlive: false,
    connectionTimeoutMillis: 5000
  };

  // Create connection to Neon database
  const pool = new Pool(connectionOptions);

  // Add special handling for Vercel environment
  pool.on('error', (err) => {
    console.error('Vercel database connection error:', err);
    // Auto-reconnect in case of connection issues
    pool.connect();
  });

  return pool;
};

// Export Vercel-specific database connection
export const vercelPool = getVercelPool();
export const vercelDb = drizzle(vercelPool, { schema });