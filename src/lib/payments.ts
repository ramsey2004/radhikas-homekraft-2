/**
 * Payment & Checkout System
 * Stripe & Razorpay Integration, Order Processing
 */

export type PaymentProvider = 'stripe' | 'razorpay';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  provider: PaymentProvider;
  isDefault: boolean;
  masked: string; // Last 4 digits for cards, UPI ID for UPI
  expiresAt?: Date;
}

export interface CheckoutSession {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  paymentProvider: PaymentProvider;
  paymentIntentId?: string;
  razorpayOrderId?: string;
  status: PaymentStatus;
  attemptCount: number;
  lastAttemptAt?: Date;
  completedAt?: Date;
  customer: {
    email: string;
    name: string;
    phone: string;
  };
  items: { name: string; amount: number; quantity: number }[];
}

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid';
  amount: number;
  tax: number;
  total: number;
  issuedDate: Date;
  dueDate: Date;
  paidDate?: Date;
  items: { description: string; quantity: number; unitPrice: number; amount: number }[];
  notes?: string;
}

export interface Refund {
  id: string;
  orderId: string;
  paymentIntentId: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed';
  reason: string;
  requestedAt: Date;
  processedAt?: Date;
  notes?: string;
}

// Stripe functions
export async function initializeStripeCheckout(cartItems: any[], shippingAddress: any): Promise<{ sessionId: string; clientSecret: string }> {
  const response = await fetch('/api/checkout/stripe/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItems, shippingAddress }),
  });
  if (!response.ok) throw new Error('Failed to initialize Stripe checkout');
  return response.json();
}

export async function confirmStripePayment(clientSecret: string, paymentMethod: string): Promise<{ status: string; orderId: string }> {
  const response = await fetch('/api/checkout/stripe/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientSecret, paymentMethod }),
  });
  if (!response.ok) throw new Error('Failed to confirm payment');
  return response.json();
}

// Razorpay functions
export async function initializeRazorpayCheckout(cartItems: any[], shippingAddress: any): Promise<{ orderId: string; orderKey: string }> {
  const response = await fetch('/api/checkout/razorpay/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItems, shippingAddress }),
  });
  if (!response.ok) throw new Error('Failed to initialize Razorpay checkout');
  return response.json();
}

export async function verifyRazorpayPayment(paymentId: string, orderId: string, signature: string): Promise<{ status: string; orderId: string }> {
  const response = await fetch('/api/checkout/razorpay/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, orderId, signature }),
  });
  if (!response.ok) throw new Error('Failed to verify payment');
  return response.json();
}

// Invoice functions
export async function generateInvoicePDF(orderId: string): Promise<Blob> {
  const response = await fetch(`/api/checkout/invoices/${orderId}/pdf`);
  if (!response.ok) throw new Error('Failed to generate invoice');
  return response.blob();
}

export async function sendInvoiceEmail(orderId: string, email: string): Promise<void> {
  const response = await fetch(`/api/checkout/invoices/${orderId}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error('Failed to send invoice');
}

// Refund functions
export async function requestRefund(orderId: string, reason: string, notes?: string): Promise<Refund> {
  const response = await fetch(`/api/checkout/refunds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, reason, notes }),
  });
  if (!response.ok) throw new Error('Failed to request refund');
  return response.json();
}

export async function checkRefundStatus(refundId: string): Promise<Refund> {
  const response = await fetch(`/api/checkout/refunds/${refundId}`);
  if (!response.ok) throw new Error('Failed to fetch refund status');
  return response.json();
}

// Payment method management
export async function savePaymentMethod(provider: PaymentProvider, token: string): Promise<PaymentMethod> {
  const response = await fetch('/api/checkout/payment-methods', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, token }),
  });
  if (!response.ok) throw new Error('Failed to save payment method');
  return response.json();
}

export async function deletePaymentMethod(paymentMethodId: string): Promise<void> {
  const response = await fetch(`/api/checkout/payment-methods/${paymentMethodId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete payment method');
}

export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
  const response = await fetch(`/api/checkout/payment-methods/${paymentMethodId}/default`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Failed to set default payment method');
  return response.json();
}
