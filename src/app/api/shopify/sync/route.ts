import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { initializeShopify } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

/**
 * Sync products from Shopify to MongoDB
 * POST /api/shopify/sync - Requires admin authentication
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const shopify = initializeShopify();
    if (!shopify) {
      return NextResponse.json(
        { error: 'Shopify not configured. Please set SHOPIFY_STORE_NAME and SHOPIFY_STOREFRONT_ACCESS_TOKEN' },
        { status: 400 }
      );
    }

    // Fetch products from Shopify
    const shopifyProducts = await shopify.getAllProducts(100);

    if (!shopifyProducts || shopifyProducts.length === 0) {
      return NextResponse.json(
        { error: 'No products found in Shopify store' },
        { status: 400 }
      );
    }

    let syncedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Sync each product to MongoDB
    for (const shopifyProduct of shopifyProducts) {
      try {
        const minPrice = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);
        const maxPrice = parseFloat(shopifyProduct.priceRange.maxVariantPrice.amount);

        // Check if product already exists
        const existingProduct = await prisma.product.findFirst({
          where: {
            slug: shopifyProduct.handle,
          },
        });

        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              name: shopifyProduct.title,
              description: shopifyProduct.description,
              price: minPrice,
              maxPrice: maxPrice !== minPrice ? maxPrice : undefined,
              sku: shopifyProduct.variants[0]?.sku,
              image: shopifyProduct.images[0]?.src,
              inventory: 999, // Shopify will handle inventory
              shopifyId: shopifyProduct.id,
              shopifyProductHandle: shopifyProduct.handle,
              isActive: true,
            },
          });
        } else {
          // Create new product
          await prisma.product.create({
            data: {
              name: shopifyProduct.title,
              slug: shopifyProduct.handle,
              description: shopifyProduct.description,
              price: minPrice,
              maxPrice: maxPrice !== minPrice ? maxPrice : undefined,
              sku: shopifyProduct.variants[0]?.sku || `SKU-${shopifyProduct.id}`,
              image: shopifyProduct.images[0]?.src,
              inventory: 999,
              shopifyId: shopifyProduct.id,
              shopifyProductHandle: shopifyProduct.handle,
              isActive: true,
            },
          });
        }

        syncedCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Failed to sync ${shopifyProduct.title}: ${(error as Error).message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${syncedCount} products from Shopify`,
      synced: syncedCount,
      errors: errorCount > 0 ? { count: errorCount, details: errors } : null,
      total: shopifyProducts.length,
    });
  } catch (error) {
    console.error('Product sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync products', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * Get sync status
 * GET /api/shopify/sync - Returns information about product sync
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const shopifyProducts = await prisma.product.count({
      where: { shopifyId: { not: null } },
    });

    const totalProducts = await prisma.product.count();

    return NextResponse.json({
      shopifySyncedProducts: shopifyProducts,
      totalProducts,
      syncPercentage: totalProducts > 0 ? ((shopifyProducts / totalProducts) * 100).toFixed(1) : 0,
      lastSyncNote: 'Run POST /api/shopify/sync to sync products from Shopify',
    });
  } catch (error) {
    console.error('Sync status error:', error);
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}
