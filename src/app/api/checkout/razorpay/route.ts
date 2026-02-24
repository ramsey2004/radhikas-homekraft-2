import { NextRequest, NextResponse } from 'next/server';
import {
  initializeRazorpayCheckout,
  verifyRazorpayPayment,
} from '@/lib/payments';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/emailService';

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
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

      // Verify signature
      const verification = await verifyRazorpayPayment(
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      );

      if (verification.status !== 'success') {
        return NextResponse.json(
          { success: false, error: 'Payment verification failed' },
          { status: 400 }
        );
      }

      // Update order in database
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
          shippingAddress: true,
        },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }

      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'COMPLETED',
        },
      });

      // Update payment log
      await prisma.paymentLog.updateMany({
        where: { orderId },
        data: {
          status: 'COMPLETED',
          gatewayTransactionId: razorpay_payment_id,
        },
      });

      // Send order confirmation email
      try {
        await sendEmail({
          to: order.email,
          template: 'orderConfirmation',
          data: {
            orderNumber: order.orderNumber,
            total: order.total,
            items: order.items,
          },
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the verification if email fails
      }

      // Log analytics
      try {
        await prisma.analyticsEvent.create({
          data: {
            userId: order.userId,
            eventType: 'PURCHASE',
            eventName: 'Purchase Completed',
            page: '/checkout',
            metadata: JSON.stringify({
              orderId: order.id,
              total: order.total,
              paymentMethod: 'RAZORPAY',
              paymentId: razorpay_payment_id,
            }),
          },
        });
      } catch (analyticsError) {
        console.error('Failed to log analytics:', analyticsError);
      }

      return NextResponse.json({
        success: true,
        order: updatedOrder,
        message: 'Payment verified successfully',
      });
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
