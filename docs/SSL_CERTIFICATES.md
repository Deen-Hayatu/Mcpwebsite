# SSL Certificates Guide for MPC Ghana

This guide outlines the steps to acquire and implement Organization Validated (OV) or Extended Validation (EV) SSL certificates for the mpcghana.org domain.

## Why Use OV or EV Certificates

- **Organization Validated (OV)** certificates verify both domain ownership and some level of organization identity, providing improved security and trust compared to Domain Validated (DV) certificates.

- **Extended Validation (EV)** certificates provide the most rigorous verification, displaying your organization name in the browser's address bar (in some browsers) and are recommended for financial, governmental, and other high-trust applications.

## Steps to Obtain OV/EV Certificates

### 1. Choose a Certificate Authority (CA)

Recommended CAs that offer OV and EV certificates:
- DigiCert
- Comodo (now Sectigo)
- GlobalSign
- GoDaddy
- Entrust

### 2. Prepare Required Documentation

For **Organization Validated (OV)** certificates:
- Proof of organization existence (business registration documents)
- Proof of domain ownership
- Contact information for verification

For **Extended Validation (EV)** certificates (additional requirements):
- Legal existence documentation
- Physical location verification
- Operational existence verification (usually 3+ years)
- Telephone verification
- Final verification by a qualified person at the CA

### 3. Purchase and Verification Process

1. Create an account with your chosen CA
2. Select OV or EV certificate option
3. Submit CSR (Certificate Signing Request)
4. Complete the verification process
   - Submit requested documentation
   - Respond to verification phone calls/emails
5. Wait for verification (typically 1-3 business days for OV, 3-7 days for EV)

### 4. Implementing on Vercel

Since the MPC Ghana website uses Vercel for deployment, follow these steps:

1. After receiving your certificate, you'll need:
   - Certificate file (.crt or .pem)
   - Private key file
   - CA bundle/intermediate certificates (if provided separately)

2. Go to Vercel Dashboard → Project Settings → Domains
3. Select your domain (mpcghana.org)
4. Under "HTTPS Certificate", click "Upload Certificate"
5. Upload the required files in the appropriate fields
6. Save changes

Alternatively, you can use Vercel's automatic certificate management with a custom domain by:

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your domain if not already added
3. Follow the verification steps
4. Vercel will automatically issue a certificate

### 5. Implementing with Namecheap (your domain provider)

Since you purchased your domain through Namecheap, you can also:

1. Purchase an OV or EV certificate directly through Namecheap
2. Complete the verification process
3. Have Namecheap install the certificate on your hosting
4. Update CNAME records to point to Vercel

### 6. Certificate Monitoring and Maintenance

- Set up monitoring for certificate expiration (typically valid for 1-2 years)
- Renew certificates 30 days before expiration
- Implement automated renewal if supported
- Update certificates after organization information changes

### 7. Security Headers Implementation

Already implemented in the MPC Ghana website:
- HTTP Strict Transport Security (HSTS)
- Content Security Policy (CSP)
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy

## Verifying Certificate Status

After installation, verify your certificate implementation:
- Visit [SSL Labs](https://www.ssllabs.com/ssltest/)
- Enter your domain
- Aim for an A+ rating

## Certificate Transparency Monitoring

Set up monitoring for certificates issued in your domain name:
- Use [Certificate Transparency Search](https://crt.sh/)
- Set up alerts for new certificates issued for your domain

## Contact Information

For assistance with SSL certificate implementation, contact:
- Your certificate provider's support
- Vercel support for deployment questions
- Namecheap support for domain-related questions

---

*This document was created for Movement for Positive Change (MPC) Ghana.*