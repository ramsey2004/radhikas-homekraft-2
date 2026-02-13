import { NextRequest, NextResponse } from 'next/server';
import { sendShippingNotification } from '../send/route';

/**
 * POST /api/emails/shipping-notification
 * Send shipping notification email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, orderNumber, customerName, trackingNumber, carrier, estimatedDelivery, itemCount } = body;

    // Validate required fields
    if (!to || !orderNumber || !customerName || !trackingNumber || !carrier) {
      return NextResponse.json(
        {
          error: 'Missing required fields: to, orderNumber, customerName, trackingNumber, carrier',
        },
        { status: 400 },
      );
    }

    const result = await sendShippingNotification(
      to,
      orderNumber,
      customerName,
      trackingNumber,
      carrier,
      estimatedDelivery || '3-5 business days',
      itemCount || 1,
    );

    return NextResponse.json({ success: true, messageId: result.id }, { status: 200 });
  } catch (error) {
    console.error('Shipping notification email error:', error);
    return NextResponse.json({ error: 'Failed to send shipping notification email' }, { status: 500 });
  }
}
