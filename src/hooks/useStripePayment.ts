/**
 * Stripe Payment Hook
 * Custom hook for managing Stripe payments in React components
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { StripePaymentService, MockStripeService, paymentUtils } from '@/lib/stripe';
import toast from 'react-hot-toast';

interface UseStripePaymentOptions {
  useMock?: boolean;
  publishableKey?: string;
}

interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export function useStripePayment(options: UseStripePaymentOptions = {}) {
  const { useMock = true, publishableKey = '' } = options;

  const [stripe, setStripe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);

  // Initialize Stripe service
  useEffect(() => {
    if (useMock) {
      setStripe(new MockStripeService());
    } else if (publishableKey) {
      setStripe(new StripePaymentService(publishableKey));
    }
  }, [useMock, publishableKey]);

  /**
   * Create payment intent
   */
  const createIntent = useCallback(
    async (amount: number, currency: string = 'USD') => {
      if (!stripe) return;

      setLoading(true);
      setError(null);

      try {
        const result = await stripe.createPaymentIntent({
          amount: paymentUtils.formatAmount(amount),
          currency,
        });

        setPaymentIntent({
          clientSecret: result.clientSecret,
          amount,
          currency,
        });

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create payment intent';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [stripe]
  );

  /**
   * Process payment
   */
  const processPayment = useCallback(
    async (
      paymentMethodId: string,
      orderId: string,
      receiptEmail?: string
    ) => {
      if (!stripe || !paymentIntent) {
        setError('Payment not initialized');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await stripe.processPayment({
          amount: paymentUtils.formatAmount(paymentIntent.amount),
          currency: paymentIntent.currency,
          paymentMethodId,
          orderId,
          receiptEmail,
        });

        if (result.success) {
          toast.success('Payment successful!');
          return result;
        } else {
          throw new Error(result.error || 'Payment failed');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Payment processing failed';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [stripe, paymentIntent]
  );

  /**
   * Confirm card payment (for 3D Secure)
   */
  const confirmPayment = useCallback(
    async (paymentMethodId: string) => {
      if (!stripe || !paymentIntent) {
        setError('Payment not initialized');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await stripe.confirmCardPayment(
          paymentIntent.clientSecret,
          paymentMethodId
        );

        if (result.status === 'succeeded') {
          toast.success('Payment confirmed!');
          return result;
        } else {
          throw new Error(`Payment status: ${result.status}`);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Payment confirmation failed';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [stripe, paymentIntent]
  );

  /**
   * Get payment status
   */
  const getStatus = useCallback(
    async (paymentIntentId: string) => {
      if (!stripe) return null;

      try {
        return await stripe.getPaymentStatus(paymentIntentId);
      } catch (err) {
        console.error('Failed to get payment status:', err);
        return null;
      }
    },
    [stripe]
  );

  /**
   * Refund payment
   */
  const refund = useCallback(
    async (paymentIntentId: string, amount?: number) => {
      if (!stripe) return null;

      setLoading(true);
      setError(null);

      try {
        const result = await stripe.refundPayment(paymentIntentId, amount);
        toast.success('Refund processed successfully');
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Refund failed';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [stripe]
  );

  /**
   * Validate card
   */
  const validateCard = useCallback((cardNumber: string) => {
    return paymentUtils.validateCardNumber(cardNumber);
  }, []);

  /**
   * Validate expiry
   */
  const validateExpiry = useCallback((month: number, year: number) => {
    return paymentUtils.validateExpiry(month, year);
  }, []);

  /**
   * Get card type
   */
  const getCardType = useCallback((cardNumber: string) => {
    return paymentUtils.getCardType(cardNumber);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset payment state
   */
  const reset = useCallback(() => {
    setPaymentIntent(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    // State
    loading,
    error,
    paymentIntent,
    stripe: stripe ? 'loaded' : 'loading',

    // Methods
    createIntent,
    processPayment,
    confirmPayment,
    getStatus,
    refund,
    validateCard,
    validateExpiry,
    getCardType,
    clearError,
    reset,

    // Utilities
    formatAmount: paymentUtils.formatAmount,
    formatFromStripe: paymentUtils.formatFromStripe,
  };
}
