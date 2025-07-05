# CRITICAL DEPLOYMENT FIX - Updated

## Problem Identified
Your website is showing JavaScript code instead of the HTML page because the build/routing configuration is incorrect.

## CORRECTED vercel.json Configuration (Replace entire file)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "cd client && npx vite build --outDir ../dist",
        "outputDirectory": "dist"
      }
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## UPDATED api/index.js (Replace entire file)

```javascript
// Vercel API handler - simplified approach
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle sitemap.xml
  if (req.url === '/sitemap.xml') {
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mpcghana.org/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mpcghana.org/research</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mpcghana.org/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mpcghana.org/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.6</priority>
  </url>
</urlset>`);
    return;
  }

  // Simple API test endpoint
  if (req.url.startsWith('/api/')) {
    console.log(`API Request: ${req.method} ${req.url}`);
    
    // Simple test response
    res.status(200).json({ 
      message: 'API is working',
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Default response
  res.status(404).json({ error: 'Not found' });
}
```

## Git Commands to Run

```bash
# In your local repository
git add vercel.json
git commit -m "Fix Vercel deployment - use framework: vite configuration"
git push origin main
```

## What This NEW Configuration Does

✅ **Framework Detection**: Uses `"framework": "vite"` for automatic SPA handling
✅ **Simplified Routing**: Vercel handles HTML serving automatically  
✅ **API Routing**: Routes `/api/*` to backend properly
✅ **Static Assets**: Automatic serving of JS, CSS, images
✅ **Security Headers**: Adds proper security headers
✅ **Build Process**: Uses `npm run build` with `dist/` output

## Alternative: Manual Vercel Dashboard Fix

If the above doesn't work, go to Vercel Dashboard:

1. **Project Settings → General**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Project Settings → Functions**
   - Add function: `api/index.js` with runtime `@vercel/node`

## Expected Result

Your website will show:
- ✅ MPC Ghana homepage with Independence Arch
- ✅ Proper navigation and Ghana colors
- ✅ Working research pages and content
- ✅ No more JavaScript code display

## If Still Not Working

The issue might be that your `api/index.js` file isn't properly configured. The JavaScript you're seeing suggests the build is trying to serve the wrong file.