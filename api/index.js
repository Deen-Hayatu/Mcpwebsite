// Serverless API entry point for Vercel
import { createServer } from 'http';
import express from 'express';
import { registerRoutes } from '../server/routes';

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup middleware for handling API requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Initialize routes
let server;
(async () => {
  try {
    server = await registerRoutes(app);
    
    // Handle errors
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      const path = await import('path');
      app.use(express.static(path.join(process.cwd(), 'client/dist')));
      
      app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
          res.sendFile(path.join(process.cwd(), 'client/dist/index.html'));
        }
      });
    }
    
    // Only start server if not in Vercel environment
    if (process.env.VERCEL !== '1') {
      const port = process.env.PORT || 5000;
      server.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();

// Export for Vercel
export default (req, res) => {
  if (!server) {
    return res.status(500).send('Server not initialized');
  }
  return app(req, res);
};