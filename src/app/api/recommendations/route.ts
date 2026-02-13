import { NextRequest, NextResponse } from 'next/server';
import {
  getProductRecommendations,
  getPersonalizedRecommendations,
  getTrendingProducts,
  getOftenBoughtTogether,
} from '@/lib/ecommerce';

/**
 * Recommendations API
 * GET /api/recommendations/products/:id - Similar products
 * GET /api/recommendations/personalized - Personalized recommendations
 * GET /api/recommendations/trending - Trending products
 * GET /api/recommendations/often-bought/:id - Often bought together
 */

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const searchParams = request.nextUrl.searchParams;
    const segment = pathname.split('/')[3];
    const productId = pathname.split('/')[4];
    const limit = parseInt(searchParams.get('limit') || '8');
    const userId = searchParams.get('userId');

    if (segment === 'products' && productId && productId !== 'undefined') {
      // Similar products
      const recommendations = await getProductRecommendations(productId, limit);
      return NextResponse.json(recommendations);
    }

    if (segment === 'personalized') {
      // Personalized recommendations
      if (!userId) {
        return NextResponse.json(
          { error: 'User ID required for personalized recommendations' },
          { status: 400 }
        );
      }
      const recommendations = await getPersonalizedRecommendations(limit);
      return NextResponse.json(recommendations);
    }

    if (segment === 'trending') {
      // Trending products
      const trending = await getTrendingProducts(limit);
      return NextResponse.json(trending);
    }

    if (segment === 'often-bought' && productId && productId !== 'undefined') {
      // Often bought together
      const recommendations = await getOftenBoughtTogether(productId);
      return NextResponse.json(recommendations);
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations', details: (error as Error).message },
      { status: 400 }
    );
  }
}
