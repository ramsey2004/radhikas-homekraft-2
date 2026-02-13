import { NextRequest, NextResponse } from 'next/server';
import { sendReviewRequest } from '../send/route';

/**
 * POST /api/emails/review-request
 * Send review request email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, customerName, productName, orderNumber, reviewLink } = body;

    // Validate required fields
    if (!to || !customerName || !productName) {
      return NextResponse.json(
        { error: 'Missing required fields: to, customerName, productName' },
        { status: 400 },
      );
    }

    const result = await sendReviewRequest(
      to,
      customerName,
      productName,
      orderNumber || 'ORD-12345',
      reviewLink || 'https://radhikas-homecraft.com/reviews',
    );

    return NextResponse.json({ success: true, messageId: result.id }, { status: 200 });
  } catch (error) {
    console.error('Review request email error:', error);
    return NextResponse.json({ error: 'Failed to send review request email' }, { status: 500 });
  }
}
