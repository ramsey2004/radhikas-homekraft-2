import { NextRequest, NextResponse } from 'next/server';
import { availableRewards, redeemReward } from '@/lib/loyalty';

/**
 * Rewards API
 * GET /api/loyalty/rewards - Get available rewards
 * POST /api/loyalty/rewards/:id/redeem - Redeem reward
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const rewards = await availableRewards();
    return NextResponse.json(rewards);
  } catch (error) {
    console.error('Get rewards error:', error);
    return NextResponse.json(
      { error: 'Failed to get rewards', details: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pathname = request.nextUrl.pathname;
    const rewardId = pathname.split('/')[4];

    if (!rewardId) {
      return NextResponse.json({ error: 'Reward ID required' }, { status: 400 });
    }

    const { userId } = body;
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const result = await redeemReward(rewardId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Redeem reward error:', error);
    return NextResponse.json(
      { error: 'Failed to redeem reward', details: (error as Error).message },
      { status: 400 }
    );
  }
}
