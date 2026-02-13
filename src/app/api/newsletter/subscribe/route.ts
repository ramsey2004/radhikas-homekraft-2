import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage (in production, use a database)
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, preferences } = body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Add subscriber
    subscribers.add(email);

    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Integrate with email service (SendGrid, Mailchimp, etc.)
    
    console.log(`New subscriber: ${email}`, preferences);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed to newsletter',
        email 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return subscriber count (for admin dashboard)
  return NextResponse.json({
    subscriberCount: subscribers.size,
    message: 'Newsletter subscription API',
  });
}
