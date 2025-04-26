#!/bin/bash
set -e

echo "Starting Vercel build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the client-side application with Vite
echo "Building client-side application..."
npx vite build

# Build the server-side application with esbuild
echo "Building server-side application..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"