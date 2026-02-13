import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const analyticsSchema = z.object({
  eventType: z.enum([
    'PAGE_VIEW',
    'PRODUCT_VIEW',
    'ADD_TO_CART',
    'REMOVE_FROM_CART',
    'WISHLIST_ADD',
    'WISHLIST_REMOVE',
    'CHECKOUT_START',
    'CHECKOUT_COMPLETE',
    'PURCHASE',
    'SEARCH',
    'FILTER',
    'REVIEW_SUBMIT',
    'REVIEW_HELPFUL',
    'CLICK',
    'SCROLL',
  ]),
  eventName: z.string(),
  page: z.string().optional(),
  productId: z.string().optional(),
  category: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// POST /api/analytics - Track user events
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const validatedData = analyticsSchema.parse(body);

    const referer = request.headers.get('referer') || '';
    const userAgent = request.headers.get('user-agent') || '';

    // Get client IP
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      request.ip ||
      '';

    // Get user ID from session email
    let userId: string | undefined;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id;
    }

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
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid event data', issues: error.issues }, { status: 400 });
    }
    console.error('Error tracking analytics event:', error);
    // Don't fail the user's action if analytics fails
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track event',
      },
      { status: 500 }
    );
  }
}

// GET /api/analytics/stats - Get analytics statistics (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin (you can add an isAdmin role to User model)
    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Event type distribution
    const eventTypeStats = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where,
      _count: true,
    });

    // Top products viewed
    const topProducts = await prisma.analyticsEvent.groupBy({
      by: ['productId'],
      where: {
        ...where,
        eventType: 'PRODUCT_VIEW',
        productId: { not: null },
      },
      _count: true,
      orderBy: { _count: { productId: 'desc' } },
      take: 10,
    });

    // Conversion funnel
    const funnelStages = await Promise.all([
      prisma.analyticsEvent.count({
        where: { ...where, eventType: 'PAGE_VIEW' },
      }),
      prisma.analyticsEvent.count({
        where: { ...where, eventType: 'PRODUCT_VIEW' },
      }),
      prisma.analyticsEvent.count({
        where: { ...where, eventType: 'ADD_TO_CART' },
      }),
      prisma.analyticsEvent.count({
        where: { ...where, eventType: 'CHECKOUT_START' },
      }),
      prisma.analyticsEvent.count({
        where: { ...where, eventType: 'PURCHASE' },
      }),
    ]);

    // Unique users
    const uniqueUsers = await prisma.analyticsEvent.findMany({
      where: { ...where, userId: { not: null } },
      distinct: ['userId'],
      select: { userId: true },
    });

    // Top categories
    const topCategories = await prisma.analyticsEvent.groupBy({
      by: ['category'],
      where: {
        ...where,
        category: { not: null },
      },
      _count: true,
      orderBy: { _count: { category: 'desc' } },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      stats: {
        eventTypes: eventTypeStats,
        topProducts,
        topCategories,
        conversionFunnel: {
          pageViews: funnelStages[0],
          productViews: funnelStages[1],
          addToCart: funnelStages[2],
          checkoutStart: funnelStages[3],
          purchases: funnelStages[4],
        },
        uniqueUsers: uniqueUsers.length,
        conversionRate: funnelStages[4] > 0 ? ((funnelStages[4] / funnelStages[0]) * 100).toFixed(2) : '0.00',
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
