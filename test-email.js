/*
 * Simple AWS SES Email Test Script
 * This script bypasses the web interface and directly tests the AWS SES configuration
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// AWS SES Configuration
// Standard AWS region codes must be used
// Let's hardcode to us-east-1 as that's the most common SES region
const AWS_REGION = 'us-east-1';
console.log(`Using AWS region: ${AWS_REGION}`);
// Note: Original region setting was: ${process.env.AWS_REGION}
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_VERIFIED_EMAIL = process.env.AWS_VERIFIED_EMAIL;

// Check environment variables
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_VERIFIED_EMAIL) {
  console.error('Missing required AWS credentials:');
  console.error(`  AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID ? 'Set' : 'Missing'}`);
  console.error(`  AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY ? 'Set' : 'Missing'}`);
  console.error(`  AWS_REGION: ${AWS_REGION ? 'Set' : 'Missing'}`);
  console.error(`  AWS_VERIFIED_EMAIL: ${AWS_VERIFIED_EMAIL ? 'Set' : 'Missing'}`);
  process.exit(1);
}

// In SES sandbox mode, we must send to a verified email address
// For testing, we'll use the verified sender email as the recipient as well
const recipientEmail = AWS_VERIFIED_EMAIL;
console.log(`Using verified email address for testing: ${recipientEmail}`);
// Note: In production, we would need to verify all recipient domains or
// request to be moved out of the SES sandbox

// Create SES client
const sesClient = new SESClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
});

async function sendTestEmail() {
  try {
    console.log(`Sending test email to: ${recipientEmail}`);
    console.log(`From: ${AWS_VERIFIED_EMAIL}`);
    
    const timestamp = new Date().toISOString();
    const command = new SendEmailCommand({
      Source: AWS_VERIFIED_EMAIL,
      Destination: {
        ToAddresses: [recipientEmail],
      },
      Message: {
        Subject: {
          Data: 'MPC Ghana - Test Email',
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: `
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; }
                  .header { background-color: #CE1126; color: white; padding: 20px; }
                  .content { padding: 20px; }
                  .footer { background-color: #006B3F; color: white; padding: 10px; }
                </style>
              </head>
              <body>
                <div class="header">
                  <h2>Movement for Positive Change</h2>
                </div>
                <div class="content">
                  <h3>Test Email</h3>
                  <p>This is a direct test email from the MPC Ghana AWS SES configuration.</p>
                  <p>Time sent: ${timestamp}</p>
                </div>
                <div class="footer">
                  <p>MPC Ghana &copy; ${new Date().getFullYear()}</p>
                </div>
              </body>
              </html>
            `,
            Charset: 'UTF-8',
          },
          Text: {
            Data: `MPC Ghana Test Email

This is a direct test email from the MPC Ghana AWS SES configuration.
Time sent: ${timestamp}`,
            Charset: 'UTF-8',
          },
        },
      },
    });

    const response = await sesClient.send(command);
    console.log('Email sent successfully!');
    console.log(`MessageId: ${response.MessageId}`);
    return true;
  } catch (error) {
    console.error('Error sending email:');
    console.error(error);
    return false;
  }
}

// Execute the test
sendTestEmail()
  .then(success => {
    if (success) {
      console.log('AWS SES test completed successfully.');
      process.exit(0);
    } else {
      console.error('AWS SES test failed.');
      process.exit(1);
    }
  });
