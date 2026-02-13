import { NextRequest, NextResponse } from 'next/server';
import { requestRefund, checkRefundStatus } from '@/lib/payments';

/**
 * Refund Management API
 * POST /api/checkout/refunds - Request refund
 * GET /api/checkout/refunds/:id - Check refund status
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, reason, amount } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const refund = await requestRefund(orderId, reason, amount);
    return NextResponse.json(refund, { status: 201 });
  } catch (error) {
    console.error('Request refund error:', error);
    return NextResponse.json(
      { error: 'Failed to request refund', details: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const refundId = searchParams.get('refundId');

    if (!refundId) {
      return NextResponse.json({ error: 'Refund ID required' }, { status: 400 });
    }

    const status = await checkRefundStatus(refundId);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Get refund status error:', error);
    return NextResponse.json(
      { error: 'Failed to get refund status', details: (error as Error).message },
      { status: 400 }
    );
  }
}
