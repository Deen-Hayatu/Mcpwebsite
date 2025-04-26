import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandOutput
} from '@aws-sdk/client-ses';
import { Subscriber, Newsletter } from '../types';

// AWS SES Configuration
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const ORGANIZATION_NAME = 'Movement for Positive Change';
const DEFAULT_FROM_EMAIL = 'info@mpcghana.org';

// Create SES client
let sesClient: SESClient | null = null;

/**
 * Initialize the SES client with credentials
 */
function getSESClient(): SESClient {
  if (!sesClient) {
    sesClient = new SESClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!
      }
    });
  }
  return sesClient;
}

/**
 * Check if AWS SES configuration is valid
 */
export function isConfigured(): boolean {
  return !!AWS_ACCESS_KEY_ID && !!AWS_SECRET_ACCESS_KEY;
}

/**
 * Send an email using AWS SES
 */
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from?: string;
  fromName?: string;
}): Promise<boolean> {
  if (!isConfigured()) {
    console.error('AWS SES is not configured. Cannot send email.');
    return false;
  }

  const { to, subject, html, text, from, fromName } = options;
  const fromAddress = from || DEFAULT_FROM_EMAIL;
  const fromHeader = fromName 
    ? `${fromName} <${fromAddress}>`
    : fromAddress;

  try {
    // Handle single recipient vs multiple recipients
    if (Array.isArray(to) && to.length > 1) {
      // For multiple recipients, use bulk email
      return await sendBulkEmail(to, subject, html, text, fromHeader);
    } else {
      // For a single recipient, use standard send
      const singleRecipient = Array.isArray(to) ? to[0] : to;
      const client = getSESClient();
      
      const command = new SendEmailCommand({
        Source: fromHeader,
        Destination: {
          ToAddresses: [singleRecipient],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
            Text: {
              Data: text,
              Charset: 'UTF-8',
            },
          },
        },
      });

      const response = await client.send(command);
      return !!response.MessageId;
    }
  } catch (error) {
    console.error('Error sending email with AWS SES:', error);
    return false;
  }
}

/**
 * Send bulk emails to multiple recipients
 */
async function sendBulkEmail(
  recipients: string[],
  subject: string,
  html: string,
  text: string,
  from: string
): Promise<boolean> {
  try {
    // Since AWS SES doesn't have a batch send in the current SDK version,
    // we'll send individual emails but with BCC for efficiency
    const client = getSESClient();
    
    // Split recipients into batches of 50 (AWS SES limit)
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < recipients.length; i += batchSize) {
      batches.push(recipients.slice(i, i + batchSize));
    }
    
    // Send each batch
    let allSuccessful = true;
    for (const batchRecipients of batches) {
      const command = new SendEmailCommand({
        Source: from,
        Destination: {
          ToAddresses: [from], // Send to ourselves
          BccAddresses: batchRecipients, // BCC all recipients
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
            Text: {
              Data: text,
              Charset: 'UTF-8',
            },
          },
        },
      });
      
      const response = await client.send(command);
      if (!response.MessageId) {
        allSuccessful = false;
      }
    }
    
    return allSuccessful;
  } catch (error) {
    console.error('Error sending bulk email with AWS SES:', error);
    return false;
  }
}

/**
 * Send a welcome email to a new subscriber
 */
export async function sendWelcomeEmail(
  subscriber: { email: string; name?: string }
): Promise<boolean> {
  return sendEmail({
    to: subscriber.email,
    subject: 'Welcome to the Movement for Positive Change Newsletter',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MPC Newsletter</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #CE1126;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .button {
            display: inline-block;
            background-color: #006B3F;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .ghana-colors {
            height: 10px;
            display: flex;
          }
          .ghana-red {
            background-color: #CE1126;
            flex: 1;
          }
          .ghana-yellow {
            background-color: #FCD116;
            flex: 1;
          }
          .ghana-green {
            background-color: #006B3F;
            flex: 1;
          }
        </style>
      </head>
      <body>
        <div class="ghana-colors">
          <div class="ghana-red"></div>
          <div class="ghana-yellow"></div>
          <div class="ghana-green"></div>
        </div>
        
        <div class="header">
          <h1>Welcome to Our Newsletter</h1>
        </div>
        
        <div class="content">
          <p>Dear ${subscriber.name || 'Friend'},</p>
          
          <p>Thank you for subscribing to the Movement for Positive Change newsletter. We're thrilled to have you join our community of individuals dedicated to advancing Ghana's development through research and policy.</p>
          
          <p>As a subscriber, you'll receive:</p>
          <ul>
            <li>Monthly updates on our latest research and policy briefs</li>
            <li>Invitations to events and programs across Ghana</li>
            <li>Insights from our team of experts on pressing issues</li>
          </ul>
          
          <p>We look forward to sharing our work with you and hearing your feedback.</p>
          
          <a href="https://mpcghana.org" class="button">Visit Our Website</a>
          
          <p>Warm regards,<br>
          The Movement for Positive Change Team</p>
        </div>
        
        <div class="footer">
          <p>This email was sent to ${subscriber.email}</p>
          <p>You received this email because you subscribed to the Movement for Positive Change newsletter.</p>
          <p>To unsubscribe, <a href="https://mpcghana.org/newsletter?tab=unsubscribe&email=${encodeURIComponent(subscriber.email)}">click here</a>.</p>
        </div>
      </body>
      </html>
    `,
    text: `
Dear ${subscriber.name || 'Friend'},

Thank you for subscribing to the Movement for Positive Change newsletter. We're thrilled to have you join our community of individuals dedicated to advancing Ghana's development through research and policy.

As a subscriber, you'll receive:
- Monthly updates on our latest research and policy briefs
- Invitations to events and programs across Ghana
- Insights from our team of experts on pressing issues

We look forward to sharing our work with you and hearing your feedback.

Visit Our Website: https://mpcghana.org

Warm regards,
The Movement for Positive Change Team

---
This email was sent to ${subscriber.email}
You received this email because you subscribed to the Movement for Positive Change newsletter.
To unsubscribe, visit: https://mpcghana.org/newsletter?tab=unsubscribe&email=${encodeURIComponent(subscriber.email)}
    `,
    fromName: ORGANIZATION_NAME,
  });
}

/**
 * Send an email confirming unsubscription
 */
export async function sendUnsubscribeConfirmation(
  subscriber: { email: string; name?: string }
): Promise<boolean> {
  return sendEmail({
    to: subscriber.email,
    subject: 'You have unsubscribed from the MPC Newsletter',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribe Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #666;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .button {
            display: inline-block;
            background-color: #006B3F;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .ghana-colors {
            height: 10px;
            display: flex;
          }
          .ghana-red {
            background-color: #CE1126;
            flex: 1;
          }
          .ghana-yellow {
            background-color: #FCD116;
            flex: 1;
          }
          .ghana-green {
            background-color: #006B3F;
            flex: 1;
          }
        </style>
      </head>
      <body>
        <div class="ghana-colors">
          <div class="ghana-red"></div>
          <div class="ghana-yellow"></div>
          <div class="ghana-green"></div>
        </div>
        
        <div class="header">
          <h1>Unsubscribe Confirmation</h1>
        </div>
        
        <div class="content">
          <p>Dear ${subscriber.name || 'Friend'},</p>
          
          <p>We're sorry to see you go. You have been successfully unsubscribed from the Movement for Positive Change newsletter.</p>
          
          <p>If you unsubscribed by mistake or change your mind, you can always resubscribe at any time by visiting our website.</p>
          
          <a href="https://mpcghana.org/newsletter" class="button">Resubscribe</a>
          
          <p>Thank you for your past interest in our work. We wish you all the best.</p>
          
          <p>Regards,<br>
          The Movement for Positive Change Team</p>
        </div>
        
        <div class="footer">
          <p>This email was sent to ${subscriber.email}</p>
          <p>You received this email because you recently unsubscribed from the Movement for Positive Change newsletter.</p>
        </div>
      </body>
      </html>
    `,
    text: `
Dear ${subscriber.name || 'Friend'},

We're sorry to see you go. You have been successfully unsubscribed from the Movement for Positive Change newsletter.

If you unsubscribed by mistake or change your mind, you can always resubscribe at any time by visiting our website:
https://mpcghana.org/newsletter

Thank you for your past interest in our work. We wish you all the best.

Regards,
The Movement for Positive Change Team

---
This email was sent to ${subscriber.email}
You received this email because you recently unsubscribed from the Movement for Positive Change newsletter.
    `,
    fromName: ORGANIZATION_NAME,
  });
}

/**
 * Send a newsletter to a list of subscribers
 */
export async function sendNewsletter(
  newsletter: Newsletter,
  subscribers: Subscriber[],
  testMode: boolean = false
): Promise<{ success: boolean; sentCount: number; errors: any[] }> {
  if (!isConfigured()) {
    console.error('AWS SES is not configured. Cannot send newsletter.');
    return { 
      success: false, 
      sentCount: 0, 
      errors: ['AWS SES is not configured'] 
    };
  }

  // Filter only active subscribers
  const activeSubscribers = subscribers.filter(sub => sub.subscribed);
  
  if (activeSubscribers.length === 0) {
    console.warn('No active subscribers to send newsletter to.');
    return { success: true, sentCount: 0, errors: [] };
  }

  // If in test mode, only send to the first subscriber
  const recipientList = testMode ? activeSubscribers.slice(0, 1) : activeSubscribers;
  
  const errors: any[] = [];
  let sentCount = 0;

  try {
    // For small batches or individual emails, send them one by one
    if (recipientList.length <= 1) {
      for (const subscriber of recipientList) {
        try {
          const personalized = {
            to: subscriber.email,
            subject: newsletter.subject,
            html: newsletter.htmlContent.replace(/%recipient_name%/g, subscriber.name || 'Valued Subscriber'),
            text: newsletter.content.replace(/%recipient_name%/g, subscriber.name || 'Valued Subscriber'),
            fromName: newsletter.authorName || ORGANIZATION_NAME,
          };

          const success = await sendEmail(personalized);
          
          if (success) {
            sentCount++;
          } else {
            errors.push({ email: subscriber.email, error: 'Failed to send email' });
          }
        } catch (err) {
          console.error(`Error sending to ${subscriber.email}:`, err);
          errors.push({ email: subscriber.email, error: err });
        }
      }
    }
    // For larger batches, use bulk email sending
    else {
      const recipientEmails = recipientList.map(sub => sub.email);
      const success = await sendEmail({
        to: recipientEmails,
        subject: newsletter.subject,
        html: newsletter.htmlContent,
        text: newsletter.content,
        fromName: newsletter.authorName || ORGANIZATION_NAME,
      });

      if (success) {
        sentCount = recipientEmails.length;
      } else {
        errors.push({ error: 'Failed to send bulk email' });
      }
    }

    return {
      success: sentCount > 0,
      sentCount,
      errors,
    };
  } catch (error) {
    console.error('Error sending newsletter with AWS SES:', error);
    return {
      success: false,
      sentCount,
      errors: [...errors, error],
    };
  }
}

/**
 * Send a test email to verify AWS SES configuration
 */
export async function sendTestEmail(recipient: string): Promise<boolean> {
  return sendEmail({
    to: recipient,
    subject: 'AWS SES Test Email',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>AWS SES Test Email</h1>
        <p>This is a test email from the Movement for Positive Change website.</p>
        <p>If you receive this email, your AWS SES configuration is working correctly.</p>
        <p>Time sent: ${new Date().toISOString()}</p>
      </div>
    `,
    text: `
AWS SES Test Email

This is a test email from the Movement for Positive Change website.
If you receive this email, your AWS SES configuration is working correctly.

Time sent: ${new Date().toISOString()}
    `,
    fromName: ORGANIZATION_NAME,
  });
}