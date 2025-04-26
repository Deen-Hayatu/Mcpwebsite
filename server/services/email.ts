import { Subscriber, Newsletter } from '../types';
import * as mailgunService from './mailgun';
import * as awsSesService from './aws-ses';

// This service acts as a facade for different email providers
// We can easily switch between providers or add more in the future

const DEFAULT_PROVIDER = 'aws-ses'; // Changed default to AWS SES as requested

/**
 * Get the configured email provider service
 */
function getProvider(): any {
  const provider = process.env.EMAIL_PROVIDER || DEFAULT_PROVIDER;
  
  switch (provider.toLowerCase()) {
    case 'aws-ses':
      return awsSesService;
    case 'mailgun':
      return mailgunService;
    case 'sendgrid':
      // We could import SendGrid service here if it becomes available
      console.warn('SendGrid provider selected but not available. Falling back to AWS SES.');
      return awsSesService;
    default:
      console.warn(`Unknown email provider: ${provider}. Falling back to AWS SES.`);
      return awsSesService;
  }
}

/**
 * Check if email service is configured
 */
export function isConfigured(): boolean {
  return getProvider().isConfigured();
}

/**
 * Send a welcome email to a new subscriber
 */
export async function sendWelcomeEmail(
  subscriber: { email: string; name?: string }
): Promise<boolean> {
  return getProvider().sendWelcomeEmail(subscriber);
}

/**
 * Send an email confirming unsubscription
 */
export async function sendUnsubscribeConfirmation(
  subscriber: { email: string; name?: string }
): Promise<boolean> {
  return getProvider().sendUnsubscribeConfirmation(subscriber);
}

/**
 * Send a newsletter to a list of subscribers
 */
export async function sendNewsletter(
  newsletter: Newsletter,
  subscribers: Subscriber[],
  testMode: boolean = false
): Promise<{ success: boolean; sentCount: number; errors: any[] }> {
  return getProvider().sendNewsletter(newsletter, subscribers, testMode);
}

/**
 * Helper function to send a newsletter using a batch of email addresses
 */
export async function sendNewsletterBatch(
  emails: string[],
  subject: string,
  htmlContent: string,
  textContent: string,
  fromName?: string
): Promise<boolean> {
  if (!isConfigured()) {
    console.error('Email service is not configured. Cannot send newsletter batch.');
    return false;
  }
  
  try {
    // For now, we'll implement a simple batch send without personalization
    const provider = getProvider();
    
    if (provider.sendEmail) {
      return await provider.sendEmail({
        to: emails,
        subject,
        html: htmlContent,
        text: textContent,
        fromName,
      });
    } else {
      console.error('The selected email provider does not support sendEmail function');
      return false;
    }
  } catch (error) {
    console.error('Error sending newsletter batch:', error);
    return false;
  }
}

/**
 * Send a test email to verify email configuration
 */
export async function sendTestEmail(recipient: string): Promise<boolean> {
  return getProvider().sendTestEmail(recipient);
}