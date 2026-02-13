'use client';

import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processRazorpayPayment = async (orderId: string, amount: number) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Create order on backend
      const orderResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount,
          paymentMethod: 'razorpay',
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: orderData.data.orderId,
          amount: orderData.data.amount,
          currency: 'INR',
          name: 'Radhika\'s Homecraft',
          description: 'Purchase handcrafted products',
          handler: (response: any) => {
            verifyAndCompletePayment(response);
          },
          prefill: {
            email: sessionStorage.getItem('userEmail') || '',
            contact: sessionStorage.getItem('userPhone') || '',
          },
          theme: {
            color: '#8b4513',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const processStripePayment = async (clientSecret: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      // This would integrate with Stripe.js
      // Implementation depends on your Stripe setup
      console.log('Processing Stripe payment with client secret:', clientSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Stripe payment failed';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyAndCompletePayment = async (paymentData: any) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: paymentData.razorpay_order_id,
          paymentId: paymentData.razorpay_payment_id,
          signature: paymentData.razorpay_signature,
        }),
      });

      const result = await response.json();
      return result.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
      setError(errorMessage);
      return false;
    }
  };

  return {
    isProcessing,
    error,
    processRazorpayPayment,
    processStripePayment,
  };
}
