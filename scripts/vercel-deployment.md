# Deploying MPC Ghana Website to Vercel

This guide will help you deploy the MPC Ghana website to Vercel and connect it to your mpcghana.org domain.

## Prerequisites

1. A Vercel account (create one at https://vercel.com/signup if you don't have one)
2. Your domain (mpcghana.org) registered with Namecheap
3. Access to your Namecheap account to update DNS settings

## Step 1: Set up Vercel CLI

Install the Vercel CLI by running:

```bash
npm i -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to login to your Vercel account.

## Step 3: Initialize your project

From the root of your project directory, run:

```bash
vercel
```

Answer the prompts as follows:
- Set up and deploy? **Yes**
- Link to existing project? **No**
- Project name: **mpc-ghana** (or any name you prefer)
- Directory: **./** (current directory)
- Override settings? **No**

This will deploy your project to a preview URL.

## Step 4: Set up environment variables

You'll need to set up the following environment variables:

1. Go to the Vercel dashboard (https://vercel.com)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add these variables:
   - `DATABASE_URL`: Your Neon PostgreSQL database URL
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `VITE_STRIPE_PUBLIC_KEY`: Your Stripe publishable key
   - `VITE_PAYSTACK_PUBLIC_KEY`: Your Paystack public key
   - `PAYSTACK_SECRET_KEY`: Your Paystack secret key
   - `PERPLEXITY_API_KEY`: Your Perplexity API key
   - `VITE_PAYPAL_CLIENT_ID`: Your PayPal client ID (public)
   - `PAYPAL_CLIENT_ID`: Your PayPal client ID (server-side)
   - Any AWS credentials for the email service:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - `AWS_REGION` (typically set to "us-east-1" or your preferred region)

## Step 5: Deploy to Production

```bash
vercel --prod
```

This will deploy your site to production.

## Step 6: Add your domain to Vercel

1. Go to your project in the Vercel dashboard
2. Go to **Settings** > **Domains**
3. Enter `mpcghana.org` and click **Add**
4. Add `www.mpcghana.org` as well

## Step 7: Update Namecheap DNS Settings

Vercel will give you some DNS records to add. Typically, you'll need to:

1. Log in to your Namecheap account
2. Go to **Domain List** and click **Manage** next to mpcghana.org
3. Select the **Advanced DNS** tab
4. Remove any existing A, CNAME, or ALIAS records pointing to other services
5. Add the records provided by Vercel, typically:
   - A Record: `@` pointing to Vercel's IP (e.g., `76.76.21.21`)
   - CNAME Record: `www` pointing to your Vercel project URL

## Step 8: Set up Email Forwarding

As you're using AWS SES for email delivery:

1. Follow the AWS SES console instructions to verify your domain
2. Add the required TXT, CNAME, or MX records to your Namecheap DNS settings

## Step 9: Verify Domain Connection

1. Go back to the Vercel dashboard
2. Check the status of your domain in **Settings** > **Domains**
3. It may take some time (up to 48 hours) for DNS changes to propagate globally

## Step 10: Test Your Website

Once the domain is connected:

1. Visit https://mpcghana.org to ensure your website loads correctly
2. Test all features, especially forms and email functionality
3. Make sure all API endpoints are working as expected

## Troubleshooting

- If your domain doesn't connect, verify the DNS records are correct
- If you encounter 404 errors on API routes, check the Vercel function logs
- For database connection issues, ensure your DATABASE_URL environment variable is correct and the database is accessible from Vercel

## Maintenance

To deploy updates:

```bash
vercel --prod
```

This will deploy the latest version of your codebase to production.