#!/usr/bin/env node

/**
 * Certificate Signing Request (CSR) Generator for OV/EV Certificates
 * 
 * This script generates a CSR and private key for use in requesting 
 * an Organization Validated (OV) or Extended Validation (EV) SSL certificate.
 * 
 * Usage:
 *   node generate-csr.js
 * 
 * Requirements:
 *   - Node.js with OpenSSL support
 */

const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Prompt for certificate information
 */
async function promptForInfo() {
  const questions = [
    { name: 'country', label: 'Country Name (2 letter code) [GH]: ', default: 'GH' },
    { name: 'state', label: 'State or Province Name (full name) [Greater Accra]: ', default: 'Greater Accra' },
    { name: 'locality', label: 'Locality Name (eg, city) [Accra]: ', default: 'Accra' },
    { name: 'organization', label: 'Organization Name (eg, company) [Movement for Positive Change]: ', default: 'Movement for Positive Change' },
    { name: 'orgUnit', label: 'Organizational Unit Name (eg, section) []: ', default: '' },
    { name: 'commonName', label: 'Common Name (e.g. server FQDN or YOUR name) [mpcghana.org]: ', default: 'mpcghana.org' },
    { name: 'email', label: 'Email Address [info@mpcghana.org]: ', default: 'info@mpcghana.org' },
    { name: 'altNames', label: 'Alternative Domain Names (comma separated) [www.mpcghana.org]: ', default: 'www.mpcghana.org' },
    { name: 'keySize', label: 'Key Size (2048, 4096) [4096]: ', default: '4096' },
  ];

  const answers = {};

  for (const question of questions) {
    const answer = await new Promise(resolve => {
      rl.question(question.label, (answer) => {
        resolve(answer || question.default);
      });
    });
    answers[question.name] = answer;
  }

  return answers;
}

/**
 * Generate OpenSSL config
 */
function generateConfig(info) {
  // Prepare SAN list
  const altNames = info.altNames.split(',').map(domain => domain.trim());
  const sanList = altNames.map((domain, i) => `DNS.${i+2} = ${domain}`).join('\n');

  // Create OpenSSL config
  const config = `[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = ${info.country}
ST = ${info.state}
L = ${info.locality}
O = ${info.organization}
${info.orgUnit ? `OU = ${info.orgUnit}\n` : ''}CN = ${info.commonName}
emailAddress = ${info.email}

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = ${info.commonName}
${sanList}
`;

  // Write the config to a file
  fs.writeFileSync('openssl.cnf', config);
  console.log('Generated OpenSSL configuration file: openssl.cnf');
}

/**
 * Generate Private Key and CSR
 */
function generateKeyAndCSR(info) {
  // Create output directory if it doesn't exist
  if (!fs.existsSync('./certs')) {
    fs.mkdirSync('./certs');
  }
  
  try {
    // Generate private key
    console.log(`\nGenerating ${info.keySize}-bit private key...`);
    execSync(`openssl genrsa -out ./certs/private.key ${info.keySize}`);
    
    // Generate CSR using the config
    console.log('Generating Certificate Signing Request (CSR)...');
    execSync(`openssl req -new -key ./certs/private.key -out ./certs/request.csr -config openssl.cnf`);
    
    // Output CSR information for verification
    console.log('\nCSR Information:');
    const csrInfo = execSync('openssl req -text -noout -in ./certs/request.csr | head -n 20').toString();
    console.log(csrInfo);
    
    // Cleanup config file
    fs.unlinkSync('openssl.cnf');
    
    console.log('\nSuccess! Files created:');
    console.log('- ./certs/private.key - KEEP THIS SECURE! Do not share this file.');
    console.log('- ./certs/request.csr - Submit this file to your certificate authority.');
    console.log('\nIMPORTANT: Make a backup of your private key and store it securely.');
  } catch (error) {
    console.error('\nError generating key and CSR:');
    console.error(error.toString());
  }
}

/**
 * Main function
 */
async function main() {
  console.log('=== Certificate Signing Request (CSR) Generator for OV/EV SSL Certificates ===');
  console.log('This tool will generate a CSR for an Organization Validated or Extended Validation certificate.');
  console.log('Please provide the following information (press ENTER to use default values):\n');
  
  // Get information from user
  const info = await promptForInfo();
  
  // Generate OpenSSL config
  generateConfig(info);
  
  // Generate Key and CSR
  generateKeyAndCSR(info);
  
  rl.close();
}

// Run the main function
main();