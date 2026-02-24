# Environment Variables Configuration

## Required for Production

### Database
```env
DATABASE_URL="postgresql://user:password@localhost:5432/radhikas_homecraft"
```

### Authentication (NextAuth)
```env
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
```

### OAuth Providers
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### Payment Gateways

#### Razorpay (Primary - India)
```env
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"
```

#### Stripe (Optional - International)
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Shipping Integration

#### Shiprocket
```env
SHIPROCKET_EMAIL="your-shiprocket-email@example.com"
SHIPROCKET_PASSWORD="your-shiprocket-password"
```

#### Delhivery (Alternative)
```env
DELHIVERY_API_KEY="your-delhivery-api-key"
```

### Email Service (SMTP)
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"

# Alternative: Direct Gmail
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-specific-password"

# Store email for "from" address
STORE_EMAIL="orders@radhikashomecraft.com"
```

### Application URLs
```env
NEXT_PUBLIC_APP_URL="https://radhikashomecraft.com"
NEXT_PUBLIC_API_URL="https://radhikashomecraft.com/api"
```

### Admin Configuration
```env
ADMIN_EMAIL="admin@radhikashomecraft.com"
```

### Analytics & Monitoring

#### Sentry (Error Tracking)
```env
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
```

#### Google Analytics
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### Image Storage (Optional)

#### Cloudinary
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

#### AWS S3
```env
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="radhikas-homecraft-images"
```

## Optional Features

### Shopify Integration
```env
SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
SHOPIFY_ACCESS_TOKEN="your-shopify-access-token"
SHOPIFY_API_KEY="your-api-key"
SHOPIFY_API_SECRET="your-api-secret"
```

### WhatsApp Business API
```env
WHATSAPP_BUSINESS_ACCOUNT_ID="your-account-id"
WHATSAPP_ACCESS_TOKEN="your-access-token"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
```

### SMS Gateway (Twilio)
```env
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

## Setup Instructions

### 1. Create `.env.local` file
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 2. Configure Required Variables
At minimum, you need:
- `DATABASE_URL` - PostgreSQL database connection
- `NEXTAUTH_URL` and `NEXTAUTH_SECRET` - Authentication
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` - Payment processing
- Email SMTP credentials for order notifications

### 3. Configure Shipping
Choose one shipping provider:
- **Shiprocket**: Set `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD`
- **Delhivery**: Set `DELHIVERY_API_KEY`

### 4. Test Configuration
Run the following to verify setup:
```bash
npm run dev
```

Visit `http://localhost:3000/api/health` to check API status.

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for `NEXTAUTH_SECRET`
- Rotate API keys regularly
- Use environment-specific keys (test vs production)
- Enable 2FA for all service accounts
- Use read-only API keys where possible

## Production Deployment

### Vercel
Add environment variables in: **Settings > Environment Variables**

### Docker
Use `--env-file .env.production` flag

### Manual Server
Export variables in your shell or use a process manager like PM2
