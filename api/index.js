// Serverless API entry point for Vercel
import express from 'express';
import { registerRoutes } from '../server/routes';

// Create Express app for Vercel serverless environment
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Setup middleware for logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`API: ${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Initialize routes with the app instance
let handlerPromise;
function ensureRoutesRegistered() {
  if (!handlerPromise) {
    handlerPromise = registerRoutes(app)
      .then(() => {
        // Add error handling middleware
        app.use((err, _req, res, _next) => {
          console.error('Server error:', err);
          const status = err.status || err.statusCode || 500;
          const message = err.message || "Internal Server Error";
          res.status(status).json({ message });
        });
        return app;
      })
      .catch(error => {
        console.error('Failed to initialize API routes:', error);
        throw error;
      });
  }
  return handlerPromise;
}

// Export the handler function for Vercel
export default async function handler(req, res) {
  try {
    // Ensure routes are registered before handling the request
    await ensureRoutesRegistered();
    
    // Forward the request to the express app
    return app(req, res);
  } catch (error) {
    console.error('API request error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Server error occurred'
    });
  }
};