#!/bin/bash
set -e

echo "Starting Vercel build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the client-side application with Vite
echo "Building client-side application..."
npx vite build --outDir dist/client

# Build the API serverless function with esbuild
echo "Building API serverless function..."
npx esbuild api/index.ts \
  --bundle \
  --platform=node \
  --target=node18 \
  --format=esm \
  --outfile=api/index.js \
  --external:express \
  --external:@neondatabase/serverless \
  --external:drizzle-orm

echo "Build completed successfully!"
