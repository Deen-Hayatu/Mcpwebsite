# Vercel DNS Setup Guide

## Switch to Vercel Nameservers (Recommended)

### Step 1: Add Domain in Vercel Dashboard
1. Go to Vercel Dashboard → Domains
2. Click "Add" and enter `mpcghana.org`
3. Vercel will provide these nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

### Step 2: Update Nameservers at Namecheap
1. Login to Namecheap
2. Go to Domain List → Manage `mpcghana.org`
3. Navigate to Nameservers section
4. Change from "Namecheap BasicDNS" to "Custom DNS"
5. Enter Vercel's nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
6. Save changes

### Step 3: Configure DNS in Vercel
After nameservers propagate (2-48 hours), Vercel will automatically:
- ✅ Issue SSL certificates
- ✅ Handle all DNS records
- ✅ Manage CDN routing
- ✅ Enable automatic HTTPS

## Benefits of Using Vercel Nameservers

✅ **Automatic SSL**: Vercel handles certificate provisioning and renewal
✅ **Better Performance**: Integrated CDN and edge optimization
✅ **Simplified Management**: All DNS records managed in one place
✅ **Better Integration**: Seamless connection between domain and deployment

## Alternative: Keep Namecheap DNS (More Complex)

If you prefer to keep Namecheap DNS, you'll need these records:
```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

## Recommended Approach
**Use Vercel nameservers** - it's simpler, more reliable, and provides better performance for your MPC Ghana website.

## Current Status Check
After switching nameservers, verify:
1. https://mpcghana.org shows your website (not JavaScript)
2. SSL certificate is properly configured
3. All pages load correctly