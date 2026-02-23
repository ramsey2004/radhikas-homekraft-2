import { NextRequest, NextResponse } from 'next/server';
import { fetchAnalytics, exportOrders, generateInvoice } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/**
 * Admin Analytics & Exports API
 * GET /api/admin/analytics - Get business metrics
 * GET /api/admin/exports/orders - Export orders to CSV/Excel
 * GET /api/admin/invoices/:orderId - Generate order invoice
 */

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const searchParams = request.nextUrl.searchParams;

    // Analytics endpoint
    if (pathname.includes('/analytics')) {
      const analytics = await fetchAnalytics();

      return NextResponse.json(analytics);
    }

    // Exports endpoint
    if (pathname.includes('/exports')) {
      const format = searchParams.get('format') || 'csv';

      const data = await exportOrders(format as 'csv' | 'excel');

      const headers: Record<string, string> = {
        'Content-Type': format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv',
        'Content-Disposition': `attachment; filename="orders.${format === 'excel' ? 'xlsx' : 'csv'}"`,
      };

      return new NextResponse(data, {
        status: 200,
        headers,
      });
    }

    // Invoice endpoint
    if (pathname.includes('/invoices')) {
      const orderId = pathname.split('/')[4];

      if (!orderId) {
        return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
      }

      const invoice = await generateInvoice(orderId);
      return NextResponse.json(invoice);
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  } catch (error) {
    console.error('Admin analytics/export error:', error);
    return NextResponse.json(
      { error: 'Operation failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}
