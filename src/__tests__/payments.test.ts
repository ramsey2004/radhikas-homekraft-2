/**
 * Payment Integration Tests
 * Tests for Stripe payment processing
 */

import { StripePaymentService, MockStripeService, paymentUtils } from '@/lib/stripe';

describe('Payment Utilities', () => {
  describe('formatAmount', () => {
    it('should convert dollars to cents', () => {
      expect(paymentUtils.formatAmount(9.99)).toBe(999);
      expect(paymentUtils.formatAmount(100)).toBe(10000);
      expect(paymentUtils.formatAmount(0.01)).toBe(1);
    });

    it('should handle edge cases', () => {
      expect(paymentUtils.formatAmount(0)).toBe(0);
      expect(paymentUtils.formatAmount(999.99)).toBe(99999);
    });
  });

  describe('formatFromStripe', () => {
    it('should convert cents to dollars', () => {
      expect(paymentUtils.formatFromStripe(999)).toBe(9.99);
      expect(paymentUtils.formatFromStripe(10000)).toBe(100);
      expect(paymentUtils.formatFromStripe(1)).toBe(0.01);
    });
  });

  describe('validateCardNumber', () => {
    it('should validate valid card numbers (Luhn)', () => {
      expect(paymentUtils.validateCardNumber('4532015112830366')).toBe(true);
      expect(paymentUtils.validateCardNumber('5425233010103442')).toBe(true);
      expect(paymentUtils.validateCardNumber('378282246310005')).toBe(true);
    });

    it('should reject invalid card numbers', () => {
      expect(paymentUtils.validateCardNumber('1234567890123456')).toBe(false);
      expect(paymentUtils.validateCardNumber('0000000000000000')).toBe(false);
    });

    it('should handle card number formatting', () => {
      expect(paymentUtils.validateCardNumber('4532 0151 1283 0366')).toBe(true);
    });
  });

  describe('validateExpiry', () => {
    it('should validate future expiry dates', () => {
      const futureYear = new Date().getFullYear() + 1;
      expect(paymentUtils.validateExpiry(12, futureYear)).toBe(true);
    });

    it('should reject past expiry dates', () => {
      const pastYear = new Date().getFullYear() - 1;
      expect(paymentUtils.validateExpiry(1, pastYear)).toBe(false);
    });

    it('should validate current month if current year', () => {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      if (currentMonth <= 12) {
        expect(paymentUtils.validateExpiry(currentMonth, currentYear)).toBe(true);
      }
    });
  });

  describe('getCardType', () => {
    it('should identify Visa cards', () => {
      expect(paymentUtils.getCardType('4532015112830366')).toBe('visa');
      expect(paymentUtils.getCardType('4916338506082832')).toBe('visa');
    });

    it('should identify Mastercard', () => {
      expect(paymentUtils.getCardType('5425233010103442')).toBe('mastercard');
      expect(paymentUtils.getCardType('5105105105105100')).toBe('mastercard');
    });

    it('should identify American Express', () => {
      expect(paymentUtils.getCardType('378282246310005')).toBe('amex');
      expect(paymentUtils.getCardType('371449635398431')).toBe('amex');
    });

    it('should identify Discover', () => {
      expect(paymentUtils.getCardType('6011111111111117')).toBe('discover');
      expect(paymentUtils.getCardType('6011000990139424')).toBe('discover');
    });

    it('should return unknown for invalid cards', () => {
      expect(paymentUtils.getCardType('0000000000000000')).toBe('unknown');
      expect(paymentUtils.getCardType('1234567890123456')).toBe('unknown');
    });
  });
});

describe('MockStripeService', () => {
  let service: MockStripeService;

  beforeEach(() => {
    service = new MockStripeService();
  });

  it('should create payment intent', async () => {
    const result = await service.createPaymentIntent({
      amount: 9999,
      currency: 'USD',
    });

    expect(result.clientSecret).toBeDefined();
    expect(result.clientSecret).toMatch(/^pi_test_/);
  });

  it('should process payments', async () => {
    const result = await service.processPayment({
      amount: 9999,
      currency: 'USD',
      paymentMethodId: 'pm_test',
      orderId: 'ORD-123',
    });

    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
    expect(result.status).toBe('succeeded');
  });

  it('should confirm card payments', async () => {
    const result = await service.confirmCardPayment('pi_test_123', 'pm_test');

    expect(result.status).toBe('succeeded');
    expect(result.paymentIntentId).toBeDefined();
  });

  it('should get payment status', async () => {
    const result = await service.getPaymentStatus('pi_test_123');

    expect(result.status).toBe('succeeded');
    expect(result.amount).toBe(5000);
  });

  it('should refund payments', async () => {
    const result = await service.refundPayment('pi_test_123');

    expect(result.refundId).toBeDefined();
    expect(result.refundId).toMatch(/^ref_/);
  });
});

describe('StripePaymentService', () => {
  let service: StripePaymentService;

  beforeEach(() => {
    service = new StripePaymentService('pk_test_123456');
  });

  it('should initialize with publishable key', () => {
    expect(service).toBeDefined();
  });

  it('should handle payment processing errors gracefully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: async () => ({ error: 'Payment failed' }),
      } as Response)
    );

    const result = await service.processPayment({
      amount: 9999,
      currency: 'USD',
      paymentMethodId: 'pm_test',
      orderId: 'ORD-123',
    });

    expect(result.success).toBe(false);
  });
});

describe('Payment Integration Flow', () => {
  it('should complete full payment flow', async () => {
    const service = new MockStripeService();

    // Step 1: Create payment intent
    const intentResult = await service.createPaymentIntent({
      amount: 9999,
      currency: 'USD',
    });

    expect(intentResult.clientSecret).toBeDefined();

    // Step 2: Confirm payment
    const confirmResult = await service.confirmCardPayment(
      intentResult.clientSecret,
      'pm_test_123'
    );

    expect(confirmResult.status).toBe('succeeded');

    // Step 3: Get status
    const statusResult = await service.getPaymentStatus(confirmResult.paymentIntentId);

    expect(statusResult.status).toBe('succeeded');
  });

  it('should handle refunds', async () => {
    const service = new MockStripeService();

    // Create payment
    const paymentResult = await service.processPayment({
      amount: 9999,
      currency: 'USD',
      paymentMethodId: 'pm_test',
      orderId: 'ORD-123',
    });

    expect(paymentResult.transactionId).toBeDefined();

    // Refund payment
    const refundResult = await service.refundPayment(paymentResult.transactionId!);

    expect(refundResult.refundId).toBeDefined();
  });

  it('should validate amounts correctly', () => {
    const amounts = [9.99, 100, 0.5, 1000.01];

    amounts.forEach((amount) => {
      const cents = paymentUtils.formatAmount(amount);
      const back = paymentUtils.formatFromStripe(cents);
      expect(Math.abs(back - amount)).toBeLessThan(0.01);
    });
  });
});
