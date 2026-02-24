import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products/[slug] - Fetch product by slug
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            quantity: true,
            sku: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        productImages: {
          select: {
            id: true,
            url: true,
            altText: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Format reviews
    const formattedReviews = product.reviews.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      userName: review.user?.name || 'Anonymous',
      createdAt: review.createdAt.toISOString(),
    }));

    // Use productImages if available, fallback to images array
    const productImages = product.productImages.length > 0
      ? product.productImages.map((img: any) => img.url)
      : product.images;

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        discountedPrice: product.discountedPrice,
        images: productImages,
        thumbnail: product.thumbnail,
        sku: product.sku,
        material: product.material,
        color: product.color,
        dimensions: product.dimensions,
        weight: product.weight,
        inventory: product.inventory,
        category: product.category,
        variants: product.variants,
        reviews: formattedReviews,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
