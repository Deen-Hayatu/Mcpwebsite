# Deployment Fix Files

## Files to Update

### 1. vercel.json (Replace entire file)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm run build",
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
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/sitemap.xml",
      "dest": "/api/index.js"
    },
    {
      "src": "/robots.txt",
      "dest": "/robots.txt"
    },
    {
      "src": "/google3fee05f6d7926297.html",
      "dest": "/google3fee05f6d7926297.html"
    },
    {
      "src": "/(.*\\.(js|css|ico|png|jpg|jpeg|svg|json|txt|woff|woff2|ttf|eot|map))",
      "dest": "/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Git Commands to Run

```bash
# In your local repository
git add vercel.json
git commit -m "Fix Vercel deployment routing configuration"
git push origin main
```

## What This Fixes

✅ **Routes properly**: Frontend routes to HTML, API routes to backend
✅ **Builds correctly**: Uses npm run build to create dist/ folder  
✅ **Serves assets**: JavaScript, CSS, images load properly
✅ **SPA support**: React routing works on all pages
✅ **SEO files**: robots.txt and sitemap.xml accessible

## After Pushing

1. Vercel will automatically detect the changes
2. A new deployment will start
3. Your website should show the proper homepage instead of JavaScript code
4. Check https://mpcghana.org after deployment completes

## Expected Result

Instead of seeing JavaScript code, you'll see:
- Beautiful MPC Ghana homepage
- Independence Arch header image
- Proper navigation menu
- Ghana-themed colors (red, yellow, green)
- Working research pages and content