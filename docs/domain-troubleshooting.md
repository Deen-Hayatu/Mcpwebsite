# Domain Connection Troubleshooting - MPC Ghana

## Common Issues & Solutions

### 1. DNS Propagation Delay
**Problem**: DNS changes can take 24-48 hours to propagate globally.
**Solution**: Wait and check periodically.

### 2. Incorrect DNS Records in Namecheap
**Most Common Issue**: Wrong A record or CNAME configuration.

**Correct Configuration:**
```
Type    Host    Value                   TTL
A       @       76.76.19.61            300
CNAME   www     cname.vercel-dns.com   300
```

### 3. Check Current DNS Settings

**Step 1: Check what Vercel expects**
1. Go to Vercel Dashboard → Your Project → Domains
2. Click on `mpcghana.org`
3. Note the exact DNS records Vercel shows

**Step 2: Update Namecheap DNS**
1. Login to Namecheap
2. Go to Domain List → Manage → Advanced DNS
3. Delete any existing A or CNAME records for @ and www
4. Add new records exactly as Vercel specifies

### 4. Verify Domain Status in Vercel

**Check these in Vercel Dashboard:**
- [ ] Domain shows "Active" status (not "Invalid Configuration")
- [ ] SSL certificate is "Active"
- [ ] No error messages in domain settings

### 5. Alternative DNS Records (Try if above doesn't work)

**Option A: Vercel's Latest IPs**
```
Type    Host    Value
A       @       76.76.19.61
A       @       76.223.126.88
CNAME   www     cname.vercel-dns.com
```

**Option B: If CNAME doesn't work**
```
Type    Host    Value
A       @       76.76.19.61
A       www     76.76.19.61
```

### 6. Common Namecheap Mistakes

**Wrong**: Setting Host as "mpcghana.org" (should be "@")
**Wrong**: Setting CNAME value as "vercel.com" (should be "cname.vercel-dns.com")
**Wrong**: Keeping old DNS records active

### 7. Force DNS Refresh

**Clear DNS Cache:**
- Chrome: chrome://net-internals/#dns → Clear host cache
- Windows: `ipconfig /flushdns`
- Mac: `sudo dscacheutil -flushcache`

### 8. Test Domain Resolution

**Online Tools:**
- whatsmydns.net → Enter "mpcghana.org"
- dnschecker.org → Check global propagation

### 9. Vercel Domain Verification

**If domain shows "Pending":**
1. Vercel Dashboard → Domains → Click "Refresh"
2. Wait 5-10 minutes
3. Check if status changes to "Active"

### 10. SSL Certificate Issues

**If HTTPS doesn't work:**
- SSL certificates are automatically generated after DNS resolves
- May take 30-60 minutes after DNS is correct
- Check Vercel Dashboard → Domains → SSL status

## Step-by-Step Fix Process

### Phase 1: Verify Vercel Configuration
1. Vercel Dashboard → Project → Domains
2. Confirm `mpcghana.org` is added
3. Note exact DNS requirements shown

### Phase 2: Fix Namecheap DNS
1. Namecheap → Domain List → Manage
2. Advanced DNS tab
3. Delete all existing A/CNAME records for @ and www
4. Add records exactly as Vercel specifies
5. Set TTL to 300 (5 minutes)

### Phase 3: Wait and Verify
1. Wait 15-30 minutes minimum
2. Try accessing mpcghana.org in incognito mode
3. Check both http:// and https://

### Phase 4: Contact Support if Still Broken
**Vercel Support**: If domain shows correct in Namecheap but fails in Vercel
**Namecheap Support**: If DNS changes aren't taking effect

## Quick Checklist

- [ ] Added domain in Vercel Dashboard
- [ ] Copied exact DNS records from Vercel
- [ ] Updated Namecheap Advanced DNS settings
- [ ] Deleted conflicting old records
- [ ] Waited at least 30 minutes
- [ ] Tested in incognito/private browsing
- [ ] Checked both www.mpcghana.org and mpcghana.org

## Expected Timeline

- **DNS Update**: 5-30 minutes
- **Global Propagation**: 2-24 hours
- **SSL Certificate**: 30-60 minutes after DNS resolves

## What Should Work Once Fixed

✅ https://mpcghana.org → Your website
✅ https://www.mpcghana.org → Redirects to above
✅ SSL certificate shows as secure
✅ All pages load correctly