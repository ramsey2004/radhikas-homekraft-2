/**
 * Shopify Storefront API Integration
 * 
 * This module provides a complete integration with Shopify's Storefront API,
 * allowing you to fetch products, manage cart, and process checkouts while
 * maintaining your custom frontend design.
 */

export { default as getShopifyClient, isShopifyClientReady } from './client';
export { default as SHOPIFY_CONFIG, validateShopifyConfig, isShopifyConfigured } from '@/config/shopify';

export {
  fetchProducts,
  fetchProductsByCollection,
  fetchProductsByTag,
  fetchProduct,
  fetchProductByHandle,
  formatShopifyPrice,
  convertShopifyProduct,
  type ShopifyProduct,
} from './products';

export {
  createCheckout,
  fetchCheckout,
  addLineItemsToCheckout,
  removeLineItemFromCheckout,
  updateLineItemQuantity,
  getOrCreateCheckout,
  clearCheckout,
  redirectToCheckout,
  type ShopifyCheckout,
} from './checkout';
