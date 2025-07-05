# Deployment Fix Files - UPDATED

## NEW vercel.json Configuration (Replace entire file)

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "api/index.js": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    },
    {
      "source": "/sitemap.xml",
      "destination": "/api/index.js"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
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