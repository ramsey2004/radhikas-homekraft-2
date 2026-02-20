# Shopify Integration Guide

## Overview
This guide will help you integrate your Next.js website with Shopify using the Storefront API for a headless commerce setup.

## Prerequisites
- Shopify store (development store recommended)
- Shopify Storefront API access token
- Node.js and npm installed

## Step 1: Set up Shopify Storefront API

### 1.1 Create a Private App in Shopify
1. Go to your Shopify admin panel
2. Navigate to **Settings** → **Apps and sales channels**
3. Click **Develop apps** (if using new admin) or **Private apps** (legacy)
4. Create a new app with the following permissions:
   - `read_products`
   - `read_content`
   - `read_product_listings`
   - `read_collections`
   - `read_checkouts`
   - `write_checkouts`

### 1.2 Get your Storefront Access Token
- Copy the **Storefront access token** from your app settings
- Note your **Shopify store domain** (e.g., `yourstore.myshopify.com`)

## Step 2: Install Shopify Dependencies

```bash
npm install @shopify/storefront-api-client @shopify/admin-api-client
# or for newer versions:
npm install @shopify/storefront-kit
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
SHOPIFY_ADMIN_API_ACCESS_TOKEN=your_admin_api_token_here
```

## Step 4: Create Shopify Client

Create `lib/shopify.ts`:

```typescript
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  accessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  apiVersion: '2024-01'
});

export const adminClient = createAdminApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  accessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
  apiVersion: '2024-01'
});
```

## Step 5: Update Product Fetching

Replace your static product data with Shopify API calls:

```typescript
// lib/shopify-products.ts
import { shopifyClient } from './shopify';

export async function getProducts(collectionHandle?: string) {
  const query = `
    query GetProducts($first: Int!, $query: String) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyClient.request(query, {
    variables: { first: 20, query: collectionHandle ? `collection:${collectionHandle}` : undefined }
  });

  return data.products.edges.map(({ node }: any) => ({
    id: node.id,
    name: node.title,
    handle: node.handle,
    price: `₹${node.priceRange.minVariantPrice.amount}`,
    images: node.images.edges.map((edge: any) => edge.node.url),
    description: node.description,
    variantId: node.variants.edges[0]?.node.id
  }));
}
```

## Step 6: Update Cart Context for Shopify

```typescript
// contexts/CartContext.tsx
import { createCheckout, updateCheckout, addLineItems } from '@/lib/shopify-cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const addToCart = async (product: CartItem) => {
    try {
      let currentCheckoutId = checkoutId;

      if (!currentCheckoutId) {
        const checkout = await createCheckout();
        currentCheckoutId = checkout.id;
        setCheckoutId(checkout.id);
        setCheckoutUrl(checkout.webUrl);
      }

      await addLineItems(currentCheckoutId, [{
        variantId: product.variantId,
        quantity: product.quantity
      }]);

      // Update local cart state
      dispatch({ type: 'ADD_ITEM', payload: product });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const proceedToCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <CartContext.Provider value={{ state, dispatch, addToCart, proceedToCheckout }}>
      {children}
    </CartContext.Provider>
  );
};
```

## Step 7: Create Shopify Cart Functions

```typescript
// lib/shopify-cart.ts
import { shopifyClient } from './shopify';

export async function createCheckout() {
  const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const { data } = await shopifyClient.request(mutation, {
    variables: {
      input: {
        lineItems: []
      }
    }
  });

  if (data.checkoutCreate.checkoutUserErrors.length > 0) {
    throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
  }

  return data.checkoutCreate.checkout;
}

export async function addLineItems(checkoutId: string, lineItems: any[]) {
  const mutation = `
    mutation checkoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
      checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout {
          id
          lineItems(first: 250) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                  }
                }
              }
            }
          }
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const { data } = await shopifyClient.request(mutation, {
    variables: { checkoutId, lineItems }
  });

  if (data.checkoutLineItemsAdd.checkoutUserErrors.length > 0) {
    throw new Error(data.checkoutLineItemsAdd.checkoutUserErrors[0].message);
  }

  return data.checkoutLineItemsAdd.checkout;
}
```

## Step 8: Update Product Pages

Update your collection pages to fetch from Shopify:

```typescript
// app/collections/bedsheets/page.tsx
import { getProducts } from '@/lib/shopify-products';

export default async function BedsheetsCollection() {
  const products = await getProducts('bedsheets');

  return (
    // Your existing JSX with products from Shopify
  );
}
```

## Step 9: Update Product Detail Pages

```typescript
// app/collections/bedsheets/[handle]/page.tsx
import { shopifyClient } from '@/lib/shopify';

export default async function ProductDetail({ params }: { params: { handle: string } }) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
        metafields(first: 10) {
          edges {
            node {
              key
              value
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyClient.request(query, {
    variables: { handle: params.handle }
  });

  const product = data.product;

  return (
    // Your existing product detail JSX with Shopify data
  );
}
```

## Step 10: Add Shopify Webhooks (Optional)

For order management and inventory updates:

```typescript
// pages/api/webhooks/orders-create.ts
import { createHmac } from 'crypto';

export default async function handler(req: any, res: any) {
  const hmac = req.headers['x-shopify-hmac-sha256'];
  const body = JSON.stringify(req.body);

  // Verify webhook authenticity
  const hash = createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET!)
    .update(body, 'utf8')
    .digest('base64');

  if (hash !== hmac) {
    return res.status(401).send('Unauthorized');
  }

  // Process order
  console.log('New order:', req.body);

  res.status(200).send('OK');
}
```

## Step 11: Testing

1. Test product fetching
2. Test cart functionality
3. Test checkout flow
4. Verify webhook delivery

## Step 12: Deployment Considerations

- Ensure environment variables are set in production
- Configure CORS if needed
- Set up proper error handling
- Consider caching strategies for performance

## Alternative: Shopify Buy Button Integration

If you prefer a simpler integration:

```html
<!-- Add to your product pages -->
<div id="shopify-buy-button"></div>
<script>
  // Shopify Buy Button SDK integration
</script>
```

This approach gives you full Shopify functionality with your custom design while maintaining control over the user experience.