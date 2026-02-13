# Database Migrations Guide

## Overview
This document outlines all database schema changes and how to apply them.

## Current Schema Status
The Prisma schema has been enhanced with the following new models and features:

### New Models Added
1. **ProductImage** - Detailed image management for products
   - Replaces simple string arrays with individual tracking
   - Includes alt text (SEO), captions, and display order
   - One-to-many relationship with Product

2. **EmailLog** - Email tracking and debugging
   - Logs all sent emails with delivery status
   - Tracks template used, recipient, and failure reasons
   - Supports email service integration and monitoring

3. **PaymentLog** - Payment transaction tracking
   - Records all payment attempts and completions
   - Supports multiple gateways (Razorpay, Stripe)
   - Includes gateway responses and transaction IDs
   - Links to orders for reconciliation

4. **AnalyticsEvent** - User behavior tracking
   - Comprehensive event logging (15 event types)
   - Tracks page views, product interactions, purchases
   - Captures user journey and conversion funnels
   - Supports anonymous and authenticated tracking

## How to Apply Migrations

### Prerequisites
```bash
# Install Prisma if not already installed
npm install @prisma/client prisma --save

# Ensure PostgreSQL is running
```

### Step 1: Review the Schema
```bash
# View the current schema
cat prisma/schema.prisma
```

### Step 2: Create and Apply Migration
```bash
# Create a new migration with the current schema
npx prisma migrate dev --name add_advanced_features

# This will:
# 1. Create a migration file in prisma/migrations/
# 2. Apply the migration to your database
# 3. Regenerate Prisma Client
```

### Step 3: Verify Migration
```bash
# Check migration status
npx prisma migrate status

# View Prisma Studio to inspect data
npx prisma studio
```

## Migration Files
- **prisma/schema.prisma** - Current schema definition
- **prisma/migrations/** - Historical migrations (auto-generated)

## Rollback (if needed)
```bash
# Rollback the last migration
npx prisma migrate resolve --rolled-back add_advanced_features

# Note: This only removes the migration record, not the actual schema changes
# You'll need to manually revert the database if needed
```

## Environment Variables Required for New Features

### Email Service
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Razorpay Integration
```
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

### Stripe Integration
```
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### Admin Panel (Analytics)
```
ADMIN_EMAIL=admin@radhikashomecraft.com
```

### Application URL
```
NEXT_PUBLIC_APP_URL=http://localhost:3003
```

## Data Migration Tasks

### Task 1: Move Existing Product Images to ProductImage Table
If you already have product.image data that you want to migrate to ProductImage:

```javascript
// This would be run as a one-time script
const products = await prisma.product.findMany();

for (const product of products) {
  if (product.image) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: product.image,
        altText: product.title,
        order: 0,
      },
    });
  }
}

// Then remove the image field from Product if desired
```

### Task 2: Initial Analytics Events
The AnalyticsEvent table starts empty. Events will be logged automatically once integrated into:
- Frontend page loads
- Product views
- Cart interactions
- Checkout process
- Purchase completion

## Testing the New Features

### Test Email Service
```javascript
import { sendEmail } from '@/lib/email';

await sendEmail({
  to: 'test@example.com',
  template: 'welcome',
  data: { name: 'John Doe' }
});
```

### Test Payment Service
```javascript
import { createRazorpayOrder } from '@/lib/payment';

const order = await createRazorpayOrder(50000, 'test-order-123');
console.log(order);
```

### Test Reviews API
```bash
# Create a review
curl -X POST http://localhost:3003/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod-123",
    "rating": 5,
    "comment": "Great product!"
  }'

# Get reviews for a product
curl http://localhost:3003/api/reviews?productId=prod-123
```

### Test Orders API
```bash
# Get user's orders
curl http://localhost:3003/api/orders

# Create an order
curl -X POST http://localhost:3003/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "productId": "prod-123", "quantity": 1, "price": 999 }
    ],
    "paymentMethod": "razorpay",
    "addressId": "addr-123"
  }'
```

### Test Upload API
```bash
# Upload an image
curl -X POST http://localhost:3003/api/upload \
  -F "file=@image.jpg" \
  -F "productId=prod-123" \
  -F "altText=Product Image"
```

## Production Deployment Checklist

- [ ] Set all environment variables in production
- [ ] Run `npx prisma migrate deploy` before going live
- [ ] Test payment gateway with production keys (after staging tests)
- [ ] Configure email service with production SMTP
- [ ] Set up image storage (local /public or cloud like S3)
- [ ] Enable HTTPS for all payment-related pages
- [ ] Set up error monitoring (Sentry, Rollbar, etc.)
- [ ] Configure analytics dashboard access
- [ ] Set up database backups
- [ ] Test email delivery with production SMTP

## Troubleshooting

### Migration Fails
```bash
# Try resetting the database (development only!)
npx prisma migrate reset

# Or manually check the database state vs migrations:
npx prisma migrate status
```

### Prisma Client Out of Sync
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Email Not Sending
- Check SMTP credentials in .env
- Verify email account allows app passwords (Gmail)
- Check EmailLog table for failure reasons
- Review server logs for errors

### Payment Tests Failing
- Verify API keys are for test/sandbox environment
- Check payment gateway test credentials
- Review PaymentLog table for error details
- Ensure currency is correct (INR for Razorpay)

## Support

For more information:
- Prisma Docs: https://www.prisma.io/docs/
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- NextAuth.js: https://next-auth.js.org/
