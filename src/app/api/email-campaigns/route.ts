import { NextRequest, NextResponse } from 'next/server';
import {
  createEmailCampaign,
  sendEmailCampaign,
  getCampaignMetrics,
  subscribeToCampaigns,
  unsubscribeFromCampaigns,
} from '@/lib/loyalty';

/**
 * Email Campaign API
 * POST /api/email-campaigns - Create campaign
 * POST /api/email-campaigns/:id/send - Send campaign
 * GET /api/email-campaigns/:id/metrics - Campaign metrics
 * POST /api/email-campaigns/subscribe - Email opt-in
 * POST /api/email-campaigns/unsubscribe - Email opt-out
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pathname = request.nextUrl.pathname;

    if (pathname.includes('/subscribe')) {
      // Subscribe to campaigns
      const { userId, email } = body;
      const result = await subscribeToCampaigns(userId, email);
      return NextResponse.json(result, { status: 201 });
    }

    if (pathname.includes('/unsubscribe')) {
      // Unsubscribe from campaigns
      const { email } = body;
      const result = await unsubscribeFromCampaigns(email);
      return NextResponse.json(result);
    }

    if (pathname.includes('/send')) {
      // Send campaign
      const campaignId = pathname.split('/')[3];
      if (!campaignId) {
        return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
      }
      const result = await sendEmailCampaign(campaignId);
      return NextResponse.json(result);
    }

    // Create campaign
    const campaign = await createEmailCampaign(body);
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Email campaign error:', error);
    return NextResponse.json(
      { error: 'Operation failed', details: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const campaignId = pathname.split('/')[3];

    if (!campaignId || !pathname.includes('/metrics')) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    const metrics = await getCampaignMetrics(campaignId);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Get campaign metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to get metrics', details: (error as Error).message },
      { status: 400 }
    );
  }
}
