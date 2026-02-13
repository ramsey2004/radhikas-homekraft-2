import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tracking/[trackingNumber] - Track order by tracking number
export async function GET(
  _request: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    const { trackingNumber } = params;

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: { trackingNumber },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
        user: {
          select: {
            email: true,
            name: true,
            phone: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Calculate tracking status progress
    const statusProgress = calculateStatusProgress(order.status);

    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        orderDate: order.createdAt,
        status: order.status,
        statusProgress,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        items: order.items,
        total: order.total,
        shippingAddress: order.shippingAddress,
        events: generateTrackingEvents(order),
      },
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    );
  }
}

function calculateStatusProgress(status: string): number {
  const statusMap: Record<string, number> = {
    PENDING: 20,
    CONFIRMED: 40,
    SHIPPED: 60,
    IN_TRANSIT: 80,
    DELIVERED: 100,
    CANCELLED: 0,
  };
  return statusMap[status] || 0;
}

function generateTrackingEvents(order: any) {
  const events = [];
  const baseDate = new Date(order.createdAt);

  // Order confirmed
  events.push({
    timestamp: baseDate,
    status: 'CONFIRMED',
    title: 'Order Confirmed',
    description: 'Your order has been confirmed',
    location: 'Warehouse',
  });

  if (order.status === 'PENDING' || order.status === 'CANCELLED') {
    return events;
  }

  // Processing
  const processingDate = new Date(baseDate);
  processingDate.setHours(processingDate.getHours() + 2);
  events.push({
    timestamp: processingDate,
    status: 'PROCESSING',
    title: 'Processing',
    description: 'Your order is being processed',
    location: 'Warehouse',
  });

  if (order.status === 'SHIPPED' || order.status === 'IN_TRANSIT' || order.status === 'DELIVERED') {
    // Shipped
    const shippedDate = new Date(baseDate);
    shippedDate.setDate(shippedDate.getDate() + 1);
    events.push({
      timestamp: shippedDate,
      status: 'SHIPPED',
      title: 'Shipped',
      description: `Package shipped with ${order.paymentMethod === 'RAZORPAY' ? 'Express' : 'Standard'} delivery`,
      location: 'In Transit',
    });

    // In Transit
    if (order.status === 'IN_TRANSIT' || order.status === 'DELIVERED') {
      const inTransitDate = new Date(shippedDate);
      inTransitDate.setDate(inTransitDate.getDate() + 1);
      events.push({
        timestamp: inTransitDate,
        status: 'IN_TRANSIT',
        title: 'In Transit',
        description: 'Your package is on its way',
        location: 'In Transit',
      });

      // Delivery attempt
      if (order.status === 'DELIVERED') {
        const deliveryDate = order.estimatedDelivery || new Date(inTransitDate);
        events.push({
          timestamp: deliveryDate,
          status: 'DELIVERED',
          title: 'Delivered',
          description: 'Package delivered successfully',
          location: order.shippingAddress?.city || 'Delivery Location',
        });
      }
    }
  }

  return events;
}
