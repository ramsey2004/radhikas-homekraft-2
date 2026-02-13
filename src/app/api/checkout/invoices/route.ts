import { NextRequest, NextResponse } from 'next/server';
import { generateInvoicePDF, sendInvoiceEmail } from '@/lib/payments';

/**
 * Invoice Management API
 * GET /api/checkout/invoices/:id/pdf - Download invoice PDF
 * POST /api/checkout/invoices/:id/send - Email invoice
 */

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const invoiceId = pathname.split('/')[4];

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID required' }, { status: 400 });
    }

    if (pathname.includes('/pdf')) {
      const pdf = await generateInvoicePDF(invoiceId);
      return new NextResponse(pdf, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="invoice-${invoiceId}.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  } catch (error) {
    console.error('Get invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to get invoice', details: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const invoiceId = pathname.split('/')[4];
    const body = await request.json();

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID required' }, { status: 400 });
    }

    if (pathname.includes('/send')) {
      const { recipientEmail } = body;
      const result = await sendInvoiceEmail(invoiceId, recipientEmail);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  } catch (error) {
    console.error('Send invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice', details: (error as Error).message },
      { status: 400 }
    );
  }
}
