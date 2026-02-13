import { NextRequest, NextResponse } from 'next/server';
import {
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from '@/lib/ecommerce';

/**
 * Product Variants API
 * GET /api/products/:id/variants - Get product variants
 * POST /api/products/:id/variants - Create variant
 * PATCH /api/products/:id/variants/:variantId - Update variant
 * DELETE /api/products/:id/variants/:variantId - Delete variant
 */

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const productId = pathname.split('/')[3];

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const variants = await getProductVariants(productId);
    return NextResponse.json(variants);
  } catch (error) {
    console.error('Fetch variants error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variants', details: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pathname = request.nextUrl.pathname;
    const productId = pathname.split('/')[3];

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const variant = await createProductVariant(productId, body);
    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    console.error('Create variant error:', error);
    return NextResponse.json(
      { error: 'Failed to create variant', details: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const pathname = request.nextUrl.pathname;
    const productId = pathname.split('/')[3];
    const variantId = pathname.split('/')[5];

    if (!productId || !variantId) {
      return NextResponse.json(
        { error: 'Product ID and Variant ID required' },
        { status: 400 }
      );
    }

    const variant = await updateProductVariant(productId, variantId, body);
    return NextResponse.json(variant);
  } catch (error) {
    console.error('Update variant error:', error);
    return NextResponse.json(
      { error: 'Failed to update variant', details: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const productId = pathname.split('/')[3];
    const variantId = pathname.split('/')[5];

    if (!productId || !variantId) {
      return NextResponse.json(
        { error: 'Product ID and Variant ID required' },
        { status: 400 }
      );
    }

    await deleteProductVariant(productId, variantId);
    return NextResponse.json({ message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('Delete variant error:', error);
    return NextResponse.json(
      { error: 'Failed to delete variant', details: (error as Error).message },
      { status: 400 }
    );
  }
}
