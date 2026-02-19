import { useState } from 'react';
import toast from 'react-hot-toast';

export interface ShopifyCheckoutItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export function useShopifyCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckout = async (items: ShopifyCheckoutItem[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to create checkout');
        return null;
      }

      // Save order ID for later reference
      sessionStorage.setItem('shopifyOrderId', data.orderId);

      // Redirect to Shopify checkout
      window.location.href = data.checkoutUrl;
      return data;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckout,
    isLoading,
  };
}
