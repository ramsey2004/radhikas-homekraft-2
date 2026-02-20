# Shopify Integration Setup Guide

## Overview

Your website is now configured to work with Shopify's Storefront API. This means you can:
- Keep your beautiful custom design
- Manage products in Shopify Admin
- Use Shopify's professional checkout
- Handle payments, shipping, and taxes through Shopify
- Track orders and inventory

## 🚀 Quick Start (5 Steps)

### Step 1: Create a Shopify Store

1. Go to [https://www.shopify.com/](https://www.shopify.com/)
2. Click "Start free trial"
3. Follow the signup process
4. Complete your store setup (you'll get something like: `your-store-name.myshopify.com`)

**Pricing:** Plans start at $29/month (Basic) after the free trial.

---

### Step 2: Create a Custom App for API Access

1. In your Shopify Admin, go to **Settings** (bottom left)
2. Click **Apps and sales channels**
3. Click **Develop apps** (top right)
4. Click **Create an app**
5. Name it something like "Website Storefront"
6. Click **Create app**

---

### Step 3: Configure Storefront API Permissions

1. In your new app, click **Configuration**
2. Under **Storefront API**, click **Configure**
3. Enable these scopes (checkboxes):
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_read_product_tags`
   - ✅ `unauthenticated_write_checkouts`
   - ✅ `unauthenticated_read_checkouts`
4. Click **Save**

---

### Step 4: Install App and Get API Token

1. Click **API credentials** tab
2. Click **Install app**
3. Click **Install** to confirm
4. You'll see **Storefront API access token** - copy this token
5. ⚠️ **IMPORTANT:** Save this token somewhere safe - you can't see it again!

---

### Step 5: Add Credentials to Your Website

1. In your project, create a file called `.env.local` (if it doesn't exist)
2. Add these lines:

```env
# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
```

3. Replace:
   - `your-store-name.myshopify.com` with your actual store domain
   - `your_storefront_access_token_here` with the token from Step 4

4. Save the file and restart your development server:
   ```bash
   npm run dev
   ```

---

## 📦 Adding Products to Shopify

### Method 1: Manually in Shopify Admin

1. In Shopify Admin, go to **Products**
2. Click **Add product**
3. Fill in:
   - **Title**: Product name (e.g., "Blue Block Print Bedsheet")
   - **Description**: Product details
   - **Price**: ₹2,570
   - **Images**: Upload product photos
   - **Inventory**: Set quantity
   - **Tags**: Add category tags (e.g., "bedsheets", "block-print")
4. Click **Save**

### Organizing Products by Collection

For your categories (Lamps, Bedsheets, Furniture, etc.):

1. Go to **Products** > **Collections**
2. Click **Create collection**
3. Name it (e.g., "Sīvana Bedsheets")
4. Add products to the collection

### Tagging Strategy

In Shopify, tag your products with:
- `bedsheets` - for Sīvana collection
- `lamps` - for Prākharya collection
- `furniture` - for GrihaKalā collection
- `ceramics` - for Amala collection
- `gifting` - for Punīta collection

---

## 🔗 How Products Appear on Your Website

### Current Setup (Fallback Mode)

Right now, your website shows **hardcoded products** because Shopify isn't configured yet. This is intentional - your site works without Shopify!

### After Shopify Setup

Once you add the credentials to `.env.local`:
1. Products will automatically load from Shopify
2. Inventory will stay in sync
3. Cart will integrate with Shopify checkout
4. Customers will go to Shopify's secure checkout page

---

## 🛒 Testing the Integration

### 1. Verify Configuration

Open your browser console and check for:
- ✅ No Shopify errors
- ✅ Products loading from Shopify
- ✅ Cart syncing properly

### 2. Test Add to Cart

1. Browse a product
2. Click "Add to Cart"
3. Open cart sidebar
4. Verify product appears

### 3. Test Checkout

1. Add items to cart
2. Click "Proceed to Checkout"
3. You should be redirected to: `your-store.myshopify.com/checkout/...`
4. Complete test purchase using Shopify test cards

---

## 🔧 Advanced Configuration

### Example: Update Collection Page to Use Shopify

Update `/src/app/collections/bedsheets/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { fetchProductsByTag, convertShopifyProduct } from '@/lib/shopify';

export default function BedsheetsCollection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const shopifyProducts = await fetchProductsByTag('bedsheets');
      const converted = shopifyProducts.map(convertShopifyProduct);
      setProducts(converted.length > 0 ? converted : fallbackProducts);
      setLoading(false);
    }
    loadProducts();
  }, []);

  // Fallback products (your current hardcoded products)
  const fallbackProducts = [
    // ... your existing products
  ];

  if (loading) return <div>Loading products...</div>;
  
  // Rest of your component...
}
```

---

## 🐛 Troubleshooting

### "Shopify client not initialized"

**Solution:** Check your `.env.local` file has the correct credentials.

### Products not showing

**Solutions:**
1. Verify products are published in Shopify (not in draft mode)
2. Check product tags match your filter (e.g., 'bedsheets')
3. Ensure products are available for "Online Store" sales channel

### Checkout not working

**Solutions:**
1. Verify checkout scopes are enabled in your app
2. Check browser console for errors
3. Ensure you've installed the app (Step 4)

---

## ✅ Checklist Before Going Live

- [ ] Shopify store created
- [ ] Products added with proper tags
- [ ] Custom app created with Storefront API access
- [ ] API credentials added to `.env.local`
- [ ] Website tested locally with Shopify products
- [ ] Test purchase completed successfully
- [ ] Inventory quantities set correctly
- [ ] Shipping rates configured in Shopify
- [ ] Payment provider connected (Shopify Payments, Stripe, etc.)
- [ ] Tax settings configured for India
- [ ] `.env.local` added to `.gitignore` (never commit API tokens!)

---

## 🎉 You're All Set!

Once configured, your website will:
- Display real products from Shopify
- Keep inventory in sync
- Process secure payments through Shopify
- Maintain your beautiful custom design

Customers will enjoy the best of both worlds: your unique design + Shopify's reliable e-commerce backend!

## 📚 Resources

- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Shopify Help Center](https://help.shopify.com/)
- Your Shopify utilities: `src/lib/shopify/`
- Configuration file: `src/config/shopify.ts`
