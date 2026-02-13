import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation } from '../send/route';

/**
 * POST /api/emails/order-confirmation
 * Quick endpoint to send order confirmation email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, orderNumber, customerName, orderDate, totalAmount, itemCount, estimatedDelivery } = body;

    // Validate required fields
    if (!to || !orderNumber || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields: to, orderNumber, customerName' },
        { status: 400 },
      );
    }

    const result = await sendOrderConfirmation(
      to,
      orderNumber,
      customerName,
      orderDate || new Date().toLocaleDateString('en-IN'),
      totalAmount || 0,
      itemCount || 0,
      estimatedDelivery || '5-7 business days',
    );

    return NextResponse.json({ success: true, messageId: result.id }, { status: 200 });
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return NextResponse.json({ error: 'Failed to send order confirmation email' }, { status: 500 });
  }
}
