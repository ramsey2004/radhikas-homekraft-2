import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const where = status === 'all' ? {} : { status };

    const reviews = await prisma.review.findMany({
      where,
      include: {
        product: { select: { name: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const formattedReviews = reviews.map((review: typeof reviews[0]) => ({
      id: review.id,
      productId: review.productId,
      productName: review.product.name,
      userName: review.user.name || 'Anonymous',
      rating: review.rating,
      comment: review.comment,
      status: review.status || 'approved',
      createdAt: review.createdAt,
      helpful: review.helpful,
    }));

    return NextResponse.json({
      success: true,
      reviews: formattedReviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
