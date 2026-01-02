# Vercel Deployment Guide for MPC Ghana Website

This document provides instructions for deploying the MPC Ghana website to Vercel.

## Deployment Steps

### 1. Vercel CLI Installation and Login

If you haven't already:

```bash
npm install -g vercel
vercel login
```

### 2. Deploy the Application

Run this command from the project root:

```bash
vercel
```

Answer the questions as follows:
- Set up and deploy? → Yes
- Which scope? → Select your personal/organization account
- Link to existing project? → No
- Project name → mcpwebsite (or your preferred name)
- In which directory is your code located? → ./
- Want to override settings? → No

### 3. Environment Variables

After initial deployment, set these environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Go to Settings → Environment Variables
3. Add the following variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `SESSION_SECRET` - **required on Vercel** (serverless) for stable logins/sessions
   - `PERPLEXITY_API_KEY` - API key for Perplexity AI
   - `STRIPE_SECRET_KEY` - Stripe secret key for payments
   - `VITE_STRIPE_PUBLIC_KEY` - Stripe public key for frontend
   - `VITE_PAYPAL_CLIENT_ID` - PayPal client ID for frontend
   - `VITE_PAYSTACK_PUBLIC_KEY` - Paystack public key for frontend
   - `SENDGRID_API_KEY` / `AWS_*` / `MAILGUN_*` - if you use email features
   - Other secrets as needed for emails/etc.

### 4. Custom Domain Setup

To connect your domain (www.mpcghana.org):

1. Go to your project in the Vercel dashboard
2. Go to Settings → Domains
3. Add your domain: `www.mpcghana.org`
4. Follow the DNS configuration instructions provided by Vercel
5. Verify the domain

### 5. Troubleshooting

If you encounter issues:
- Check the Vercel logs (Run `vercel logs` or view in dashboard)
- Ensure all environment variables are set
- Verify your Vercel project has sufficient resources allocated

### 6. Database Configuration

Make sure your PostgreSQL database:
- Is accessible from the Vercel serverless functions
- Has all tables properly created via your schema
- Consider using Neon.tech or a similar provider for best compatibility

## API Authentication and Security

When deploying to Vercel, ensure:
1. All API routes properly authenticate requests
2. Rate limiting is implemented for public endpoints
3. CORS is properly configured

## Continuous Deployment

For ongoing updates:
- Push to your repository
- Vercel will automatically build and deploy changes
- You can rollback to previous deployments if needed

## Important Notes

- Vercel has a serverless architecture, so long-running processes won't work
- Server-side sessions must be stored in the database or another external store (this project uses Postgres-backed sessions on Vercel)
- Image and file uploads should use S3 or another storage service

## Sitemap

This project serves a **dynamic** sitemap (DB-backed). On Vercel it is handled via a serverless route and mapped to:

- `/sitemap.xml`