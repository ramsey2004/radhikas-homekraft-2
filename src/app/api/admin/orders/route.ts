import { NextRequest, NextResponse } from 'next/server';
import { fetchOrders, updateOrderStatus } from '@/lib/admin';

/**
 * Admin Orders API
 * GET /api/admin/orders - Fetch orders with filters
 * PATCH /api/admin/orders/:id - Update order status
 * GET /api/admin/orders/:id/invoice - Generate invoice
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const orders = await fetchOrders({
      status: status || undefined,
      page,
      limit,
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status required' },
        { status: 400 }
      );
    }

    const order = await updateOrderStatus(orderId, status);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status', details: (error as Error).message },
      { status: 400 }
    );
  }
}
