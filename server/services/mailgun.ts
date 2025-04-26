import fetch from 'node-fetch';
import { Subscriber, Newsletter } from '../types';

// Mailgun configuration
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'mpcghana.org';
const MAILGUN_BASE_URL = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}`;

const ORGANIZATION_NAME = 'Movement for Positive Change';
const DEFAULT_FROM_EMAIL = 'info@mpcghana.org';

/**
 * Check if Mailgun configuration is valid
 */
export function isConfigured(): boolean {
  return !!MAILGUN_API_KEY && !!MAILGUN_DOMAIN;
}

/**
 * Send an email using Mailgun
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
    console.error('Mailgun is not configured. Cannot send email.');
    return false;
  }

  const { to, subject, html, text, from, fromName } = options;
  const fromAddress = from || DEFAULT_FROM_EMAIL;
  const fromHeader = fromName 
    ? `${fromName} <${fromAddress}>`
    : fromAddress;

  try {
    const formData = new URLSearchParams();
    formData.append('from', fromHeader);
    
    // Handle array of recipients or single recipient
    if (Array.isArray(to)) {
      to.forEach(recipient => formData.append('to', recipient));
    } else {
      formData.append('to', to);
    }
    
    formData.append('subject', subject);
    formData.append('html', html);
    formData.append('text', text);

    const response = await fetch(`${MAILGUN_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Mailgun API error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email with Mailgun:', error);
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
    console.error('Mailgun is not configured. Cannot send newsletter.');
    return { 
      success: false, 
      sentCount: 0, 
      errors: ['Mailgun is not configured'] 
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

  // For small batches, send individually to personalize
  // For Mailgun, we can use recipient variables for personalization in batch sends
  // However, for simplicity, we'll send individually
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

  return {
    success: sentCount > 0,
    sentCount,
    errors,
  };
}

/**
 * Send a test email to verify Mailgun configuration
 */
export async function sendTestEmail(recipient: string): Promise<boolean> {
  return sendEmail({
    to: recipient,
    subject: 'Mailgun Test Email',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Mailgun Test Email</h1>
        <p>This is a test email from the Movement for Positive Change website.</p>
        <p>If you receive this email, your Mailgun configuration is working correctly.</p>
        <p>Time sent: ${new Date().toISOString()}</p>
      </div>
    `,
    text: `
Mailgun Test Email

This is a test email from the Movement for Positive Change website.
If you receive this email, your Mailgun configuration is working correctly.

Time sent: ${new Date().toISOString()}
    `,
    fromName: ORGANIZATION_NAME,
  });
}