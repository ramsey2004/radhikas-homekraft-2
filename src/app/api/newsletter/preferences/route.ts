import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, preferences } = body;

    // Validate
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate preferences object
    const validPreferences = {
      newsletter: preferences?.newsletter ?? true,
      promotions: preferences?.promotions ?? true,
      newProducts: preferences?.newProducts ?? true,
      weeklyDigest: preferences?.weeklyDigest ?? false,
      frequency: preferences?.frequency || 'weekly', // weekly, biweekly, monthly
    };

    // In production, you would:
    // 1. Find user in database
    // 2. Update their preferences
    // 3. Send confirmation email
    
    console.log(`Updated preferences for: ${email}`, validPreferences);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Preferences updated successfully',
        preferences: validPreferences
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // In production, fetch from database
    const preferences = {
      email,
      newsletter: true,
      promotions: true,
      newProducts: true,
      weeklyDigest: false,
      frequency: 'weekly',
    };

    return NextResponse.json(preferences, { status: 200 });
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}
