# MPC Ghana Website - System Architecture

## Overview

This is a full-stack web application for the Movement for Positive Change (MPC) Ghana, built as a modern research institute and policy think tank website. The application serves as a platform for publishing policy briefs, research papers, hosting events, and engaging with stakeholders through various interactive features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system based on Ghana's national colors
- **Internationalization**: i18next for multi-language support

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with local strategy and session-based auth
- **Security**: Comprehensive security middleware including Helmet, rate limiting, XSS protection, and CSP headers

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless platform
- **ORM**: Drizzle ORM with schema-first approach
- **Database Migrations**: Managed through Drizzle Kit
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Key Components

#### Content Management
- Policy briefs, research papers, and opinion pieces
- Event management and registration system
- Newsletter creation and distribution
- Staff member profiles and organizational structure
- Gallery for photos and media

#### Interactive Features
- AI-powered chatbot using Perplexity API for research assistance
- Contact forms and inquiry management
- Event registration system
- Membership application workflows
- Donation processing with multiple payment gateways

#### Payment Integration
- **Stripe**: International payments and donations
- **PayPal**: Alternative payment method
- **Paystack**: Local African payment processing
- Secure webhook handling for payment confirmation

#### Communication Systems
- **Email Service**: AWS SES for transactional emails and newsletters
- **SendGrid**: Backup email service provider
- Newsletter subscription management with unsubscribe functionality

## Data Flow

1. **Content Creation**: Admin users create policy briefs, events, and other content through secure admin interfaces
2. **Public Access**: Visitors browse research, register for events, and interact with the chatbot
3. **User Engagement**: Subscription to newsletters, event registrations, and contact form submissions
4. **Payment Processing**: Secure donation flow through multiple payment providers
5. **Email Communications**: Automated confirmations, newsletters, and notifications via AWS SES

## External Dependencies

### Core Services
- **Neon Database**: PostgreSQL hosting with serverless capabilities
- **Perplexity AI**: Advanced AI chat completion for research assistance
- **AWS SES**: Email delivery service for transactional and marketing emails

### Payment Gateways
- **Stripe**: Primary payment processor for international transactions
- **PayPal**: Secondary payment option
- **Paystack**: African-focused payment gateway for local transactions

### Development & Deployment
- **Vercel**: Primary hosting platform with serverless functions
- **Google Search Console**: SEO and search visibility management
- Domain management through Namecheap with custom DNS configuration

## Deployment Strategy

### Production Environment
- **Platform**: Replit Deployments with autoscale configuration
- **Domain**: Currently deployed on Replit app domain (mpcghana.replit.app)
- **CDN**: Replit's global CDN for static assets
- **Serverless Functions**: Express.js API routes

### Security Implementation
- Organization Validated (OV) SSL certificates for enhanced trust
- Comprehensive Content Security Policy (CSP)
- Rate limiting and DDoS protection
- Input sanitization and validation
- Session security with secure cookies
- Audit logging for security events

### SEO & Performance
- Dynamic sitemap generation
- Robots.txt configuration
- Meta tag optimization
- Image optimization with WebP format
- Lazy loading for improved performance
- Google Search Console integration

## Changelog
```
Changelog:
- June 28, 2025. Initial setup
- July 6, 2025. Successfully deployed to Replit with domain redirect fixes
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```