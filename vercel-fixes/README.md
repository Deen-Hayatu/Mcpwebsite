# Vercel Deployment Fixes

This directory contains files that help fix issues with database connectivity and API functionality when deploying the MPC Ghana website to Vercel's serverless environment.

## Problem Overview

When deploying to Vercel, the application experienced database connectivity issues, particularly with the PostgreSQL database. The main issue was that the Drizzle ORM and connection pool management wasn't working properly in Vercel's serverless environment.

## Solution Approach

The solution involves:

1. **Specialized API Endpoints**: Created direct API handlers that bypass the Express middleware and ORM layers for critical data endpoints (`/api/staff` and `/api/research-metrics`).

2. **Connection Management**: Better handling of PostgreSQL connections with proper closing and error handling specifically for serverless environments.

3. **Data Transformation**: Proper transformation of raw SQL results to match the expected schema format, including handling of array data and JSON fields that come directly from PostgreSQL.

4. **Enhanced Error Logging**: Added detailed logging to pinpoint connectivity issues in the Vercel environment.

5. **Routes Configuration**: Updated Vercel.json to use the specialized API handlers for specific routes while falling back to the general Express handler for other routes.

## Files

- `api/index.ts` - Main API handler for general Express routes
- `api/staff.ts` - Specialized handler for staff data (bypasses ORM)
- `api/research-metrics.ts` - Specialized handler for research metrics data (bypasses ORM)
- `server/vercel-debug-middleware.ts` - Special middleware with enhanced logging and diagnostics
- `vercel.json` - Updated configuration for routing in Vercel
- `vercel-deployment-guide.md` - Comprehensive deployment guide for future reference

## Usage

1. Copy these files to your project
2. Deploy to Vercel following the instructions in `vercel-deployment-guide.md`
3. Ensure all required environment variables are properly set in your Vercel project settings

## Common Issues

- **Cold Start Timeouts**: Vercel functions have limited execution time, particularly during cold starts. The direct SQL approach helps reduce this issue.

- **Connection Pooling**: In serverless environments, persistent connection pools can cause issues. Our approach creates short-lived connections that are properly closed.

- **Data Format Consistency**: Raw SQL queries return data in a slightly different format than Drizzle ORM. Our transformation functions ensure consistent data shapes for the frontend.

## Further Improvements

- Add more specialized endpoints for other frequently accessed data (events, publications, etc.)
- Create a Vercel-specific database access layer that optimizes for serverless execution
- Implement edge caching for frequently accessed data