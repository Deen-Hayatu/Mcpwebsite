#!/usr/bin/env node

/**
 * Security Configuration Checker for MPC Ghana Website
 * 
 * This script performs basic security checks on a deployed website,
 * focusing on SSL certificate configuration and security headers
 * that are important for OV/EV certification standards.
 */

const https = require('https');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Formats text with specified color
 */
function colorize(text, color) {
  return `${color}${text}${colors.reset}`;
}

/**
 * Checks if a command exists on the system
 */
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check SSL certificate details
 */
async function checkSSL(domain) {
  console.log(colorize('\n=== SSL Certificate Check ===', colors.bright + colors.blue));
  
  if (!commandExists('openssl')) {
    console.log(colorize('OpenSSL not found. Unable to check certificate details.', colors.red));
    return;
  }
  
  try {
    console.log(colorize('Certificate Information:', colors.bright));
    const certInfo = execSync(`echo | openssl s_client -servername ${domain} -connect ${domain}:443 2>/dev/null | openssl x509 -noout -text | grep -A2 "Subject:" -B2 "Issuer:"`, { encoding: 'utf8' });
    console.log(certInfo);
    
    console.log(colorize('Certificate Validation:', colors.bright));
    const certValidation = execSync(`echo | openssl s_client -servername ${domain} -connect ${domain}:443 2>/dev/null | openssl x509 -noout -dates`, { encoding: 'utf8' });
    console.log(certValidation);
    
    // Check for OV/EV indicators
    console.log(colorize('\nChecking for OV/EV Certificate Indicators:', colors.bright));
    const certSubject = execSync(`echo | openssl s_client -servername ${domain} -connect ${domain}:443 2>/dev/null | openssl x509 -noout -subject`, { encoding: 'utf8' });
    
    if (certSubject.includes('O =') || certSubject.includes('OU =')) {
      console.log(colorize('✓ Organization information found in certificate (indicates OV/EV)', colors.green));
    } else {
      console.log(colorize('✗ No organization information found (likely DV certificate)', colors.red));
      console.log('   For OV/EV certificates, organization information should be visible in the certificate');
    }
    
  } catch (error) {
    console.log(colorize(`Error checking SSL certificate: ${error.message}`, colors.red));
  }
}

/**
 * Check security headers
 */
async function checkSecurityHeaders(domain) {
  console.log(colorize('\n=== Security Headers Check ===', colors.bright + colors.blue));
  
  return new Promise((resolve) => {
    const options = {
      hostname: domain,
      port: 443,
      path: '/',
      method: 'GET',
      rejectUnauthorized: false, // Allow self-signed certificates for testing
    };
    
    const req = https.request(options, (res) => {
      console.log(colorize('HTTP Status:', colors.bright), res.statusCode);
      
      // Define expected security headers
      const expectedHeaders = {
        'strict-transport-security': { required: true, description: 'HTTP Strict Transport Security (HSTS)' },
        'content-security-policy': { required: true, description: 'Content Security Policy (CSP)' },
        'x-content-type-options': { required: true, description: 'X-Content-Type-Options' },
        'x-frame-options': { required: true, description: 'X-Frame-Options' },
        'x-xss-protection': { required: true, description: 'X-XSS-Protection' },
        'referrer-policy': { required: true, description: 'Referrer-Policy' },
        'permissions-policy': { required: false, description: 'Permissions-Policy' },
        'expect-ct': { required: false, description: 'Expect-CT (Certificate Transparency)' },
      };
      
      // Check for expected headers
      console.log(colorize('\nSecurity Headers:', colors.bright));
      Object.keys(expectedHeaders).forEach(header => {
        const headerValue = res.headers[header];
        if (headerValue) {
          console.log(colorize(`✓ ${expectedHeaders[header].description}:`, colors.green), headerValue);
        } else if (expectedHeaders[header].required) {
          console.log(colorize(`✗ ${expectedHeaders[header].description}: Not found`, colors.red));
        } else {
          console.log(colorize(`- ${expectedHeaders[header].description}: Not found (optional)`, colors.yellow));
        }
      });
      
      // Additional headers found
      console.log(colorize('\nAdditional Headers:', colors.bright));
      Object.keys(res.headers).forEach(header => {
        if (!expectedHeaders[header]) {
          console.log(`${header}:`, res.headers[header]);
        }
      });
      
      resolve();
    });
    
    req.on('error', (e) => {
      console.log(colorize(`Error checking headers: ${e.message}`, colors.red));
      resolve();
    });
    
    req.end();
  });
}

/**
 * Check for SSL Labs rating
 */
function suggestSSLLabsTest(domain) {
  console.log(colorize('\n=== Further Testing ===', colors.bright + colors.blue));
  console.log(`For a comprehensive SSL/TLS security assessment, visit:`);
  console.log(colorize(`https://www.ssllabs.com/ssltest/analyze.html?d=${domain}`, colors.cyan));
  
  console.log(`\nFor certificate transparency monitoring, visit:`);
  console.log(colorize(`https://crt.sh/?q=${domain}`, colors.cyan));
}

/**
 * Main function
 */
async function main() {
  console.log(colorize('=== MPC Ghana Website Security Checker ===', colors.bright + colors.magenta));
  console.log('This tool checks SSL certificate and security headers configuration');
  console.log('specifically focusing on requirements for OV/EV certification.');
  
  const domain = await new Promise(resolve => {
    rl.question('Enter domain to check [mpcghana.org]: ', (answer) => {
      resolve(answer || 'mpcghana.org');
    });
  });
  
  await checkSSL(domain);
  await checkSecurityHeaders(domain);
  suggestSSLLabsTest(domain);
  
  console.log(colorize('\nSecurity check complete!', colors.bright));
  rl.close();
}

// Run the main function
main();