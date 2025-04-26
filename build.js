// build.js - Script to build the project for production
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the build is done in production mode
process.env.NODE_ENV = 'production';

console.log('Building project for production...');

try {
  // Create .env file for Vercel if it doesn't exist
  if (!fs.existsSync('.env')) {
    console.log('Creating .env file for Vercel deployment...');
    fs.writeFileSync('.env', 'NODE_ENV=production\n');
  }

  // Run the frontend build
  console.log('Building frontend...');
  execSync('cd client && npm run build', { stdio: 'inherit' });

  // Copy necessary files for production
  console.log('Preparing server files...');
  
  // Ensure the output directory exists
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
  }
  
  console.log('Build complete! ✨');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}