import { NextRequest, NextResponse } from 'next/server';
import {
  getReferralProgram,
  generateReferralCode,
  trackReferral,
  getReferralHistory,
} from '@/lib/loyalty';

/**
 * Referral Program API
 * GET /api/referrals/program - Get referral status
 * POST /api/referrals/generate - Create referral code
 * POST /api/referrals/track - Track referred customer
 * GET /api/referrals/history - Referrals list
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pathname = request.nextUrl.pathname;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    if (pathname.includes('/history')) {
      // Referral history
      const history = await getReferralHistory();
      return NextResponse.json(history);
    }

    // Referral program status
    const program = await getReferralProgram();
    return NextResponse.json(program);
  } catch (error) {
    console.error('Get referral program error:', error);
    return NextResponse.json(
      { error: 'Failed to get referral program', details: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pathname = request.nextUrl.pathname;
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    if (pathname.includes('/generate')) {
      // Generate referral code
      const code = await generateReferralCode();
      return NextResponse.json(code, { status: 201 });
    }

    if (pathname.includes('/track')) {
      // Track referral
      const { referralCode, referredUserId } = body;
      const result = await trackReferral(referralCode, referredUserId);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  } catch (error) {
    console.error('Referral operation error:', error);
    return NextResponse.json(
      { error: 'Operation failed', details: (error as Error).message },
      { status: 400 }
    );
  }
}
