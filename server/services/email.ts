import sgMail from '@sendgrid/mail';
import { Newsletter, Subscriber } from '../types';

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  console.warn('WARNING: SENDGRID_API_KEY is not set. Email functionality will not work.');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const ORGANIZATION_NAME = 'Movement for Positive Change';
const DEFAULT_FROM_EMAIL = 'info@mpcghana.org';

/**
 * Send a newsletter to a list of subscribers
 */
export async function sendNewsletter(
  newsletter: Newsletter,
  subscribers: Subscriber[],
  testMode: boolean = false
): Promise<{ success: boolean; sentCount: number; errors: any[] }> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not set. Cannot send newsletter.');
    return { 
      success: false, 
      sentCount: 0, 
      errors: ['SENDGRID_API_KEY is not set'] 
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
    // Set up the base email message
    const baseMsg = {
      from: {
        email: DEFAULT_FROM_EMAIL,
        name: newsletter.authorName || ORGANIZATION_NAME,
      },
      subject: newsletter.subject,
      html: newsletter.htmlContent,
      text: newsletter.content,
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true },
      },
    };

    // For small batches, send individually to personalize
    if (recipientList.length <= 50) {
      for (const subscriber of recipientList) {
        try {
          await sgMail.send({
            ...baseMsg,
            to: {
              email: subscriber.email,
              name: subscriber.name || '',
            },
            personalizations: [
              {
                to: [{ email: subscriber.email, name: subscriber.name || '' }],
                substitutions: {
                  '%recipient_name%': subscriber.name || 'Valued Subscriber',
                  '%unsubscribe_url%': `https://mpcghana.org/newsletter?tab=unsubscribe&email=${encodeURIComponent(subscriber.email)}`,
                },
              },
            ],
          });
          sentCount++;
        } catch (err) {
          console.error(`Error sending to ${subscriber.email}:`, err);
          errors.push({ email: subscriber.email, error: err });
        }
      }
    } 
    // For larger batches, use SendGrid's batch sending capability
    else {
      const personalizationsList = recipientList.map(subscriber => ({
        to: [{ email: subscriber.email, name: subscriber.name || '' }],
        substitutions: {
          '%recipient_name%': subscriber.name || 'Valued Subscriber',
          '%unsubscribe_url%': `https://mpcghana.org/newsletter?tab=unsubscribe&email=${encodeURIComponent(subscriber.email)}`,
        },
      }));

      // SendGrid has a limit of 1000 recipients per API call
      const BATCH_SIZE = 1000;
      
      for (let i = 0; i < personalizationsList.length; i += BATCH_SIZE) {
        const batch = personalizationsList.slice(i, i + BATCH_SIZE);
        
        try {
          await sgMail.send({
            ...baseMsg,
            to: DEFAULT_FROM_EMAIL, // Required but will be overridden by personalizations
            personalizations: batch,
          });
          sentCount += batch.length;
        } catch (err) {
          console.error(`Error sending batch ${i/BATCH_SIZE + 1}:`, err);
          errors.push({ batch: i/BATCH_SIZE + 1, error: err });
        }
      }
    }

    return {
      success: sentCount > 0,
      sentCount,
      errors,
    };
  } catch (err) {
    console.error('Error in sendNewsletter:', err);
    return {
      success: false,
      sentCount,
      errors: [...errors, err],
    };
  }
}

/**
 * Send a welcome email to a new subscriber
 */
export async function sendWelcomeEmail(
  subscriber: { email: string; name?: string }
): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not set. Cannot send welcome email.');
    return false;
  }

  try {
    const msg = {
      to: subscriber.email,
      from: {
        email: DEFAULT_FROM_EMAIL,
        name: ORGANIZATION_NAME,
      },
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
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

/**
 * Send an email confirming unsubscription
 */
export async function sendUnsubscribeConfirmation(
  subscriber: { email: string; name?: string }
): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not set. Cannot send unsubscribe confirmation.');
    return false;
  }

  try {
    const msg = {
      to: subscriber.email,
      from: {
        email: DEFAULT_FROM_EMAIL,
        name: ORGANIZATION_NAME,
      },
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
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Error sending unsubscribe confirmation:', error);
    return false;
  }
}

/**
 * Send a test email to verify SendGrid configuration
 */
export async function sendTestEmail(recipient: string): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not set. Cannot send test email.');
    return false;
  }

  try {
    const msg = {
      to: recipient,
      from: {
        email: DEFAULT_FROM_EMAIL,
        name: ORGANIZATION_NAME,
      },
      subject: 'SendGrid Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>SendGrid Test Email</h1>
          <p>This is a test email from the Movement for Positive Change website.</p>
          <p>If you receive this email, your SendGrid configuration is working correctly.</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        </div>
      `,
      text: `
SendGrid Test Email

This is a test email from the Movement for Positive Change website.
If you receive this email, your SendGrid configuration is working correctly.

Time sent: ${new Date().toISOString()}
      `,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    return false;
  }
}