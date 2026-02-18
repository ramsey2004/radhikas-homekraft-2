import Razorpay from 'razorpay';
import Stripe from 'stripe';
import { createHmac } from 'crypto';

// Lazy initialize Razorpay on first use
let razorpay: Razorpay | null = null;
function getRazorpay(): Razorpay | null {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    try {
      razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    } catch (error) {
      console.warn('Razorpay initialization warning:', error);
    }
  }
  return razorpay;
}

// Lazy initialize Stripe on first use
let stripe: Stripe | null = null;
function getStripe(): Stripe | null {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    try {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
      });
    } catch (error) {
      console.warn('Stripe initialization warning:', error);
    }
  }
  return stripe;
}

// Export getters for backward compatibility
export { getRazorpay as razorpay, getStripe as stripe };

// Razorpay payment creation
export async function createRazorpayOrder(amount: number, orderId: string) {
  try {
    const razorpayClient = getRazorpay();
    if (!razorpayClient) {
      return {
        success: false,
        error: 'Razorpay is not configured',
      };
    }

    const order = await razorpayClient.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: orderId,
      notes: {
        orderId,
      },
    });

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order',
    };
  }
}

// Razorpay payment verification
export async function verifyRazorpayPayment(
  paymentId: string,
  orderId: string,
  signature: string
) {
  try {
    const razorpayClient = getRazorpay();
    if (!razorpayClient) {
      return {
        success: false,
        error: 'Razorpay is not configured',
      };
    }

    const hmac = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest('hex');

    const isValid = generatedSignature === signature;

    if (!isValid) {
      return {
        success: false,
        error: 'Invalid payment signature',
      };
    }

    // Fetch payment details
    const payment = await razorpayClient.payments.fetch(paymentId);

    return {
      success: true,
      data: payment,
    };
  } catch (error) {
    console.error('Razorpay payment verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment verification failed',
    };
  }
}

// Stripe payment intent creation
export async function createStripePaymentIntent(
  amount: number,
  orderId: string,
  customerEmail: string
) {
  try {
    const stripeClient = getStripe();
    if (!stripeClient) {
      return {
        success: false,
        error: 'Stripe is not configured',
      };
    }

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        orderId,
      },
      receipt_email: customerEmail,
    });

    return {
      success: true,
      data: paymentIntent,
    };
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent',
    };
  }
}

// Stripe payment confirmation
export async function confirmStripePayment(paymentIntentId: string) {
  try {
    const stripeClient = getStripe();
    if (!stripeClient) {
      return {
        success: false,
        error: 'Stripe is not configured',
      };
    }

    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    return {
      success: paymentIntent.status === 'succeeded',
      data: paymentIntent,
    };
  } catch (error) {
    console.error('Stripe payment confirmation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment confirmation failed',
    };
  }
}

// Refund handling for Razorpay
export async function refundRazorpayPayment(paymentId: string, amount?: number) {
  try {
    const razorpayClient = getRazorpay();
    if (!razorpayClient) {
      return {
        success: false,
        error: 'Razorpay is not configured',
      };
    }

    const refund = await razorpayClient.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return {
      success: true,
      data: refund,
    };
  } catch (error) {
    console.error('Razorpay refund error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Refund failed',
    };
  }
}

// Refund handling for Stripe
export async function refundStripePayment(paymentIntentId: string, amount?: number) {
  try {
    const stripeClient = getStripe();
    if (!stripeClient) {
      return {
        success: false,
        error: 'Stripe is not configured',
      };
    }

    const refund = await stripeClient.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return {
      success: true,
      data: refund,
    };
  } catch (error) {
    console.error('Stripe refund error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Refund failed',
    };
  }
}
