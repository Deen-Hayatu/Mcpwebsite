# Google Search Console Setup for MPC Ghana

## URL Coverage Requirements

Your website needs to handle these URL variations properly:

### Primary Domain (Canonical)
- `https://mpcghana.org` (PRIMARY - this is your canonical URL)

### Redirected Variations (all should redirect to primary)
- `http://mpcghana.org` → redirects to `https://mpcghana.org`
- `https://www.mpcghana.org` → redirects to `https://mpcghana.org`
- `http://www.mpcghana.org` → redirects to `https://mpcghana.org`

## Search Console Setup Options

### Option 1: Domain Property (Recommended)
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Click "Add Property"
3. Choose "Domain" (not URL prefix)
4. Enter: `mpcghana.org`
5. Verify using DNS TXT record (requires access to Namecheap DNS)

**Benefits:** Automatically covers all URL variations (http, https, www, non-www)

### Option 2: URL Prefix Properties
If DNS verification isn't possible, add separate properties for each variation:

1. `https://mpcghana.org` (Primary)
2. `https://www.mpcghana.org` (if needed)
3. `http://mpcghana.org` (if needed)
4. `http://www.mpcghana.org` (if needed)

## Current Setup Status

✅ **Implemented:**
- Automatic redirects from www to non-www
- Automatic redirects from http to https
- Google site verification file: `google3fee05f6d7926297.html`
- Dynamic sitemap at `/sitemap.xml`
- Robots.txt file

## Next Steps

1. **Choose verification method:**
   - DNS verification (recommended) - requires Namecheap access
   - HTML file verification (already implemented)

2. **Submit sitemap:**
   - URL: `https://mpcghana.org/sitemap.xml`

3. **Monitor coverage:**
   - Check for crawl errors
   - Verify all pages are indexed

## DNS Verification (If Needed)

If you choose Domain Property verification, you'll need to add a TXT record to your Namecheap DNS settings:

1. Login to Namecheap
2. Go to Domain List → Manage → Advanced DNS
3. Add TXT record with value provided by Google Search Console
4. Wait for propagation (up to 24 hours)

## Verification Status

- [ ] Google Search Console property created
- [ ] Domain verified
- [ ] Sitemap submitted
- [ ] All URL variations covered