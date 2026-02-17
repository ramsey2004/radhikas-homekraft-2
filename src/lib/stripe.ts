/**
 * Stripe Payment Gateway Integration
 * Provides payment processing with real Stripe integration
 */

interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

interface ProcessPaymentParams {
  amount: number;
  currency: string;
  paymentMethodId: string;
  customerId?: string;
  orderId: string;
  receiptEmail?: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  status?: string;
}

/**
 * Stripe Payment Service
 * Note: In production, implement actual Stripe API calls via backend
 */
export class StripePaymentService {
  private publishableKey: string;
  private stripe: any;

  constructor(publishableKey: string) {
    this.publishableKey = publishableKey;
    this.initializeStripe();
  }

  private initializeStripe() {
    if (typeof window === 'undefined') return;

    // Load Stripe script dynamically
    if (!(window as any).Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      document.head.appendChild(script);
    }

    // Initialize after script loads
    setTimeout(() => {
      if ((window as any).Stripe) {
        this.stripe = (window as any).Stripe(this.publishableKey);
      }
    }, 1000);
  }

  /**
   * Create payment intent on backend
   */
  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<{ clientSecret: string }> {
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return response.json();
  }

  /**
   * Process payment with payment method
   */
  async processPayment(params: ProcessPaymentParams): Promise<PaymentResult> {
    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        return {
          success: false,
          error: 'Payment processing failed',
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        transactionId: data.transactionId,
        status: data.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Confirm card payment
   */
  async confirmCardPayment(
    clientSecret: string,
    paymentMethodId: string
  ): Promise<{ status: string; paymentIntentId: string }> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const result = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      status: result.paymentIntent.status,
      paymentIntentId: result.paymentIntent.id,
    };
  }

  /**
   * Create payment method from card details
   */
  async createPaymentMethod(cardElement: any): Promise<{ paymentMethodId: string }> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const result = await this.stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      paymentMethodId: result.paymentMethod.id,
    };
  }

  /**
   * Handle 3D Secure authentication
   */
  async handle3DSecure(clientSecret: string): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    return await this.stripe.handleCardAction(clientSecret);
  }

  /**
   * Retrieve payment intent status
   */
  async getPaymentStatus(paymentIntentId: string): Promise<{ status: string; amount: number }> {
    const response = await fetch(`/api/payments/${paymentIntentId}`);

    if (!response.ok) {
      throw new Error('Failed to retrieve payment status');
    }

    return response.json();
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentIntentId: string, amount?: number): Promise<{ refundId: string }> {
    const response = await fetch('/api/payments/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentIntentId, amount }),
    });

    if (!response.ok) {
      throw new Error('Refund failed');
    }

    return response.json();
  }

  /**
   * Get Stripe instance
   */
  getStripe() {
    return this.stripe;
  }
}

/**
 * Payment utilities
 */
export const paymentUtils = {
  /**
   * Format amount for Stripe (cents)
   */
  formatAmount: (amount: number): number => Math.round(amount * 100),

  /**
   * Format amount from Stripe (to display)
   */
  formatFromStripe: (amount: number): number => amount / 100,

  /**
   * Validate card number (Luhn algorithm)
   */
  validateCardNumber: (cardNumber: string): boolean => {
    const sanitized = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(sanitized)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },

  /**
   * Validate expiry date
   */
  validateExpiry: (month: number, year: number): boolean => {
    const now = new Date();
    const expiry = new Date(year, month - 1);
    return expiry > now;
  },

  /**
   * Get card type from number
   */
  getCardType: (
    cardNumber: string
  ): 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown' => {
    const sanitized = cardNumber.replace(/\s/g, '');

    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(sanitized)) return 'visa';
    if (/^5[1-5][0-9]{14}$/.test(sanitized)) return 'mastercard';
    if (/^3[47][0-9]{13}$/.test(sanitized)) return 'amex';
    if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(sanitized)) return 'discover';

    return 'unknown';
  },
};

/**
 * Mock Stripe service for development
 */
export class MockStripeService {
  async createPaymentIntent(
    _params: CreatePaymentIntentParams
  ): Promise<{ clientSecret: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          clientSecret: `pi_test_${Date.now()}`,
        });
      }, 500);
    });
  }

  async processPayment(_params: ProcessPaymentParams): Promise<PaymentResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `txn_${Date.now()}`,
          status: 'succeeded',
        });
      }, 1500);
    });
  }

  async confirmCardPayment(clientSecret: string, _paymentMethodId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'succeeded',
          paymentIntentId: clientSecret,
        });
      }, 1000);
    });
  }

  async getPaymentStatus(_paymentIntentId: string): Promise<{ status: string; amount: number }> {
    return {
      status: 'succeeded',
      amount: 5000,
    };
  }

  async refundPayment(_paymentIntentId: string): Promise<{ refundId: string }> {
    return {
      refundId: `ref_${Date.now()}`,
    };
  }
}
