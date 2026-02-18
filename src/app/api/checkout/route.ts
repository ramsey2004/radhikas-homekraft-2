import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createRazorpayOrder, createStripePaymentIntent } from '@/lib/payment';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

// Force dynamic rendering to skip payment initialization during build
export const dynamic = 'force-dynamic';

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0),
    })
  ),
  addressId: z.string().optional(),
  paymentMethod: z.enum(['razorpay', 'stripe', 'cod']), // COD = Cash on Delivery
  discountCode: z.string().optional(),
});

// POST /api/checkout - Create order and initiate payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = checkoutSchema.parse(body);

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { addresses: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify address if provided
    let address = null;
    if (validatedData.addressId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      address = user.addresses.find((a: any) => a.id === validatedData.addressId);
      if (!address) {
        return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
      }
    }

    // Verify all products exist and calculate total
    let total = 0;
    const items = [];

    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      // Verify price hasn't changed drastically
      if (Math.abs(product.price - item.price) > product.price * 0.1) {
        return NextResponse.json(
          { error: `Price for ${product.name} has changed. Please refresh and try again.` },
          { status: 400 }
        );
      }

      total += product.price * item.quantity;
      items.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Apply discount code if provided
    let discount = null;
    if (validatedData.discountCode) {
      discount = await prisma.discountCode.findUnique({
        where: { code: validatedData.discountCode },
      });

      if (!discount || !discount.isActive || new Date() > discount.validUntil) {
        return NextResponse.json({ error: 'Invalid or expired discount code' }, { status: 400 });
      }

      if (discount.discountType === 'PERCENTAGE') {
        total = total * (1 - discount.discountValue / 100);
      } else {
        total = Math.max(0, total - discount.discountValue);
      }
    }

    // Create order in database
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        email: user.email,
        userId: user.id,
        status: validatedData.paymentMethod === 'cod' ? 'CONFIRMED' : 'PENDING',
        paymentMethod: (validatedData.paymentMethod.toUpperCase() as any),
        paymentStatus: validatedData.paymentMethod === 'cod' ? 'PENDING' : 'PENDING',
        subtotal: total,
        total,
        shippingAddressId: validatedData.addressId || user.addresses[0]?.id || '',
        billingAddressId: validatedData.addressId || user.addresses[0]?.id || '',
        discountCodeId: discount?.id,
        items: {
          create: items,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    let paymentData = null;

    // Create payment based on method
    if (validatedData.paymentMethod === 'razorpay') {
      try {
        const razorpayOrder = await createRazorpayOrder(Math.round(total * 100), order.id);

        if (razorpayOrder.success) {
          // Log payment attempt
          await prisma.paymentLog.create({
            data: {
              orderId: order.id,
              paymentGateway: 'razorpay',
              paymentMethod: 'RAZORPAY',
              amount: total,
              currency: 'INR',
              status: 'PENDING',
              gatewayResponse: JSON.stringify(razorpayOrder.data),
            },
          });

          paymentData = {
            gateway: 'razorpay',
            orderId: razorpayOrder.data!.id,
            amount: razorpayOrder.data!.amount,
            currency: razorpayOrder.data!.currency,
            receipt: razorpayOrder.data!.receipt,
          };
        } else {
          throw new Error(razorpayOrder.error);
        }
      } catch (error) {
        console.error('Razorpay error:', error);
        return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
      }
    } else if (validatedData.paymentMethod === 'stripe') {
      try {
        const stripeIntent = await createStripePaymentIntent(
          Math.round(total * 100),
          order.id,
          user.email
        );

        if (stripeIntent.success) {
          // Log payment attempt
          await prisma.paymentLog.create({
            data: {
              orderId: order.id,
              paymentGateway: 'stripe',
              paymentMethod: 'STRIPE',
              amount: total,
              currency: 'INR',
              status: 'PENDING',
              gatewayResponse: JSON.stringify(stripeIntent.data),
            },
          });

          paymentData = {
            gateway: 'stripe',
            clientSecret: stripeIntent.data!.client_secret,
            amount: stripeIntent.data!.amount,
            currency: stripeIntent.data!.currency,
          };
        } else {
          throw new Error(stripeIntent.error);
        }
      } catch (error) {
        console.error('Stripe error:', error);
        return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
      }
    }

    // Send order confirmation email
    try {
      await sendEmail({
        to: user.email,
        template: 'orderConfirmation',
        data: {
          name: user.name || 'Valued Customer',
          orderNumber: order.orderNumber,
          total: total.toFixed(2),
          items: order.items,
          orderUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}`,
        },
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Don't fail checkout if email fails
    }

    // Log analytics event
    try {
      await prisma.analyticsEvent.create({
        data: {
          userId: user.id,
          eventType: 'CHECKOUT_START',
          eventName: 'Checkout Started',
          page: '/checkout',
          metadata: JSON.stringify({
            orderId: order.id,
            total,
            itemCount: items.length,
          }),
        },
      });
    } catch (error) {
      console.error('Error logging analytics:', error);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
      payment: paymentData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid checkout data', issues: error.issues },
        { status: 400 }
      );
    }

    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}

// POST /api/checkout/verify - Verify payment and complete order
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentId } = body;

    if (!orderId || !paymentId) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify payment - implementation depends on payment gateway
    // This is a simplified version that should be enhanced with actual gateway verification

    // Update order status
    const completedOrder = await prisma.order.update({
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
        gatewayTransactionId: paymentId,
      },
    });

    // Send shipment notification email
    try {
      await sendEmail({
        to: order.user?.email || order.email,
        template: 'shipment',
        data: {
          name: order.user?.name || 'Valued Customer',
          orderNumber: order.orderNumber,
          trackingNumber: order.trackingNumber || 'TBD',
          trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/track/${order.trackingNumber}`,
        },
      });
    } catch (error) {
      console.error('Error sending shipment email:', error);
    }

    // Log analytics event
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
            paymentMethod: order.paymentMethod,
          }),
        },
      });
    } catch (error) {
      console.error('Error logging analytics:', error);
    }

    return NextResponse.json({
      success: true,
      order: completedOrder,
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
