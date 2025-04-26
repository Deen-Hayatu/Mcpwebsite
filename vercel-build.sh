#!/bin/bash

# Build the client
echo "Building client..."
npm run build

# Make sure the dist directory exists
echo "Ensuring dist directory exists..."
mkdir -p dist

# Copy the API folder for serverless functions
echo "Copying API folder..."
cp -r api dist/

# Success message
echo "Build completed successfully!"