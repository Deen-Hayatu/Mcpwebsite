// Import server routes for Vercel deployment
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the main server routes
export async function registerRoutes(app) {
  try {
    // Import the main routes from the server directory
    const serverPath = resolve(__dirname, '../server/routes.js');
    const { registerRoutes: mainRegisterRoutes } = await import(serverPath);
    
    console.log('Loading server routes for Vercel...');
    
    // Initialize the main routes
    const server = await mainRegisterRoutes(app);
    
    console.log('Server routes loaded successfully');
    return server;
  } catch (error) {
    console.error('Error loading server routes:', error);
    
    // Fallback basic routes if main routes fail
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
    app.get('/api/policy-briefs', (req, res) => {
      res.json([
        {
          id: 6,
          title: "Ghana's Waste Crisis: A Reflection on a Nation's Contradictions",
          date: "May 31, 2025",
          excerpt: "A critical examination of Ghana's waste management challenges and systemic failures.",
          author: "Mohammad Deen Hayatu",
          type: "opinion"
        }
      ]);
    });
    
    app.get('/api/research-metrics', (req, res) => {
      res.json([
        { id: 1, name: "Total Publications", value: 45, category: "research" },
        { id: 2, name: "Policy Citations", value: 128, category: "impact" },
        { id: 3, name: "Research Partnerships", value: 12, category: "collaboration" }
      ]);
    });
    
    throw error;
  }
}