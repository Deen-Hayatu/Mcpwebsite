# AWS SES Domain Verification for mpcghana.org

This guide explains how to verify your domain with AWS SES to enable sending emails from addresses @mpcghana.org.

## Prerequisites

1. An AWS account with access to SES
2. Access to your Namecheap account to add DNS records
3. AWS CLI configured with your credentials (optional but helpful)

## Step 1: Verify Your Domain in AWS SES

1. Log into the [AWS Management Console](https://aws.amazon.com/console/)
2. Navigate to AWS SES (Simple Email Service)
3. In the SES dashboard, click on "Verified identities" in the left navigation
4. Click "Create identity"
5. Select "Domain" as the identity type
6. Enter your domain (mpcghana.org)
7. Enable DKIM (recommended)
8. Click "Create identity"

## Step 2: Add DNS Records to Namecheap

AWS will provide you with several DNS records that need to be added to your domain. Typically, there are:

1. A verification TXT record
2. Three DKIM CNAME records

### Add Verification TXT Record

1. Log in to your Namecheap account
2. Go to Domain List and click "Manage" next to mpcghana.org
3. Select the "Advanced DNS" tab
4. Add a new record with these settings:
   - Type: TXT
   - Host: _amazonses
   - Value: (the verification string provided by AWS)
   - TTL: Automatic

### Add DKIM CNAME Records

For each of the three DKIM records provided by AWS:

1. Add a new record with these settings:
   - Type: CNAME
   - Host: (the hostname provided by AWS, e.g., something like xyz._domainkey)
   - Value: (the value provided by AWS)
   - TTL: Automatic

## Step 3: Add MX Records (Optional, for Receiving Email)

If you want to receive emails with AWS SES:

1. Add a new record with these settings:
   - Type: MX
   - Host: @
   - Value: 10 inbound-smtp.us-east-1.amazonaws.com (replace region as needed)
   - TTL: Automatic

## Step 4: Verify Domain Configuration

1. Return to the AWS SES console
2. Check the status of your domain verification
3. It may take up to 72 hours for verification to complete, but typically it happens within an hour

## Step 5: Move Out of SES Sandbox (For Production Use)

By default, new AWS accounts are placed in the SES sandbox, which allows you to:
- Send emails only to verified email addresses
- Send a limited number of emails per day

To send emails to any recipient:

1. Go to the SES console
2. Click on "Account dashboard"
3. Click on "Request production access"
4. Fill out the form explaining how you'll use email (for the MPC Ghana newsletter, etc.)
5. Submit the request

AWS typically reviews these requests within 24-48 hours.

## Step 6: Configure Email Forwarding (Optional)

If you're using Namecheap's email hosting:

1. In the Namecheap dashboard, go to the "Email" tab for your domain
2. Select your email hosting plan
3. Set up forwarding rules as needed

## Step 7: Test Email Functionality

Once verification is complete and you've moved out of the sandbox (if needed):

1. Log in to your MPC Ghana website
2. Navigate to the Admin interface
3. Use the "Test Email Configuration" feature to send a test email
4. Verify that the email is delivered correctly

## Common DNS Records for AWS SES

Below is an example of what your DNS records might look like. Replace the placeholder values with the actual values provided by AWS:

```
Type    Host                                 Value
----    ----                                 -----
TXT     _amazonses                           verification-code-here
CNAME   abc123def456ghi789._domainkey        abc123def456ghi789.dkim.amazonses.com
CNAME   jkl012mno345pqr678._domainkey        jkl012mno345pqr678.dkim.amazonses.com
CNAME   stu901vwx234yz567._domainkey         stu901vwx234yz567.dkim.amazonses.com
```