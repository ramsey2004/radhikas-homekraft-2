import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

// PUT /api/admin/orders/[orderId]/status - Update order status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const { status, trackingNumber, estimatedDelivery } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        trackingNumber: trackingNumber || order.trackingNumber,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : order.estimatedDelivery,
      },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    // Send status update email
    if (order.user?.email) {
      const statusMessages: Record<string, string> = {
        CONFIRMED: 'Your order has been confirmed! We are preparing it for shipment.',
        SHIPPED: `Your order is on the way! Tracking number: ${trackingNumber || 'TBD'}`,
        IN_TRANSIT: 'Your package is in transit and will be delivered soon.',
        DELIVERED: 'Your order has been delivered! Thank you for your purchase.',
        CANCELLED: 'Your order has been cancelled. Please contact support for more information.',
      };

      try {
        await sendEmail({
          to: order.user.email,
          template: 'shipment',
          data: {
            name: order.user.name || 'Valued Customer',
            orderNumber: order.orderNumber,
            trackingNumber: trackingNumber || 'TBD',
            status,
            message: statusMessages[status] || `Order status updated to ${status}`,
          },
        });
      } catch (emailError) {
        console.error('Failed to send status email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
