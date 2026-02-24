import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createShipment, trackShipment, cancelShipment, ShipmentDetails } from '@/lib/shipping';

export const dynamic = 'force-dynamic';

/**
 * POST /api/shipping/create - Create shipment for an order
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, provider = 'shiprocket' } = body;

    // Fetch order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.shippingAddress) {
      return NextResponse.json({ error: 'Shipping address not found' }, { status: 400 });
    }

    // Prepare shipment data
    const shipmentData: ShipmentDetails = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt.toISOString().split('T')[0],
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      total: order.total,
      items: order.items.map((item: any) => ({
        name: item.product?.name || 'Product',
        sku: item.product?.sku || item.productId,
        units: item.quantity,
        sellingPrice: item.price,
      })),
      shippingAddress: {
        name: order.shippingAddress.name,
        phone: order.shippingAddress.phone,
        email: order.email,
        address: `${order.shippingAddress.addressLine1}, ${order.shippingAddress.addressLine2 || ''}`,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country,
      },
      billingAddress: order.billingAddress
        ? {
            name: order.billingAddress.name,
            phone: order.billingAddress.phone,
            email: order.email,
            address: `${order.billingAddress.addressLine1}, ${order.billingAddress.addressLine2 || ''}`,
            city: order.billingAddress.city,
            state: order.billingAddress.state,
            pincode: order.billingAddress.zipCode,
            country: order.billingAddress.country,
          }
        : undefined,
    };

    // Create shipment with provider
    const shipmentResult = await createShipment(provider, shipmentData);

    if (!shipmentResult.success) {
      return NextResponse.json(
        { error: shipmentResult.error, details: shipmentResult.data },
        { status: 400 }
      );
    }

    // Update order with shipment details
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PROCESSING',
        trackingNumber: shipmentResult.awbCode || shipmentResult.shipmentId,
        trackingUrl: shipmentResult.trackingUrl,
      },
    });

    // Send shipment notification email
    try {
      const { sendEmail } = await import('@/lib/emailService');
      await sendEmail({
        to: order.email,
        template: 'shipment',
        data: {
          orderNumber: order.orderNumber,
          trackingNumber: shipmentResult.awbCode || shipmentResult.shipmentId || 'Processing',
          trackingUrl:
            shipmentResult.trackingUrl ||
            `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}`,
        },
      });
    } catch (emailError) {
      console.error('Failed to send shipment email:', emailError);
    }

    return NextResponse.json({
      success: true,
      shipment: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        shipmentId: shipmentResult.shipmentId,
        awbCode: shipmentResult.awbCode,
        trackingUrl: shipmentResult.trackingUrl,
        provider,
      },
    });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 });
  }
}

/**
 * GET /api/shipping/track?trackingCode=XXX&provider=shiprocket
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingCode = searchParams.get('trackingCode');
    const provider = (searchParams.get('provider') || 'shiprocket') as any;

    if (!trackingCode) {
      return NextResponse.json({ error: 'Tracking code required' }, { status: 400 });
    }

    const trackingResult = await trackShipment(provider, trackingCode);

    if (!trackingResult.success) {
      return NextResponse.json(
        { error: trackingResult.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      tracking: trackingResult.data,
      trackingUrl: trackingResult.trackingUrl,
    });
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return NextResponse.json({ error: 'Failed to track shipment' }, { status: 500 });
  }
}

/**
 * DELETE /api/shipping/cancel
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { trackingCode, provider = 'shiprocket' } = body;

    if (!trackingCode) {
      return NextResponse.json({ error: 'Tracking code required' }, { status: 400 });
    }

    const cancelResult = await cancelShipment(provider, trackingCode);

    if (!cancelResult.success) {
      return NextResponse.json(
        { error: cancelResult.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Shipment cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling shipment:', error);
    return NextResponse.json({ error: 'Failed to cancel shipment' }, { status: 500 });
  }
}
