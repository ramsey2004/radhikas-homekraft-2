import { NextRequest, NextResponse } from 'next/server';
import { searchProducts, getAutocompleteSuggestions } from '@/lib/ecommerce';

export const dynamic = 'force-dynamic';

/**
 * Search API
 * GET /api/search - Full-text search with filters
 * GET /api/search/autocomplete - Search suggestions
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pathname = request.nextUrl.pathname;

    // Autocomplete endpoint
    if (pathname.includes('/autocomplete')) {
      const query = searchParams.get('q');

      if (!query || query.length < 2) {
        return NextResponse.json([]); // Return empty array if query too short
      }

      const suggestions = await getAutocompleteSuggestions(query);
      return NextResponse.json(suggestions);
    }

    // Full search endpoint
    const query = searchParams.get('q') || '';
    // Search filters could be added here in the future
    // const category = searchParams.get('category');
    // const minPrice = searchParams.get('minPrice');
    // const maxPrice = searchParams.get('maxPrice');
    // etc.

    const results = await searchProducts({
      query,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: (error as Error).message },
      { status: 400 }
    );
  }
}
