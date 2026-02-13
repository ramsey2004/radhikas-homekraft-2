import { NextRequest, NextResponse } from 'next/server';
import {
  getLoyaltyAccount,
  addLoyaltyPoints,
  redeemPoints,
  getPointsHistory,
  getTierBenefits,
} from '@/lib/loyalty';

/**
 * Loyalty Account API
 * GET /api/loyalty/account - Get user loyalty account
 * POST /api/loyalty/points - Add loyalty points
 * POST /api/loyalty/redeem - Redeem points
 * GET /api/loyalty/history - Points transaction history
 * GET /api/loyalty/tiers - Tier benefits
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
      // Points history
      const limit = parseInt(searchParams.get('limit') || '50');
      const history = await getPointsHistory(limit);
      return NextResponse.json(history);
    }

    if (pathname.includes('/tiers')) {
      // Tier benefits
      const benefits = await getTierBenefits();
      return NextResponse.json(benefits);
    }

    // Main loyalty account
    const account = await getLoyaltyAccount();
    return NextResponse.json(account);
  } catch (error) {
    console.error('Get loyalty account error:', error);
    return NextResponse.json(
      { error: 'Failed to get loyalty account', details: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pathname = request.nextUrl.pathname;
    const { userId, points, reason, orderId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    if (pathname.includes('/redeem')) {
      // Redeem points
      const { pointsToRedeem, rewardType } = body;
      const result = await redeemPoints(pointsToRedeem, rewardType);
      return NextResponse.json(result);
    }

    // Add points
    if (!points) {
      return NextResponse.json({ error: 'Points required' }, { status: 400 });
    }

    const result = await addLoyaltyPoints(points, reason, orderId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Loyalty points error:', error);
    return NextResponse.json(
      { error: 'Operation failed', details: (error as Error).message },
      { status: 400 }
    );
  }
}
