/**
 * Shopify Storefront API Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Shopify store at https://www.shopify.com/
 * 2. Go to Settings > Apps and sales channels > Develop apps
 * 3. Click "Create an app" and give it a name
 * 4. Click "Configure Storefront API scopes"
 * 5. Enable these scopes:
 *    - unauthenticated_read_product_listings
 *    - unauthenticated_read_product_inventory
 *    - unauthenticated_read_product_tags
 *    - unauthenticated_write_checkouts
 *    - unauthenticated_read_checkouts
 * 6. Click "Install app" and copy the Storefront API access token
 * 7. Add to your .env.local file (create if doesn't exist):
 * 
 *    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
 */

const SHOPIFY_CONFIG = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-01',
};

/**
 * Validate Shopify configuration
 */
export function validateShopifyConfig(): boolean {
  if (!SHOPIFY_CONFIG.domain || !SHOPIFY_CONFIG.storefrontAccessToken) {
    console.error(
      '⚠️ Shopify configuration missing! Please add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN to your .env.local file'
    );
    return false;
  }
  return true;
}

/**
 * Check if Shopify is configured
 */
export function isShopifyConfigured(): boolean {
  return Boolean(SHOPIFY_CONFIG.domain && SHOPIFY_CONFIG.storefrontAccessToken);
}

export default SHOPIFY_CONFIG;
