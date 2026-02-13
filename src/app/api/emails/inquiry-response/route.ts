import { NextRequest, NextResponse } from 'next/server';
import { sendInquiryResponse } from '../send/route';

/**
 * POST /api/emails/inquiry-response
 * Send customer inquiry response email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, customerName, inquirySubject, response, supportEmail, referenceNumber } = body;

    // Validate required fields
    if (!to || !customerName || !inquirySubject || !response) {
      return NextResponse.json(
        { error: 'Missing required fields: to, customerName, inquirySubject, response' },
        { status: 400 },
      );
    }

    const result = await sendInquiryResponse(
      to,
      customerName,
      inquirySubject,
      response,
      supportEmail || 'support@radhikas-homecraft.com',
      referenceNumber || `REF-${Date.now()}`,
    );

    return NextResponse.json({ success: true, messageId: result.id }, { status: 200 });
  } catch (error) {
    console.error('Inquiry response email error:', error);
    return NextResponse.json({ error: 'Failed to send inquiry response email' }, { status: 500 });
  }
}
