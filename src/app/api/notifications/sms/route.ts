import { NextRequest, NextResponse } from 'next/server';
import { sendSMSNotification, subscribeSMSNotifications } from '@/lib/loyalty';

/**
 * SMS Notifications API
 * POST /api/notifications/sms - Send SMS
 * POST /api/notifications/sms/subscribe - SMS opt-in
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pathname = request.nextUrl.pathname;

    if (pathname.includes('/subscribe')) {
      // Subscribe to SMS
      const { userId, phoneNumber } = body;

      if (!userId || !phoneNumber) {
        return NextResponse.json(
          { error: 'User ID and phone number required' },
          { status: 400 }
        );
      }

      const result = await subscribeSMSNotifications(phoneNumber);
      return NextResponse.json(result, { status: 201 });
    }

    // Send SMS
    const { userId, phoneNumber, message } = body;

    if (!userId || !phoneNumber || !message) {
      return NextResponse.json(
        { error: 'User ID, phone number, and message required' },
        { status: 400 }
      );
    }

    const result = await sendSMSNotification(phoneNumber, message);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('SMS notification error:', error);
    return NextResponse.json(
      { error: 'Operation failed', details: (error as Error).message },
      { status: 400 }
    );
  }
}
