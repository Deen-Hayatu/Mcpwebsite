# Connecting mpcghana.org to Vercel

This guide covers how to connect your custom domain (mpcghana.org) to your Vercel deployment.

## Prerequisites

1. A successfully deployed MPC Ghana website on Vercel
2. Access to your Namecheap domain management panel

## Step 1: Add Your Domain to Vercel

1. Go to your Vercel dashboard (https://vercel.com/dashboard)
2. Select your project (mpcghana)
3. Go to "Settings" > "Domains"
4. Enter `mpcghana.org` and click "Add"
5. Also add `www.mpcghana.org` as a secondary domain

## Step 2: Configure Namecheap DNS

When you add your domain to Vercel, you'll be shown the required DNS records to add to your Namecheap account. You'll need to add these to your Namecheap domain settings.

1. Log in to your Namecheap account
2. Go to "Domain List" and click "Manage" next to mpcghana.org
3. Click on the "Advanced DNS" tab
4. Remove any existing A, CNAME, or ALIAS records that might conflict
5. Add the following records:

### For the root domain (mpcghana.org)

- Type: A
- Host: @
- Value: 76.76.21.21
- TTL: Automatic

### For the www subdomain (www.mpcghana.org)

- Type: CNAME
- Host: www
- Value: cname.vercel-dns.com
- TTL: Automatic

## Step 3: Verify DNS Configuration

1. Return to Vercel's domain settings page for your project
2. You'll see verification status for each domain
3. It may take some time for DNS changes to propagate (usually 5-30 minutes, but can take up to 48 hours)
4. Vercel will automatically check and verify the DNS configuration

## Step 4: Configure SSL Certificate

Vercel will automatically issue and manage SSL certificates for your domain. You don't need to manually configure this.

## Step 5: Test Your Domain

Once the DNS changes have propagated and Vercel shows the domain as "Valid":

1. Visit https://mpcghana.org in your browser
2. Verify that your website loads correctly
3. Test that https://www.mpcghana.org also redirects to your site

## Troubleshooting Common Issues

### Domain Not Connecting

If your domain is not connecting after several hours:

1. Double-check the DNS records in Namecheap
2. Ensure there are no conflicting records
3. Try using a DNS lookup tool like [MxToolbox](https://mxtoolbox.com/) to check if your DNS records are correctly configured

### SSL Certificate Issues

If you're experiencing SSL certificate warnings:

1. Ensure your domain is verified in Vercel
2. Check if your browser is caching an old certificate
3. Try visiting the site in an incognito/private browsing window

### www Subdomain Not Working

If the www subdomain isn't working:

1. Verify the CNAME record is correctly set up in Namecheap
2. Make sure you've added both domains (with and without www) to Vercel

## Moving Forward

After you've successfully connected your domain, remember to:

1. Update all links in your website, social media profiles, and printed materials to use the new domain
2. Configure your email system to use the new domain (if using a separate email service)
3. Set up domain monitoring to be alerted of any future issues