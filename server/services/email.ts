import sgMail from '@sendgrid/mail';

// Set SendGrid API Key if available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  text?: string;
  html: string;
  attachments?: any[];
}

/**
 * Send email using SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key is not set');
      return false;
    }
    
    await sgMail.send(options);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send newsletter to multiple subscribers
 */
export async function sendNewsletterBatch(
  emails: string[],
  subject: string,
  html: string,
  text?: string,
  from: string = 'info@mpcghana.org'
): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key is not set');
      return false;
    }
    
    // Create personalization array for batch sending
    const personalizations = emails.map(email => ({
      to: email,
      subject: subject,
    }));
    
    // Send to all subscribers
    await sgMail.send({
      personalizations,
      from,
      subject,
      text: text || '',
      html,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send newsletter batch:', error);
    return false;
  }
}