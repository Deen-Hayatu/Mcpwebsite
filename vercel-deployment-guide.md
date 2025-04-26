# Vercel Deployment Guide for MPC Ghana Website

This guide explains how to apply the necessary changes to make your Vercel deployment work correctly.

## Files to Create or Modify

1. **server/db.ts** - Update database connection for Vercel compatibility
2. **vercel.json** - Configure Vercel deployment settings
3. **build.js** - Enhance build process for Vercel
4. **api/index.ts** - Create API handler for Vercel serverless functions
5. **server/vercel-db.ts** - Add specialized database connection for Vercel
6. **server/vercel-express.ts** - Create Express setup for Vercel
7. **.env** - Add template environment variables

## Step 1: Update database connection (server/db.ts)

Replace the content of `server/db.ts` with:

```typescript
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
```

## Step 2: Update vercel.json

Replace the content of `vercel.json` with:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "env": {
    "VERCEL": "true"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Step 3: Update build.js

Replace the content of `build.js` with:

```javascript
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
```

## Step 4: Create API handler (api/index.ts)

Create a new file `api/index.ts` with:

```typescript
// Vercel serverless handler for API routes
import { ServerResponse, IncomingMessage } from 'http';
import createVercelApp from '../server/vercel-express';

let app: any;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Initialize Express app if it hasn't been initialized yet
  if (!app) {
    app = await createVercelApp();
  }
  
  // Forward the request to our Express app
  return new Promise((resolve, reject) => {
    // This helps Vercel identify when the request is complete
    const oldEnd = res.end;
    res.end = function(...args: any[]) {
      oldEnd.apply(res, args);
      resolve(undefined);
      return res;
    };
    
    app(req, res, (err: Error) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Handle case where no middleware responded
      if (!res.headersSent) {
        res.statusCode = 404;
        res.end('Not found');
        resolve(undefined);
      }
    });
  });
}
```

## Step 5: Create Vercel-specific database file (server/vercel-db.ts)

Create a new file `server/vercel-db.ts` with:

```typescript
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
```

## Step 6: Create Vercel Express setup (server/vercel-express.ts)

Create a new file `server/vercel-express.ts` with:

```typescript
import * as dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./vite";

// Create Express app for Vercel
const createVercelApp = async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Configure middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        console.log(logLine);
      }
    });

    next();
  });

  // Register routes but don't bind to port (let Vercel handle that)
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error("API Error:", err);
  });

  // Serve static files in production mode
  serveStatic(app);

  return app;
};

export default createVercelApp;
```

## Step 7: Create .env template

Create a `.env` file with:

```
# This file will be used for local development
# Vercel deployment should use the environment variables from the Vercel dashboard

# Mark this as a supported Vercel deployment
VERCEL=true

# Database connection information
# These variables are automatically used by the @neondatabase/serverless package
DATABASE_URL=${DATABASE_URL}
PGHOST=${PGHOST}
PGPORT=${PGPORT}
PGUSER=${PGUSER}
PGPASSWORD=${PGPASSWORD}
PGDATABASE=${PGDATABASE}

# Payment processing credentials
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
VITE_STRIPE_PUBLIC_KEY=${VITE_STRIPE_PUBLIC_KEY}
PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
VITE_PAYPAL_CLIENT_ID=${VITE_PAYPAL_CLIENT_ID}
VITE_PAYSTACK_PUBLIC_KEY=${VITE_PAYSTACK_PUBLIC_KEY}
PAYSTACK_SECRET_KEY=${PAYSTACK_SECRET_KEY}

# Perplexity API
PERPLEXITY_API_KEY=${PERPLEXITY_API_KEY}

# Session management
SESSION_SECRET=your-super-secret-session-key-for-local-dev-only
```

## Applying These Changes to Your Develop Branch

Since you created the develop branch directly in Vercel, you have several options:

1. Download the files from this Replit project and upload them to your develop branch using GitHub's web interface.

2. Clone your repository locally, create a develop branch, apply these changes, and push back to GitHub:
   ```bash
   git clone https://github.com/Deen-Hayatu/Mcpwebsite.git
   cd Mcpwebsite
   git checkout -b develop
   # Copy all the files mentioned above
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin develop
   ```

3. Use GitHub's GitHub CLI to create a PR that adds these files to a new develop branch.

## Verifying Your Deployment

After applying these changes and pushing to your develop branch, Vercel should automatically rebuild your project. Check that:

1. Staff information loads correctly
2. Research metrics display properly
3. All API endpoints respond as expected

If issues persist, check Vercel's Function Logs to see specific error messages.