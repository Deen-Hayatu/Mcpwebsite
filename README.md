# Mcpwebsite

A full-stack web application for the MCP website.

## Tech Stack

*   **Frontend:** React, Vite, TypeScript, Wouter, Tailwind CSS, Shadcn UI
*   **Backend:** Express.js, TypeScript, Node.js
*   **Database:** Neon (Serverless Postgres), Drizzle ORM
*   **Authentication:** Passport.js
*   **Deployment:** (Specify deployment details if applicable)

## Getting Started

### Prerequisites

*   Node.js (v20.x or later recommended)
*   npm or yarn
*   Access to a Neon database instance

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd Mcpwebsite
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Create a `.env` file in the root directory by copying `.env.example` (if it exists) or creating it from scratch. Populate it with the necessary environment variables.

### Running the Application

*   **Development:**
    ```bash
    npm run dev
    ```
    This starts the Vite development server for the frontend and the Express server (using `tsx`) with hot-reloading. The application will be available at `http://localhost:5000`.

*   **Production Build:**
    ```bash
    npm run build
    npm run start
    ```
    This first builds the frontend and backend assets, then starts the production server.

## Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the frontend and backend for production.
*   `npm run start`: Starts the production server (requires a prior build).
*   `npm run check`: Runs the TypeScript compiler to check for type errors.
*   `npm run db:push`: Pushes database schema changes using Drizzle Kit.

## Environment Variables

Create a `.env` file in the project root and add the following variables:

```env
# Neon Database Connection String
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Authentication Secrets (replace with actual secrets)
SESSION_SECRET="your-session-secret"

# Email Service (e.g., AWS SES, Mailgun - configure as needed)
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
# AWS_REGION=...
# MAILGUN_API_KEY=...
# MAILGUN_DOMAIN=...

# Other necessary variables...
# PAYPAL_CLIENT_ID=...
# PAYPAL_CLIENT_SECRET=...
# STRIPE_SECRET_KEY=...
# STRIPE_PUBLISHABLE_KEY=...
```
*(Note: Add/remove variables based on the actual requirements)*

## Database

This project uses [Neon](https://neon.tech/) as the PostgreSQL database provider and [Drizzle ORM](https://orm.drizzle.team/) for database interactions.

*   Schema definitions are located in `shared/schema.ts`.
*   To apply schema changes to your database, run `npm run db:push`. Make sure your `DATABASE_URL` in `.env` is correctly configured.
