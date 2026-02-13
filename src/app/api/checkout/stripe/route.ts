import { NextRequest, NextResponse } from 'next/server';
import {
  initializeStripeCheckout,
  confirmStripePayment,
} from '@/lib/payments';

/**
 * Stripe Checkout API
 * POST /api/checkout/stripe/init - Initialize Stripe session
 * POST /api/checkout/stripe/confirm - Confirm payment
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pathname = request.nextUrl.pathname;

    if (pathname.endsWith('/init')) {
      const { cartItems, shippingAddress } = body;
      const session = await initializeStripeCheckout(cartItems, shippingAddress);
      return NextResponse.json(session, { status: 201 });
    }

    if (pathname.endsWith('/confirm')) {
      const { sessionId, paymentIntentId } = body;
      const result = await confirmStripePayment(sessionId, paymentIntentId);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Stripe checkout failed', details: (error as Error).message },
      { status: 400 }
    );
  }
}
