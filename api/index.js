// API handler for Vercel serverless functions
import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize routes once
let server;
let routesPromise = registerRoutes(app).then((httpServer) => {
  server = httpServer;
  return app;
});

export default async function handler(req, res) {
  try {
    // Wait for routes to be registered
    const app = await routesPromise;
    
    // Handle the request
    return app(req, res);
  } catch (error) {
    console.error('API request error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
}