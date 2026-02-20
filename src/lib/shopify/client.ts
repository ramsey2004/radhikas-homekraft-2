import Client from 'shopify-buy';
import SHOPIFY_CONFIG from '@/config/shopify';

/**
 * Shopify Storefront API Client
 * 
 * This client handles all communication with Shopify's Storefront API
 * for fetching products, managing cart, and creating checkouts.
 */

let client: any = null;

/**
 * Initialize and get Shopify client instance
 */
export function getShopifyClient() {
  if (!client && SHOPIFY_CONFIG.domain && SHOPIFY_CONFIG.storefrontAccessToken) {
    try {
      client = Client.buildClient({
        domain: SHOPIFY_CONFIG.domain,
        storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
        apiVersion: SHOPIFY_CONFIG.apiVersion,
      });
    } catch (error) {
      console.error('Failed to initialize Shopify client:', error);
      return null;
    }
  }
  return client;
}

/**
 * Check if Shopify client is ready
 */
export function isShopifyClientReady(): boolean {
  return getShopifyClient() !== null;
}

export default getShopifyClient;
