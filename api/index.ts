// Main API handler for Vercel
import type { IncomingMessage, ServerResponse } from 'http';
import express from 'express';
import { vercelDbConnectionMiddleware } from '../server/vercel-debug-middleware';
import { registerRoutes } from '../server/routes';
import bodyParser from 'body-parser';

// Create Express app
const app = express();

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add Vercel debugging middleware
app.use(vercelDbConnectionMiddleware);

// Register all API routes
registerRoutes(app);

// Export the handler function
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Log request for debugging
  console.log(`[Vercel API] ${req.method} ${req.url}`);

  // Run the Express app
  return new Promise((resolve, reject) => {
    // Cast to any to work around type incompatibility between Express and serverless
    app(req as any, res as any, (err: Error) => {
      if (err) {
        console.error('[Vercel API] Error processing request:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({ 
          error: 'Internal Server Error',
          message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
        }));
        return reject(err);
      }
      resolve(undefined);
    });
  });
}