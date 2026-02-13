import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const analyticsSchema = z.object({
  eventType: z.enum(['PAGE_VIEW', 'PRODUCT_VIEW', 'ADD_TO_CART', 'REMOVE_FROM_CART', 'WISHLIST_ADD', 'WISHLIST_REMOVE', 'CHECKOUT_START', 'CHECKOUT_COMPLETE', 'PURCHASE', 'SEARCH', 'FILTER', 'REVIEW_SUBMIT', 'REVIEW_HELPFUL', 'CLICK', 'SCROLL']),
  eventName: z.string(),
  page: z.string().optional(),
  referer: z.string().optional(),
  productId: z.string().optional(),
  category: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// POST /api/analytics - Track analytics event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
   const validatedData = analyticsSchema.parse(body);

    // Get user agent and IP
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const referer = request.headers.get('referer') || validatedData.referer;

    // Find or create session
    let userId: string | undefined;
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      // In a real scenario, extract user from token
      // For now, we'll try to identify from session
      try {
        const sessionId = request.cookies.get('next-auth.session-token')?.value;
        if (sessionId) {
          // This is simplified - in production, properly decode/verify the token
          userId = undefined; // Would be extracted from token
        }
      } catch (e) {
        // Continue without user ID
      }
    }

    // Create analytics event
    const event = await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: validatedData.eventType,
        eventName: validatedData.eventName,
        page: validatedData.page,
        referer,
        userAgent,
        ipAddress: ip,
        productId: validatedData.productId,
        category: validatedData.category,
        metadata: validatedData.metadata ? JSON.stringify(validatedData.metadata) : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        eventId: event.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Analytics error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid analytics data' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to record analytics' },
      { status: 500 }
    );
  }
}

// GET /api/analytics/dashboard - Get analytics dashboard data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get event counts by type
    const eventStats = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where: { createdAt: { gte: startDate } },
      _count: true,
    });

    // Get top products viewed
    const topProducts = await prisma.analyticsEvent.groupBy({
      by: ['productId'],
      where: {
        createdAt: { gte: startDate },
        productId: { not: null },
      },
      _count: true,
      orderBy: { _count: { eventType: 'desc' } },
      take: 10,
    });

    // Get top categories
    const topCategories = await prisma.analyticsEvent.groupBy({
      by: ['category'],
      where: {
        createdAt: { gte: startDate },
        category: { not: null },
      },
      _count: true,
      orderBy: { _count: { eventType: 'desc' } },
      take: 10,
    });

    // Get conversion metrics
    const totalPageViews = await prisma.analyticsEvent.count({
      where: {
        createdAt: { gte: startDate },
        eventType: 'PAGE_VIEW',
      },
    });

    const totalPurchases = await prisma.analyticsEvent.count({
      where: {
        createdAt: { gte: startDate },
        eventType: 'PURCHASE',
      },
    });

    const conversionRate = totalPageViews > 0 
      ? ((totalPurchases / totalPageViews) * 100).toFixed(2)
      : '0.00';

    // Get device/browser stats
    const browserStats = await prisma.analyticsEvent.groupBy({
      by: ['userAgent'],
      where: { createdAt: { gte: startDate } },
      _count: true,
      orderBy: { _count: { userAgent: 'desc' } },
      take: 5,
    });

    const topBrowsers = browserStats.map(b => ({
      device: b.userAgent || 'unknown',
      count: b._count,
    }));

    return NextResponse.json({
      success: true,
      data: {
        period: { days, startDate },
        eventStats,
        topProducts,
        topCategories,
        metrics: {
          totalPageViews,
          totalPurchases,
          conversionRate: `${conversionRate}%`,
        },
        browsers: topBrowsers,
      },
    });
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
