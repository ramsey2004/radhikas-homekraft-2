import { NextRequest, NextResponse } from 'next/server';
import { sendDeliveryConfirmation } from '../send/route';

/**
 * POST /api/emails/delivery-confirmation
 * Send delivery confirmation email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, orderNumber, customerName, deliveryDate, itemCount } = body;

    // Validate required fields
    if (!to || !orderNumber || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields: to, orderNumber, customerName' },
        { status: 400 },
      );
    }

    const result = await sendDeliveryConfirmation(
      to,
      orderNumber,
      customerName,
      deliveryDate || new Date().toLocaleDateString('en-IN'),
      itemCount || 1,
    );

    return NextResponse.json({ success: true, messageId: result.id }, { status: 200 });
  } catch (error) {
    console.error('Delivery confirmation email error:', error);
    return NextResponse.json({ error: 'Failed to send delivery confirmation email' }, { status: 500 });
  }
}
