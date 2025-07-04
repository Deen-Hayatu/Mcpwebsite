# MPC Ghana Website - Deployment Migration Guide

## Current Status
Your website is already configured for deployment with:
- ✅ Vercel configuration files (`vercel.json`, `vercel-build.sh`)
- ✅ PostgreSQL database (Neon)
- ✅ Environment variables setup
- ✅ Production build scripts

## Option 1: Vercel Deployment (Recommended - Fastest)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Domain access (mpcghana.org)

### Step 1: Prepare Repository
```bash
# 1. Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit for MPC Ghana website"

# 2. Create GitHub repository and push
git remote add origin https://github.com/yourusername/mpc-ghana.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Visit [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Add environment variables in Vercel dashboard:

**Required Environment Variables:**
```
DATABASE_URL=your_neon_database_url
SESSION_SECRET=random_64_char_string
STRIPE_SECRET_KEY=your_stripe_secret
VITE_STRIPE_PUBLIC_KEY=your_stripe_public
PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYSTACK_SECRET_KEY=your_paystack_secret
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public
PERPLEXITY_API_KEY=your_perplexity_key
```

### Step 3: Configure Custom Domain
1. In Vercel dashboard → Project Settings → Domains
2. Add `mpcghana.org` and `www.mpcghana.org`
3. Configure DNS in Namecheap:
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.19.61`

### Step 4: Verify Deployment
- Check https://mpcghana.org loads correctly
- Test database connections
- Verify payment integrations

**Estimated Time: 30-60 minutes**

---

## Option 2: AWS Deployment (Advanced)

### Architecture Options

#### Option A: AWS Amplify (Simplest)
Similar to Vercel, good for static + serverless functions.

**Steps:**
1. Push code to GitHub
2. Connect AWS Amplify to repository
3. Configure environment variables
4. Set up custom domain

#### Option B: AWS EC2 + RDS (Full Control)
Complete server setup with dedicated database.

**Components:**
- EC2 instance (t3.small or larger)
- RDS PostgreSQL instance
- CloudFront CDN
- Route 53 for DNS
- Application Load Balancer

### AWS Amplify Setup (Recommended AWS Option)

1. **Prepare Repository**
   ```bash
   # Same as Vercel steps 1
   ```

2. **AWS Amplify Console**
   - Login to AWS Console
   - Navigate to AWS Amplify
   - Connect repository
   - Configure build settings

3. **Build Configuration** (amplify.yml)
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   backend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
   ```

4. **Environment Variables**
   Same as Vercel list above

5. **Custom Domain**
   - Add domain in Amplify console
   - Update DNS records in Namecheap

**Estimated Time: 2-3 hours**

---

## Database Migration (If Needed)

### Current Setup: Neon PostgreSQL
Your database is already cloud-hosted and will work with any deployment platform.

### If Moving to AWS RDS:
1. **Export current data:**
   ```bash
   pg_dump $DATABASE_URL > mpc_backup.sql
   ```

2. **Create RDS instance:**
   - PostgreSQL 15+
   - db.t3.micro (free tier)
   - Enable automatic backups

3. **Import data:**
   ```bash
   psql $NEW_DATABASE_URL < mpc_backup.sql
   ```

---

## Environment Variables Checklist

### Required for All Deployments:
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `SESSION_SECRET` - Random 64-character string
- [ ] `NODE_ENV=production`

### Payment Integration:
- [ ] `STRIPE_SECRET_KEY`
- [ ] `VITE_STRIPE_PUBLIC_KEY`
- [ ] `PAYPAL_CLIENT_ID`
- [ ] `VITE_PAYPAL_CLIENT_ID`
- [ ] `PAYSTACK_SECRET_KEY`
- [ ] `VITE_PAYSTACK_PUBLIC_KEY`

### AI Features:
- [ ] `PERPLEXITY_API_KEY`

### Email (if using AWS SES):
- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`
- [ ] `AWS_REGION`

---

## Domain Configuration

### DNS Records (Namecheap)
```
Type    Host    Value                   TTL
A       @       76.76.19.61            300    (Vercel)
CNAME   www     cname.vercel-dns.com   300    (Vercel)

# OR for AWS Amplify
A       @       [AWS_IP]               300
CNAME   www     [amplify_domain]       300
```

### SSL Certificate
Both Vercel and AWS Amplify provide automatic SSL certificates.

---

## Post-Deployment Checklist

- [ ] Website loads at https://mpcghana.org
- [ ] All pages render correctly
- [ ] Database connections work
- [ ] Payment forms function
- [ ] Contact form sends emails
- [ ] Research metrics display
- [ ] SEO sitemap accessible
- [ ] Google Search Console verification

---

## Cost Comparison

### Vercel (Recommended)
- **Free tier:** 100GB bandwidth, unlimited sites
- **Pro:** $20/month per team member
- **Best for:** Quick deployment, automatic scaling

### AWS Amplify
- **Free tier:** 15GB storage, 5GB served per month
- **Pay-as-you-go:** $0.01 per build minute
- **Best for:** AWS ecosystem integration

### AWS EC2 + RDS
- **t3.micro:** ~$10-15/month
- **RDS:** ~$15-25/month
- **Total:** ~$25-40/month
- **Best for:** Full control, complex applications

---

## Recommendation

**For MPC Ghana, I recommend Vercel because:**
1. Your code is already optimized for it
2. Fastest deployment (30 minutes vs 2+ hours)
3. Automatic scaling and CDN
4. Free tier covers your needs
5. Excellent integration with your tech stack

**Choose AWS if:**
- You need AWS-specific services
- Your organization requires AWS compliance
- You want full infrastructure control

Would you like me to help you set up the deployment on your preferred platform?