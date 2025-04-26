# Vercel Deployment Guide for MPC Ghana

This guide provides instructions for deploying the MPC Ghana website to Vercel as a staging environment or for production use.

## Prerequisites

- Vercel account
- GitHub repository with the MPC Ghana codebase
- Access to environment variables (DATABASE_URL, etc.)

## Environment Variables

When deploying to Vercel, ensure the following environment variables are set:

- `DATABASE_URL` - PostgreSQL connection string for Neon or other Postgres provider
- `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT` - Individual PostgreSQL connection parameters
- `VERCEL` - Set to "true" to enable Vercel-specific optimizations
- `VITE_STRIPE_PUBLIC_KEY` - Public key for Stripe (if using payment features)
- `STRIPE_SECRET_KEY` - Secret key for Stripe (if using payment features)
- `VITE_PAYPAL_CLIENT_ID` - PayPal client ID (if using PayPal)
- `VITE_PAYSTACK_PUBLIC_KEY` - Paystack public key (if using Paystack)
- `PAYSTACK_SECRET_KEY` - Paystack secret key (if using Paystack)
- `PERPLEXITY_API_KEY` - API key for Perplexity AI chatbot

## Deployment Steps

1. **Connect Repository to Vercel**
   - Log in to Vercel
   - Click "Add New" and select "Project"
   - Import the GitHub repository
   - Configure project settings

2. **Configure Environment Variables**
   - Add all required environment variables in the Vercel project settings

3. **Configure Build Settings**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy**
   - Click "Deploy" to start the deployment process
   - Vercel will build and deploy the application

## Troubleshooting Database Connection Issues

If you encounter database connection issues:

1. **Check Environment Variables**
   - Verify all database connection parameters are correctly set in Vercel
   
2. **Connection Pooling**
   - Ensure the database provider supports serverless environments
   - For Neon database, make sure pooling is enabled

3. **Use Direct API Endpoints**
   - The application includes specialized API endpoints for Vercel:
     - `/api/staff.js` - Provides staff data using direct SQL queries
     - `/api/research-metrics.js` - Provides research metrics using direct SQL queries
   - These endpoints bypass the ORM to improve reliability in serverless environments

4. **Check Logs**
   - Review function logs in Vercel dashboard to identify specific errors

## Production Deployment vs. Staging

- **Production**: Deploy from the `main` branch to your primary domain
- **Staging**: Deploy from the `development` branch to a preview URL

## SSL and Custom Domain Setup

1. **Add Custom Domain**
   - In Vercel project settings, go to "Domains"
   - Add your custom domain (e.g., staging.mpcghana.org)
   - Follow Vercel's DNS configuration instructions

2. **SSL Certificate**
   - Vercel automatically provisions SSL certificates for custom domains
   - No additional configuration is needed

## Special Notes for Serverless Functions

- Vercel uses serverless functions which have:
  - Cold starts (initial delay when functions haven't been used recently)
  - Limited execution time (10-60 seconds based on plan)
  - Limited memory (1-3GB based on plan)

- The specialized API routes in the `/api` directory are designed to work optimally in this environment

## Updating the Deployment

- Vercel automatically deploys when changes are pushed to the connected branch
- You can also trigger manual deployments from the Vercel dashboard

## Support

If you encounter any issues with the deployment, contact the development team for assistance.