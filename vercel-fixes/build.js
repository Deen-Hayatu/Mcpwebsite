// build.js - Script to build the project for production (works with Vercel deployments)
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the build is done in production mode
process.env.NODE_ENV = 'production';
process.env.VERCEL = 'true';

console.log('Building project for Vercel deployment...');

try {
  // Create special Vercel environment marker
  console.log('Setting up Vercel environment...');
  
  // Build the frontend
  console.log('Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Build the server for Vercel
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // Ensure API routes work in Vercel
  console.log('Setting up serverless functions for Vercel...');
  
  // Create an api directory for Vercel serverless functions
  if (!fs.existsSync('./dist/api')) {
    fs.mkdirSync('./dist/api', { recursive: true });
  }
  
  // Create serverless handler
  const serverlessHandler = `
    import { createServer } from 'http';
    import app from '../server';
    
    export default async (req, res) => {
      // Create a mock server since we don't need the actual HTTP server in Vercel
      const server = createServer();
      
      // Forward the request to our Express app
      app(req, res);
    };
  `;
  
  // Write the serverless handler
  fs.writeFileSync('./dist/api/index.js', serverlessHandler.trim());
  
  console.log('Build complete for Vercel deployment! ✨');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}