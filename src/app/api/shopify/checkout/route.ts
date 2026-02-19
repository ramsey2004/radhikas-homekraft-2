import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { initializeShopify } from '@/lib/shopify';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Create a Shopify checkout and redirect user to Shopify
 * POST /api/shopify/checkout
 * Body: { items: [{ productId: string, variantId: string, quantity: number }] }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const shopify = initializeShopify();
    if (!shopify) {
      return NextResponse.json(
        { error: 'Shopify not configured' },
        { status: 400 }
      );
    }

    // Format items for Shopify checkout
    const lineItems = items.map((item: any) => ({
      variantId: `gid://shopify/ProductVariant/${item.variantId}`,
      quantity: item.quantity,
    }));

    // Create checkout with custom attributes
    const checkout = await shopify.createCheckout({
      lineItems,
      customAttributes: [
        {
          key: 'user_id',
          value: session.user.id || '',
        },
        {
          key: 'user_email',
          value: session.user.email || '',
        },
      ],
    });

    // Create order record in our database (initially unpaid)
    const orderItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        return {
          product: {
            connect: { id: item.productId },
          },
          quantity: item.quantity,
          price: product?.price || 0,
        };
      })
    );

    const order = await prisma.order.create({
      data: {
        user: {
          connect: { id: session.user.id || '' },
        },
        items: {
          create: orderItems,
        },
        total: checkout.lineItems.edges.reduce(
          (sum: number, item: any) => sum + parseFloat(item.node.variant.price) * item.node.quantity,
          0
        ),
        status: 'pending',
        paymentStatus: 'unpaid',
        shopifyCheckoutId: checkout.id,
        orderNumber: `SHOP-${Date.now()}`,
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: shopify.getCheckoutUrl(checkout.id),
      orderId: order.id,
      message: 'Checkout created. Redirect to checkout URL.',
    });
  } catch (error) {
    console.error('Shopify checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * Webhook to update order status when Shopify order is completed
 * POST /api/shopify/checkout/confirm
 * This endpoint should be called after user completes Shopify checkout
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkoutId, orderStatus } = body;

    if (!checkoutId) {
      return NextResponse.json({ error: 'Missing checkoutId' }, { status: 400 });
    }

    // Update order status
    const order = await prisma.order.update({
      where: { shopifyCheckoutId: checkoutId },
      data: {
        status: orderStatus === 'completed' ? 'processing' : 'pending',
        paymentStatus: orderStatus === 'completed' ? 'paid' : 'unpaid',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: order.status,
    });
  } catch (error) {
    console.error('Checkout confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm checkout' },
      { status: 500 }
    );
  }
}
