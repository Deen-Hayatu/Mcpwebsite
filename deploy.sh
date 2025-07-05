#!/bin/bash

# Simple deployment script for MPC Ghana website
echo "Starting deployment build..."

# Install dependencies
npm ci

# Build the frontend
echo "Building frontend..."
npm run build

# Start the application
echo "Starting application..."
npm run start