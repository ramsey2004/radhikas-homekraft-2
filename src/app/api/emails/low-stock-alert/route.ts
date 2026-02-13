import { NextRequest, NextResponse } from 'next/server';
import { sendLowStockAlert } from '../send/route';

/**
 * POST /api/emails/low-stock-alert
 * Send low stock alert email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, productName, currentStock, reorderLevel, sku, supplier, urgency } = body;

    // Validate required fields
    if (!to || !productName || !currentStock || !reorderLevel || !sku) {
      return NextResponse.json(
        { error: 'Missing required fields: to, productName, currentStock, reorderLevel, sku' },
        { status: 400 },
      );
    }

    const result = await sendLowStockAlert(
      to,
      productName,
      currentStock,
      reorderLevel,
      sku,
      supplier || 'N/A',
      urgency || 'medium',
    );

    return NextResponse.json({ success: true, messageId: result.id }, { status: 200 });
  } catch (error) {
    console.error('Low stock alert email error:', error);
    return NextResponse.json({ error: 'Failed to send low stock alert email' }, { status: 500 });
  }
}
