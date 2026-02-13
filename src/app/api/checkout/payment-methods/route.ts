import { NextRequest, NextResponse } from 'next/server';
import {
  savePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
} from '@/lib/payments';

/**
 * Payment Methods API
 * POST /api/checkout/payment-methods - Save payment method
 * DELETE /api/checkout/payment-methods/:id - Delete payment method
 * PATCH /api/checkout/payment-methods/:id/default - Set as default
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, provider, token } = body;

    if (!userId || !type || !provider || !token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const method = await savePaymentMethod(provider as any, token);

    return NextResponse.json(method, { status: 201 });
  } catch (error) {
    console.error('Save payment method error:', error);
    return NextResponse.json(
      { error: 'Failed to save payment method', details: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const methodId = searchParams.get('methodId');

    if (!methodId) {
      return NextResponse.json(
        { error: 'Method ID required' },
        { status: 400 }
      );
    }

    await deletePaymentMethod(methodId);
    return NextResponse.json({ message: 'Payment method deleted' });
  } catch (error) {
    console.error('Delete payment method error:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment method', details: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const methodId = searchParams.get('methodId');

    if (!methodId) {
      return NextResponse.json(
        { error: 'Method ID required' },
        { status: 400 }
      );
    }

    const result = await setDefaultPaymentMethod(methodId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Set default payment method error:', error);
    return NextResponse.json(
      { error: 'Failed to set default payment method', details: (error as Error).message },
      { status: 400 }
    );
  }
}
