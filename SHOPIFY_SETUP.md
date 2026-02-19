# Shopify Integration Setup Guide

This guide walks you through setting up Shopify API integration with your e-commerce website.

## Overview

This integration allows you to:
- **Sync products** from your Shopify store to your database
- **Handle checkout** through Shopify (payment processing)
- **Keep custom features**: reviews, wishlist, admin dashboard, and more
- **Hybrid approach**: Your site displays products, Shopify handles payments

## Prerequisites

1. An active Shopify store (free trial available at shopify.com)
2. Node.js and npm installed locally
3. Access to your Shopify admin panel

## Step 1: Create Shopify App & Get Credentials

### 1a. Create a Private App (or Custom App)

1. Go to your Shopify Admin: `https://your-store.myshopify.com/admin`
2. Navigate to: **Settings** → **Apps and integrations** → **Develop apps**
3. Click **Create an app** → Name it (e.g., "Website Integration")
4. In the app settings, go to **Configuration**
5. Under **Admin API scopes**, enable:
   - `read_products`
   - `write_products`
   - `read_orders`
   - `write_orders`
   - `read_checkouts` (if available)
   - `write_checkouts` (if available)

### 1b. Get Your Storefront Access Token

1. Still in your app settings, find **Storefront API access scopes**
2. Enable:
   - `unauthenticated_read_products`
   - `unauthenticated_read_product_variants`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
3. Save and install the app
4. Click **Reveal token** to get your **Storefront Access Token**
5. Copy both:
   - Your store name (e.g., `my-awesome-store` from `my-awesome-store.myshopify.com`)
   - Your Storefront Access Token (a long string)

## Step 2: Configure Environment Variables

Create or update your `.env.local` file with:

```env
# Shopify Configuration
SHOPIFY_STORE_NAME=your-store-name
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token-here
```

### Example:

```env
SHOPIFY_STORE_NAME=radhikas-homekraft
SHOPIFY_STOREFRONT_ACCESS_TOKEN=cd1b23a456b789c0d1e2f3456a7b8c9d
```

## Step 3: Update Database Schema

Run Prisma migration to add Shopify fields:

```bash
npx prisma migrate dev --name add_shopify_fields
```

This adds these fields to your database:
- **Product model**: `shopifyId`, `shopifyProductHandle`, `maxPrice`
- **Order model**: `shopifyCheckoutId`

## Step 4: Sync Products from Shopify

### Via API Endpoint (Recommended)

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Trigger sync** using your admin dashboard or API:
   ```bash
   curl -X POST http://localhost:3000/api/shopify/sync \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_SESSION_TOKEN"
   ```

   Or use the admin dashboard to trigger it from:
   - **Admin Panel** → **Settings** → **Sync Products**

3. **Check sync status**:
   ```bash
   curl http://localhost:3000/api/shopify/sync
   ```

### Response Example

```json
{
  "success": true,
  "message": "Synced 25 products from Shopify",
  "synced": 25,
  "errors": null,
  "total": 25
}
```

## Step 5: Update Product Pages for Shopify Checkout

Update your product page to use Shopify checkout:

```typescript
import { useShopifyCheckout } from '@/hooks/useShopifyCheckout';

export default function ProductPage() {
  const { createCheckout, isLoading } = useShopifyCheckout();

  const handleBuyNow = async () => {
    await createCheckout([
      {
        productId: product.id,
        variantId: product.variants[0].id,
        quantity: 1,
      },
    ]);
  };

  return (
    <button onClick={handleBuyNow} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Buy Now'}
    </button>
  );
}
```

## Step 6: Update Cart for Shopify Checkout

Similarly, update your cart component to use Shopify checkout:

```typescript
const { createCheckout, isLoading } = useShopifyCheckout();

const handleCheckout = async () => {
  const items = cart.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
  }));

  await createCheckout(items);
};
```

## Step 7: Handle Post-Checkout Redirect

After users complete checkout on Shopify, they'll be redirected back to your site. Create a callback page:

**`src/app/checkout-success/page.tsx`**:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [orderStatus, setOrderStatus] = useState('processing');

  useEffect(() => {
    const checkoutId = searchParams.get('checkout_id');
    if (checkoutId) {
      // Update order status in your system
      fetch('/api/shopify/checkout/confirm', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutId,
          orderStatus: 'completed',
        }),
      });
    }
  }, [searchParams]);

  return (
    <div className="m-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold">Order Confirmed!</h1>
      <p>Thank you for your purchase. Your order is being processed.</p>
    </div>
  );
}
```

## Step 8: Test Everything

### Test Product Sync
1. Go to admin panel
2. Click "Sync Products" button
3. Verify products appear in your database

### Test Checkout
1. Browse to a product page
2. Click "Buy Now"
3. You should be redirected to Shopify checkout
4. Complete payment (use test card: 4242 4242 4242 4242)
5. Should be redirected back to your site

### Verify Order Status
1. Check your database: products should have `shopifyId` and `shopifyProductHandle`
2. Check orders: should have `shopifyCheckoutId` populated

## API Endpoints Reference

### GET /api/shopify/sync
Get product sync status

```bash
curl http://localhost:3000/api/shopify/sync
```

Response:
```json
{
  "shopifySyncedProducts": 25,
  "totalProducts": 30,
  "syncPercentage": "83.3"
}
```

### POST /api/shopify/sync
Sync products from Shopify (Admin only)

```bash
curl -X POST http://localhost:3000/api/shopify/sync \
  -H "Content-Type: application/json"
```

### POST /api/shopify/checkout
Create checkout and redirect to Shopify

```bash
curl -X POST http://localhost:3000/api/shopify/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod_123",
        "variantId": "var_456",
        "quantity": 1
      }
    ]
  }'
```

Response:
```json
{
  "success": true,
  "checkoutUrl": "https://your-store.myshopify.com/checkout/...",
  "orderId": "order_789"
}
```

### PATCH /api/shopify/checkout
Confirm checkout completion

```bash
curl -X PATCH http://localhost:3000/api/shopify/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "checkoutId": "gid://shopify/Checkout/...",
    "orderStatus": "completed"
  }'
```

## Troubleshooting

### "Shopify not configured" error
- Verify `SHOPIFY_STORE_NAME` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` are set in `.env.local`
- Check they don't have extra spaces or quotes
- Restart dev server after updating env vars

### Products not syncing
- Ensure your Shopify app has correct API scopes enabled
- Check Shopify admin panel for any errors
- Verify you have products in your Shopify store

### Checkout not working
- Confirm Storefront Access Token is correct
- Check browser console for error messages
- Verify product variants are available in Shopify

### "Product variant not found" error
- Make sure product variants exist in Shopify
- Check that `variantId` is being passed correctly
- Variant ID format should be like `gid://shopify/ProductVariant/123456789`

## Next Steps

1. Configure return/callback URL in Shopify if needed
2. Set up Shopify webhook for order confirmations (optional)
3. Customize post-checkout flow
4. Test with real products and payments
5. Deploy to production

## Additional Resources

- [Shopify API Docs](https://shopify.dev/api/storefront)
- [Shopify GraphQL API Explorer](https://shopify.dev/api/storefront/current)
- [Prisma Migration Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## Support

For issues or questions:
1. Check Shopify admin panel error logs
2. Review API endpoint responses
3. Check browser console for frontend errors
4. Review server logs in terminal
