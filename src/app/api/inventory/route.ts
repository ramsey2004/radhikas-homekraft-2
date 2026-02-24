import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/inventory - Get inventory status for all products
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const lowStock = searchParams.get('lowStock') === 'true';
    const categoryId = searchParams.get('categoryId');

    // Build where clause
    const where: any = {};

    if (lowStock) {
      where.inventory = { lte: 10 }; // Low stock threshold
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Fetch products with inventory info
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
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
        orderItems: {
          where: {
            order: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          },
          select: {
            quantity: true,
          },
        },
      },
      orderBy: {
        inventory: 'asc',
      },
    });

    // Calculate metrics
    const inventoryData = products.map((product) => {
      const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const variantStock = product.variants.reduce((sum, v) => sum + v.quantity, 0);
      const totalStock = product.inventory + variantStock;

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        slug: product.slug,
        category: product.category.name,
        inventory: product.inventory,
        variantStock,
        totalStock,
        price: product.price,
        soldLast30Days: totalSold,
        status:
          totalStock === 0
            ? 'out_of_stock'
            : totalStock <= 5
            ? 'critical'
            : totalStock <= 10
            ? 'low'
            : 'in_stock',
        variants: product.variants,
      };
    });

    // Calculate summary stats
    const summary = {
      totalProducts: inventoryData.length,
      outOfStock: inventoryData.filter((p) => p.status === 'out_of_stock').length,
      lowStock: inventoryData.filter((p) => p.status === 'low' || p.status === 'critical').length,
      totalValue: inventoryData.reduce((sum, p) => sum + p.totalStock * p.price, 0),
      totalUnits: inventoryData.reduce((sum, p) => sum + p.totalStock, 0),
    };

    return NextResponse.json({
      success: true,
      inventory: inventoryData,
      summary,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

/**
 * PUT /api/inventory - Update inventory for a product
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { productId, inventory, variantUpdates, operation = 'set' } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Update main product inventory
    if (inventory !== undefined) {
      let newInventory = inventory;

      if (operation === 'increment') {
        newInventory = { increment: inventory };
      } else if (operation === 'decrement') {
        newInventory = { decrement: inventory };
      }

      await prisma.product.update({
        where: { id: productId },
        data: { inventory: newInventory },
      });
    }

    // Update variant inventories
    if (variantUpdates && Array.isArray(variantUpdates)) {
      for (const variantUpdate of variantUpdates) {
        const { variantId, quantity } = variantUpdate;
        
        let newQuantity = quantity;

        if (operation === 'increment') {
          newQuantity = { increment: quantity };
        } else if (operation === 'decrement') {
          newQuantity = { decrement: quantity };
        }

        await prisma.productVariant.update({
          where: { id: variantId },
          data: { quantity: newQuantity },
        });
      }
    }

    // Fetch updated product
    const updatedProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}

/**
 * POST /api/inventory/adjust - Bulk inventory adjustment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { adjustments, reason } = body;

    if (!adjustments || !Array.isArray(adjustments)) {
      return NextResponse.json({ error: 'Adjustments array required' }, { status: 400 });
    }

    const results = [];

    for (const adjustment of adjustments) {
      const { productId, quantity, operation = 'set' } = adjustment;

      try {
        let updateData: any = {};

        if (operation === 'set') {
          updateData.inventory = quantity;
        } else if (operation === 'increment') {
          updateData.inventory = { increment: quantity };
        } else if (operation === 'decrement') {
          updateData.inventory = { decrement: Math.max(0, quantity) };
        }

        const updated = await prisma.product.update({
          where: { id: productId },
          data: updateData,
        });

        results.push({
          productId,
          success: true,
          newInventory: updated.inventory,
        });

        // Log the adjustment
        await prisma.analyticsEvent.create({
          data: {
            userId: user.id,
            eventType: 'INVENTORY_ADJUSTMENT',
            eventName: 'Inventory Adjusted',
            page: '/admin/inventory',
            metadata: JSON.stringify({
              productId,
              operation,
              quantity,
              reason: reason || 'Manual adjustment',
              previousInventory: updated.inventory - quantity,
              newInventory: updated.inventory,
            }),
          },
        });
      } catch (error) {
        results.push({
          productId,
          success: false,
          error: error instanceof Error ? error.message : 'Update failed',
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    return NextResponse.json({ error: 'Failed to adjust inventory' }, { status: 500 });
  }
}
