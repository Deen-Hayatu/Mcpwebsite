// API handler for Vercel serverless functions
import express, { Request, Response, NextFunction } from 'express';
import { registerRoutes } from './routes';

// Create Express application
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Setup middleware for logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`API Request: ${req.method} ${req.url}`);
  next();
});

// Initialize routes once
let routesInitialized = false;
let routesInitializationPromise: Promise<void> | null = null;

const initializeRoutes = async () => {
  if (!routesInitializationPromise) {
    routesInitializationPromise = registerRoutes(app)
      .then(() => {
        routesInitialized = true;
        console.log('API routes initialized successfully');
        
        // Add error handling middleware
        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
          console.error('Server error:', err);
          const status = err.status || err.statusCode || 500;
          const message = err.message || "Internal Server Error";
          res.status(status).json({ error: message });
        });
      })
      .catch((error: Error) => {
        console.error('Failed to initialize API routes:', error);
        routesInitializationPromise = null; // Allow retry on next request
        throw error;
      });
  }
  return routesInitializationPromise;
};

export default async function handler(req: Request, res: Response) {
  try {
    if (!routesInitialized) {
      await initializeRoutes();
    }
    
    // Handle the request with the Express app
    return app(req as any, res as any);
  } catch (error: any) {
    console.error('API handler error:', error);
    
    // Send a proper error response
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Server error occurred',
      timestamp: new Date().toISOString()
    });
  }
}
