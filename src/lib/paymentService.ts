import Razorpay from 'razorpay';
import Stripe from 'stripe';
import { createHmac } from 'crypto';

export type PaymentGateway = 'razorpay' | 'stripe';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function createRazorpayOrder(
  amount: number,
  currency: string = 'INR',
  receipt: string,
  notes?: Record<string, string>
) {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
      notes,
    });

    return {
      success: true,
      data: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return {
      success: false,
      error: 'Failed to create payment order',
    };
  }
}

export async function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  signature: string
) {
  try {
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

    // Fetch payment details for confirmation
    const payment = await razorpay.payments.fetch(paymentId) as any;

    return {
      success: true,
      data: {
        paymentId,
        orderId,
        status: payment.status,
        amount: (payment.amount as number) / 100, // Convert from paise
        method: payment.method,
      },
    };
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return {
      success: false,
      error: 'Payment verification failed',
    };
  }
}

export async function createStripePaymentIntent(
  amount: number,
  currency: string = 'INR',
  metadata?: Record<string, string>
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      data: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
    };
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    return {
      success: false,
      error: 'Failed to create payment intent',
    };
  }
}

export async function retrieveStripePaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      success: true,
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert from smallest unit
        currency: paymentIntent.currency,
        paymentMethod: paymentIntent.payment_method,
      },
    };
  } catch (error) {
    console.error('Stripe retrieval error:', error);
    return {
      success: false,
      error: 'Failed to retrieve payment details',
    };
  }
}

export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; event?: any; error?: string }> {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        return {
          success: true,
          event: {
            type: 'payment_intent.succeeded',
            paymentIntentId: (event.data.object as any).id,
          },
        };

      case 'payment_intent.payment_failed':
        return {
          success: true,
          event: {
            type: 'payment_intent.payment_failed',
            paymentIntentId: (event.data.object as any).id,
          },
        };

      default:
        return { success: true, event };
    }
  } catch (error) {
    console.error('Webhook verification error:', error);
    return {
      success: false,
      error: 'Webhook verification failed',
    };
  }
}

export function formatAmount(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
