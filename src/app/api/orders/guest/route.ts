import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface GuestOrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

// POST /api/orders/guest - Create a new guest order (no authentication required)
export async function POST(request: NextRequest) {
  try {
    const body: GuestOrderData = await request.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain items' },
        { status: 400 }
      );
    }

    // Create order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)
      .toUpperCase()}`;

    try {
      // Calculate final total with shipping and discount
      const finalTotal = body.subtotal + body.shipping - body.discount;

      // Try to create order in database
      const order = await prisma.order.create({
        data: {
          orderNumber,
          email: body.email,
          phone: body.phone,
          guestFirstName: body.firstName,
          guestLastName: body.lastName,
          guestAddress: `${body.address}, ${body.city}, ${body.state} ${body.zipCode}, ${body.country}`,
          status: 'PENDING',
          paymentMethod: (body.paymentMethod || 'RAZORPAY') as any,
          paymentStatus: 'PENDING',
          subtotal: body.subtotal,
          shippingCost: body.shipping,
          discountAmount: body.discount,
          total: finalTotal,
          items: {
            create: body.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              product: {
                connect: { id: item.productId },
              },
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  images: true,
                },
              },
            },
          },
        },
      });

      // Return order details for confirmation
      return NextResponse.json(
        {
          success: true,
          order: {
            id: order.id,
            orderNumber: order.orderNumber,
            email: order.email,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt,
          },
        },
        { status: 201 }
      );
    } catch (dbError) {
      // Handle database errors gracefully - allow order creation to proceed in dev
      const isDbError =
        dbError instanceof Error &&
        (dbError.message.includes('Can\'t reach database') ||
          dbError.message.includes('PrismaClientInitializationError'));

      if (isDbError && process.env.NODE_ENV === 'development') {
        // In development without database, return success with demo order
        const finalTotal = body.subtotal + body.shipping - body.discount;
        return NextResponse.json(
          {
            success: true,
            order: {
              id: orderNumber.replace('ORD-', ''),
              orderNumber,
              email: body.email,
              total: finalTotal,
              status: 'PENDING',
              createdAt: new Date(),
            },
            _dev: 'Order created in demo mode (database unavailable)',
          },
          { status: 201 }
        );
      }

      throw dbError;
    }
  } catch (error) {
    console.error('Guest order creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/orders/guest - Track guest order by email and order number
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderNumber = searchParams.get('orderNumber');

    if (!email || !orderNumber) {
      return NextResponse.json(
        { error: 'Email and order number are required' },
        { status: 400 }
      );
    }

    try {
      const order = await prisma.order.findFirst({
        where: {
          email: email.toLowerCase(),
          orderNumber: orderNumber.toUpperCase(),
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  images: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          email: order.email,
          phone: order.phone,
          total: order.total,
          subtotal: order.subtotal,
          shippingCost: order.shippingCost,
          discountAmount: order.discountAmount,
          items: order.items,
          createdAt: order.createdAt,
        },
      });
    } catch (dbError) {
      // Handle database errors gracefully in development
      const isDbError =
        dbError instanceof Error &&
        (dbError.message.includes('Can\'t reach database') ||
          dbError.message.includes('PrismaClientInitializationError'));

      if (isDbError && process.env.NODE_ENV === 'development') {
        // In development, return demo order data
        return NextResponse.json({
          success: true,
          order: {
            id: 'demo-order-id',
            orderNumber: orderNumber.toUpperCase(),
            status: 'SHIPPED',
            paymentStatus: 'COMPLETED',
            email: email,
            phone: '9876543210',
            total: 2499,
            subtotal: 2000,
            shippingCost: 99,
            discountAmount: 0,
            items: [],
            createdAt: new Date(),
          },
          _dev: 'Demo order (database unavailable)',
        });
      }

      throw dbError;
    }
  } catch (error) {
    console.error('Guest order retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order' },
      { status: 500 }
    );
  }
}
