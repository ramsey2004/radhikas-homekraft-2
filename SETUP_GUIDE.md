# 📖 Setup Guide - Radhika's Homecraft E-commerce Platform

This comprehensive guide will walk you through setting up the complete e-commerce platform locally and for production.

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Database Setup](#database-setup)
3. [Payment Gateway Integration](#payment-gateway-integration)
4. [Email Configuration](#email-configuration)
5. [OAuth Setup](#oauth-setup)
6. [File Upload Configuration](#file-upload-configuration)
7. [Development Workflow](#development-workflow)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 12+ ([Download](https://www.postgresql.org/download/))
- Git
- Code editor (VS Code recommended)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd radhikas-homecraft
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs all required packages defined in `package.json`.

### Step 3: Environment Variables
```bash
cp .env.example .env.local
```

Open `.env.local` and fill in all required variables (see [Environment Variables Reference](#environment-variables-reference)).

### Step 4: Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Setup

### PostgreSQL Installation

#### macOS (Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Windows
Download and run installer from [postgresql.org](https://www.postgresql.org/download/windows/)

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE radhikas_homecraft;

# Create user
CREATE USER radhika WITH PASSWORD 'your_secure_password';

# Grant privileges
ALTER ROLE radhika WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE radhikas_homecraft TO radhika;

# Exit
\q
```

### Connection String
Add to `.env.local`:
```
DATABASE_URL="postgresql://radhika:your_secure_password@localhost:5432/radhikas_homecraft"
```

### Apply Migrations

```bash
# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

Open Prisma Studio to view your data:
```bash
npm run db:studio
```

---

## Payment Gateway Integration

### Razorpay Setup (Primary for India)

1. **Create Account:**
   - Visit [razorpay.com](https://razorpay.com)
   - Sign up for an account
   - Complete KYC verification

2. **Get API Keys:**
   - Go to Settings → API Keys
   - Copy Key ID and Key Secret

3. **Configure Environment:**
   ```
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```

4. **Key Features:**
   - UPI payments (recommended for Indian users)
   - Card payments (Debit/Credit)
   - Net Banking
   - Digital Wallets (Google Pay, PhonePe, etc.)

### Stripe Setup (International)

1. **Create Account:**
   - Visit [stripe.com](https://stripe.com)
   - Sign up for an account

2. **Get API Keys:**
   - Go to Developers → API Keys
   - Copy Publishable Key and Secret Key

3. **Configure Environment:**
   ```
   STRIPE_PUBLIC_KEY=pk_live_xxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

4. **Setting up Webhooks:**
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: payment_intent.succeeded, charge.refunded

---

## Email Configuration

### Option 1: Resend (Recommended)

1. **Create Account:**
   - Visit [resend.com](https://resend.com)
   - Sign up and verify email

2. **Get API Key:**
   - Go to API Keys section
   - Create new API key

3. **Configure Environment:**
   ```
   RESEND_API_KEY=re_xxxxx
   ```

### Option 2: SMTP (Gmail)

1. **Enable 2-Factor Authentication:**
   - Go to Google Account → Security
   - Enable 2-Step Verification

2. **Create App Password:**
   - Go to Security → App Passwords
   - Select Mail and Windows Computer
   - Copy the generated password

3. **Configure Environment:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM="Radhika's Homecraft <noreply@radhikashomecraft.com>"
   ```

### Option 3: SendGrid

1. **Create Account:**
   - Visit [sendgrid.com](https://sendgrid.com)
   - Sign up for account

2. **Get API Key:**
   - Go to Settings → API Keys
   - Create new API key

3. **Configure Environment:**
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=SG.xxxxx
   SMTP_FROM="Radhika's Homecraft <noreply@radhikashomecraft.com>"
   ```

---

## OAuth Setup

### Google OAuth

1. **Create Google Cloud Project:**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Create new project (name: "Radhika's Homecraft")

2. **Configure OAuth Consent Screen:**
   - Select External user type
   - Fill in required information
   - Add `email, profile` scopes

3. **Create OAuth Credentials:**
   - Go to Credentials → Create Credentials → OAuth Client ID
   - Select Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://yourdomain.com/api/auth/callback/google`

4. **Configure Environment:**
   ```
   GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=xxxxx
   ```

### Facebook OAuth (Optional)

1. **Create Facebook App:**
   - Visit [developers.facebook.com](https://developers.facebook.com)
   - Create new app

2. **Configure App:**
   - Add Facebook Login product
   - Configure OAuth Redirect URIs:
     - `http://localhost:3000/api/auth/callback/facebook`
     - `https://yourdomain.com/api/auth/callback/facebook`

3. **Configure Environment:**
   ```
   FACEBOOK_APP_ID=xxxxx
   FACEBOOK_APP_SECRET=xxxxx
   ```

---

## File Upload Configuration

### Cloudinary Setup

1. **Create Account:**
   - Visit [cloudinary.com](https://cloudinary.com)
   - Sign up for free account

2. **Get Credentials:**
   - Go to Dashboard
   - Copy Cloud Name, API Key, API Secret

3. **Configure Environment:**
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=xxxxx
   CLOUDINARY_API_SECRET=xxxxx
   ```

### AWS S3 (Alternative)

1. **Create S3 Bucket:**
   - Go to AWS Console
   - Create new S3 bucket
   - Allow public read access

2. **Create IAM User:**
   - Create user with S3 full access
   - Generate access keys

3. **Configure Environment:**
   ```
   AWS_ACCESS_KEY_ID=xxxxx
   AWS_SECRET_ACCESS_KEY=xxxxx
   AWS_S3_BUCKET_NAME=radhikas-homecraft
   ```

---

## Development Workflow

### Available Commands

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types

# Database
npm run db:push      # Push Prisma schema
npm run db:migrate   # Create new migration
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio (GUI)

# Testing (when configured)
npm run test         # Run tests
npm run test:watch   # Watch mode
```

### Code Structure Best Practices

1. **Components**: Keep components small and reusable
2. **API Routes**: One file per endpoint
3. **Utilities**: Extract common logic to `lib/` folder
4. **Types**: Define types in `types/` folder
5. **Hooks**: Create custom hooks in `hooks/` folder

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add feature description"

# Push to remote
git push origin feature/feature-name

# Open Pull Request on GitHub
```

---

## Deployment

### Vercel (Recommended)

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import repository

2. **Configure Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`

3. **Deploy:**
   - Vercel automatically deploys when you push to main
   - Preview deployments for pull requests

4. **Database:**
   - Use Vercel Postgres or AWS RDS
   - Connection string in Vercel environment

### Railway

1. **Sign Up:**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create Project:**
   - New Project → Deploy from GitHub
   - Select repository

3. **Add PostgreSQL:**
   - Add PostgreSQL service
   - Connect to Next.js service

4. **Deploy:**
   - Railway automatically deploys
   - View logs in dashboard

### Render.com

1. **Sign Up:**
   - Visit [render.com](https://render.com)
   
2. **Create Service:**
   - New Web Service from GitHub
   - Configure environment variables
   - Deploy

3. **Database:**
   - Create PostgreSQL database
   - Link to web service

### Custom Server (AWS/DigitalOcean)

```bash
# Build production bundle
npm run build

# Start production server
npm run start

# Use PM2 for process management
npm install -g pm2
pm2 start "npm start" --name "radhikas-homecraft"
pm2 save
```

---

## Troubleshooting

### Database Connection Issues

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Check PostgreSQL is running
brew services list                    # macOS
sudo systemctl status postgresql      # Linux

# Verify connection string
echo $DATABASE_URL

# Test connection
psql -U user -d database_name -c "SELECT 1"
```

### NextAuth Issues

**Problem:** `[next-auth]: Signin error: Callback URL`

**Solution:**
1. Check `NEXTAUTH_URL` matches your domain
2. Verify OAuth callback URLs are configured
3. Check `NEXTAUTH_SECRET` is set

### Prisma Issues

**Problem:** `Error: ENOENT: no such file or directory`

**Solution:**
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (development only)
npx prisma migrate reset
```

### Email Not Sending

**Problem:** Emails not received

**Solution:**
1. Check SMTP credentials in `.env.local`
2. Verify email service is configured
3. Check spam folder
4. View email logs in service dashboard

---

## Performance Optimization Tips

1. **Images:**
   - Use WebP format
   - Compress images before upload
   - Use responsive images

2. **Database:**
   - Add indexes to frequently queried columns
   - Use pagination for large datasets
   - Cache commonly accessed data

3. **API:**
   - Implement rate limiting
   - Cache API responses
   - Use ISR for static pages

4. **Frontend:**
   - Code splitting with dynamic imports
   - Lazy load components below fold
   - Minify CSS/JS in production

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS on production
- [ ] Set CSRF tokens on forms
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set secure cookies
- [ ] Keep dependencies updated
- [ ] Regular security audits

---

## Next Steps

After setup:
1. Customize branding and colors
2. Upload product images
3. Configure shipping settings
4. Set up email templates
5. Test payment flow
6. Set up analytics
7. Configure CDN
8. Set up SSL certificate

For issues or questions, visit our [GitHub Issues](https://github.com/radhikashomecraft/issues)

---

**Last Updated:** February 8, 2026
**Version:** 1.0.0
