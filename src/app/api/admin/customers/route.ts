import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customers = await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedCustomers = customers.map((customer: typeof customers[0]) => {
      const totalOrders = customer.orders.length;
      const totalSpent = customer.orders.reduce((sum: number, order: typeof customer.orders[0]) => sum + order.total, 0);
      const lastOrderDate = customer.orders.length > 0 
        ? customer.orders[0].createdAt 
        : customer.createdAt;

      // Segmentation logic
      let segmentation: 'regular' | 'vip' | 'at-risk' = 'regular';
      if (totalSpent > 50000) {
        segmentation = 'vip';
      } else if (totalOrders === 0 || new Date().getTime() - new Date(lastOrderDate).getTime() > 90 * 24 * 60 * 60 * 1000) {
        segmentation = 'at-risk';
      }

      return {
        id: customer.id,
        name: customer.name || 'Unknown',
        email: customer.email,
        totalOrders,
        totalSpent,
        lastOrderDate,
        joinDate: customer.createdAt,
        status: segmentation === 'at-risk' ? 'inactive' : 'active',
        segmentation,
      };
    });

    return NextResponse.json({
      success: true,
      customers: formattedCustomers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
