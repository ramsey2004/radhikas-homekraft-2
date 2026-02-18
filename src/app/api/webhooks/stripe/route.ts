import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleStripeWebhook } from '@/lib/paymentService';
import { sendEmail } from '@/lib/emailService';

// Force dynamic rendering to skip payment initialization during build
export const dynamic = 'force-dynamic';

// POST /api/webhooks/stripe - Handle Stripe webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    const webhookResult = await handleStripeWebhook(body, signature);

    if (!webhookResult.success) {
      return NextResponse.json(
        { error: webhookResult.error },
        { status: 400 }
      );
    }

    const event = webhookResult.event;

    // Handle payment intent succeeded
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntentId = (event.data.object as any).id;

      // Find and update order
      const order = await prisma.order.findFirst({
        where: { paymentId: paymentIntentId },
        include: { user: true, items: { include: { product: true } } },
      });

      if (order) {
        // Update order status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'CONFIRMED',
            paymentStatus: 'COMPLETED',
          },
        });

        // Send confirmation email
        if (order.user?.email) {
          await sendEmail({
            to: order.user.email,
            template: 'orderConfirmation',
            data: {
              orderNumber: order.orderNumber,
              total: order.total,
              items: order.items,
            },
          });
        }

        // Log payment success
        await prisma.paymentLog.create({
          data: {
            orderId: order.id,
            paymentGateway: 'stripe',
            paymentMethod: 'STRIPE',
            amount: order.total,
            currency: 'INR',
            status: 'COMPLETED',
            gatewayTransactionId: paymentIntentId,
            gatewayResponse: JSON.stringify(event.data.object),
          },
        });
      }
    }

    // Handle payment intent failed
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntentId = (event.data.object as any).id;

      // Find and update order
      const order = await prisma.order.findFirst({
        where: { paymentId: paymentIntentId },
        include: { user: true },
      });

      if (order && order.user?.email) {
        // Send failure notification
        try {
          await sendEmail({
            to: order.user.email,
            template: 'paymentFailed',
            data: {
              orderNumber: order.orderNumber,
              retryLink: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}/retry-payment`,
            },
          });
        } catch (error) {
          console.error('Failed to send payment failure email:', error);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
