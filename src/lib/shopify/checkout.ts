import getShopifyClient from './client';

/**
 * Shopify Checkout Type
 */
export interface ShopifyCheckout {
  id: string;
  webUrl: string;
  lineItems: Array<{
    id: string;
    title: string;
    quantity: number;
    variant: {
      id: string;
      title: string;
      price: {
        amount: string;
        currencyCode: string;
      };
      image: {
        src: string;
      };
    };
  }>;
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  completedAt: string | null;
}

/**
 * Create a new checkout
 */
export async function createCheckout(): Promise<ShopifyCheckout | null> {
  const client = getShopifyClient();
  
  if (!client) {
    console.error('Shopify client not initialized');
    return null;
  }

  try {
    const checkout = await client.checkout.create();
    return checkout as ShopifyCheckout;
  } catch (error) {
    console.error('Error creating checkout:', error);
    return null;
  }
}

/**
 * Fetch existing checkout
 */
export async function fetchCheckout(checkoutId: string): Promise<ShopifyCheckout | null> {
  const client = getShopifyClient();
  
  if (!client) {
    console.error('Shopify client not initialized');
    return null;
  }

  try {
    const checkout = await client.checkout.fetch(checkoutId);
    return checkout as ShopifyCheckout;
  } catch (error) {
    console.error('Error fetching checkout:', error);
    return null;
  }
}

/**
 * Add line items to checkout
 */
export async function addLineItemsToCheckout(
  checkoutId: string,
  lineItems: Array<{ variantId: string; quantity: number }>
): Promise<ShopifyCheckout | null> {
  const client = getShopifyClient();
  
  if (!client) {
    console.error('Shopify client not initialized');
    return null;
  }

  try {
    const checkout = await client.checkout.addLineItems(checkoutId, lineItems);
    return checkout as ShopifyCheckout;
  } catch (error) {
    console.error('Error adding line items to checkout:', error);
    return null;
  }
}

/**
 * Remove line item from checkout
 */
export async function removeLineItemFromCheckout(
  checkoutId: string,
  lineItemId: string
): Promise<ShopifyCheckout | null> {
  const client = getShopifyClient();
  
  if (!client) {
    console.error('Shopify client not initialized');
    return null;
  }

  try {
    const checkout = await client.checkout.removeLineItems(checkoutId, [lineItemId]);
    return checkout as ShopifyCheckout;
  } catch (error) {
    console.error('Error removing line item from checkout:', error);
    return null;
  }
}

/**
 * Update line item quantity in checkout
 */
export async function updateLineItemQuantity(
  checkoutId: string,
  lineItemId: string,
  quantity: number
): Promise<ShopifyCheckout | null> {
  const client = getShopifyClient();
  
  if (!client) {
    console.error('Shopify client not initialized');
    return null;
  }

  try {
    const checkout = await client.checkout.updateLineItems(checkoutId, [
      { id: lineItemId, quantity }
    ]);
    return checkout as ShopifyCheckout;
  } catch (error) {
    console.error('Error updating line item quantity:', error);
    return null;
  }
}

/**
 * Get or create checkout
 * Checks localStorage for existing checkout ID
 */
export async function getOrCreateCheckout(): Promise<ShopifyCheckout | null> {
  if (typeof window === 'undefined') return null;

  const checkoutId = localStorage.getItem('shopify_checkout_id');

  if (checkoutId) {
    const checkout = await fetchCheckout(checkoutId);
    
    // If checkout is completed or doesn't exist, create a new one
    if (!checkout || checkout.completedAt) {
      const newCheckout = await createCheckout();
      if (newCheckout) {
        localStorage.setItem('shopify_checkout_id', newCheckout.id);
      }
      return newCheckout;
    }
    
    return checkout;
  }

  const newCheckout = await createCheckout();
  if (newCheckout) {
    localStorage.setItem('shopify_checkout_id', newCheckout.id);
  }
  return newCheckout;
}

/**
 * Clear checkout from localStorage
 */
export function clearCheckout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('shopify_checkout_id');
  }
}

/**
 * Redirect to Shopify checkout page
 */
export function redirectToCheckout(checkoutUrl: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = checkoutUrl;
  }
}
