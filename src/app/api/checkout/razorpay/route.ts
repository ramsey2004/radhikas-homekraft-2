import { NextRequest, NextResponse } from 'next/server';
import {
  initializeRazorpayCheckout,
  verifyRazorpayPayment,
} from '@/lib/payments';

// Force dynamic rendering to skip payment initialization during build
export const dynamic = 'force-dynamic';

/**
 * Razorpay Checkout API
 * POST /api/checkout/razorpay/init - Initialize Razorpay order
 * POST /api/checkout/razorpay/verify - Verify payment
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pathname = request.nextUrl.pathname;

    if (pathname.endsWith('/init')) {
      const { cartItems, shippingAddress } = body;
      const order = await initializeRazorpayCheckout(cartItems, shippingAddress);
      return NextResponse.json(order, { status: 201 });
    }

    if (pathname.endsWith('/verify')) {
      const { orderId, paymentId, signature } = body;
      const result = await verifyRazorpayPayment(orderId, paymentId, signature);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  } catch (error) {
    console.error('Razorpay checkout error:', error);
    return NextResponse.json(
      { error: 'Razorpay checkout failed', details: (error as Error).message },
      { status: 400 }
    );
  }
}
