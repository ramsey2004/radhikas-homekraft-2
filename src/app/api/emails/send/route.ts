import { NextRequest, NextResponse } from 'next/server';
import { EmailService, prepareEmail, validateEmailVariables } from '@/lib/emailTemplateService';

// Mock email sending function (in production, use Resend, SendGrid, etc.)
async function sendEmailMock(to: string, subject: string, _html: string): Promise<{ id: string; sent: boolean }> {
  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log(`📧 Email sent to ${to}\n   Subject: ${subject}`);

  return {
    id: `msg_${Date.now()}`,
    sent: true,
  };
}

/**
 * POST /api/emails/send
 * Send email using template
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, templateId, variables, cc, bcc } = body;

    // Validate input
    if (!to || !templateId || !variables) {
      return NextResponse.json(
        { error: 'Missing required fields: to, templateId, variables' },
        { status: 400 },
      );
    }

    // Validate email format
    if (!String(to).match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Validate template variables
    const validation = validateEmailVariables(templateId, variables);
    if (!validation.valid) {
      return NextResponse.json(
        { error: `Missing required variables: ${validation.missing.join(', ')}` },
        { status: 400 },
      );
    }

    // Prepare email
    const email = prepareEmail({
      to,
      templateId,
      variables,
      cc,
      bcc,
    });

    // Send email
    const result = await sendEmailMock(email.to, email.subject, email.html);

    return NextResponse.json({ success: true, messageId: result.id }, { status: 200 });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

/**
 * POST /api/emails/send-order-confirmation
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  to: string,
  orderNumber: string,
  customerName: string,
  orderDate: string,
  totalAmount: number,
  itemCount: number,
  estimatedDelivery: string,
) {
  const payload = EmailService.createOrderConfirmationEmail(
    to,
    orderNumber,
    customerName,
    orderDate,
    totalAmount,
    itemCount,
    estimatedDelivery,
  );

  const email = prepareEmail(payload);
  return sendEmailMock(email.to, email.subject, email.html);
}

/**
 * POST /api/emails/send-shipping-notification
 * Send shipping notification email
 */
export async function sendShippingNotification(
  to: string,
  orderNumber: string,
  customerName: string,
  trackingNumber: string,
  carrier: string,
  estimatedDelivery: string,
  itemCount: number,
) {
  const payload = EmailService.createShippingNotificationEmail(
    to,
    orderNumber,
    customerName,
    trackingNumber,
    carrier,
    estimatedDelivery,
    itemCount,
  );

  const email = prepareEmail(payload);
  return sendEmailMock(email.to, email.subject, email.html);
}

/**
 * POST /api/emails/send-delivery-confirmation
 * Send delivery confirmation email
 */
export async function sendDeliveryConfirmation(
  to: string,
  orderNumber: string,
  customerName: string,
  deliveryDate: string,
  itemCount: number,
) {
  const payload = EmailService.createDeliveryConfirmationEmail(to, orderNumber, customerName, deliveryDate, itemCount);

  const email = prepareEmail(payload);
  return sendEmailMock(email.to, email.subject, email.html);
}

/**
 * POST /api/emails/send-low-stock-alert
 * Send low stock alert email
 */
export async function sendLowStockAlert(
  to: string,
  productName: string,
  currentStock: number,
  reorderLevel: number,
  sku: string,
  supplier: string,
  urgency: 'low' | 'medium' | 'high' | 'critical',
) {
  const payload = EmailService.createLowStockAlertEmail(
    to,
    productName,
    currentStock,
    reorderLevel,
    sku,
    supplier,
    urgency,
  );

  const email = prepareEmail(payload);
  return sendEmailMock(email.to, email.subject, email.html);
}

/**
 * POST /api/emails/send-inquiry-response
 * Send inquiry response email
 */
export async function sendInquiryResponse(
  to: string,
  customerName: string,
  inquirySubject: string,
  response: string,
  supportEmail: string,
  referenceNumber: string,
) {
  const payload = EmailService.createInquiryResponseEmail(
    to,
    customerName,
    inquirySubject,
    response,
    supportEmail,
    referenceNumber,
  );

  const email = prepareEmail(payload);
  return sendEmailMock(email.to, email.subject, email.html);
}

/**
 * POST /api/emails/send-review-request
 * Send review request email
 */
export async function sendReviewRequest(
  to: string,
  customerName: string,
  productName: string,
  orderNumber: string,
  reviewLink: string,
) {
  const payload = EmailService.createReviewRequestEmail(to, customerName, productName, orderNumber, reviewLink);

  const email = prepareEmail(payload);
  return sendEmailMock(email.to, email.subject, email.html);
}
