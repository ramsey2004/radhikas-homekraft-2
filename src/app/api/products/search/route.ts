import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products/search - Search and filter products
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const material = searchParams.get('material');
    const color = searchParams.get('color');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const isFeatured = searchParams.get('featured') === 'true';

    // Build where clause
    const where: any = {
      isActive: true,
    };

    // Search query
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { shortDescription: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (category) {
      where.category = {
        slug: category,
      };
    }

    // Price filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Material filter
    if (material) {
      where.material = { contains: material, mode: 'insensitive' };
    }

    // Color filter
    if (color) {
      where.color = { contains: color, mode: 'insensitive' };
    }

    // Featured filter
    if (isFeatured) {
      where.isFeatured = true;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sort field
    let orderBy: any = {};
    switch (sortBy) {
      case 'price':
        orderBy = { price: sortOrder };
        break;
      case 'name':
        orderBy = { name: sortOrder };
        break;
      case 'createdAt':
      default:
        orderBy = { createdAt: sortOrder };
        break;
    }

    // Fetch products
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map((product: any) => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / product.reviews.length
        : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.shortDescription || product.description,
        price: product.price,
        discountedPrice: product.discountedPrice,
        images: product.images,
        thumbnail: product.thumbnail,
        category: product.category,
        inventory: product.inventory,
        isFeatured: product.isFeatured,
        material: product.material,
        color: product.color,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
      };
    });

    // Get available filters (unique values)
    const availableFilters = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        material: true,
        color: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      distinct: ['material', 'color'],
    });

    const materials = [...new Set(availableFilters.map((p: any) => p.material).filter(Boolean))];
    const colors = [...new Set(availableFilters.map((p: any) => p.color).filter(Boolean))];
    const categories = [...new Map(
      availableFilters.map((p: any) => [p.category.slug, p.category])
    ).values()];

    return NextResponse.json({
      success: true,
      products: productsWithRating,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount,
      },
      filters: {
        materials,
        colors,
        categories,
      },
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
