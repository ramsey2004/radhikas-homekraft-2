import { EmailTemplate, getEmailTemplate } from '@/data/email-templates';

export interface EmailPayload {
  to: string;
  templateId: string;
  variables: Record<string, string | number>;
  cc?: string[];
  bcc?: string[];
}

export interface RenderedEmail {
  to: string;
  subject: string;
  html: string;
  cc?: string[];
  bcc?: string[];
}

/**
 * Render email template by replacing variables with values
 * Supports {{variableName}} syntax
 */
export function renderEmailTemplate(template: EmailTemplate, variables: Record<string, string | number>): RenderedEmail {
  let html = template.template;
  let subject = template.subject;
  
  // Replace all variables in template and subject
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, String(value));
    subject = subject.replace(regex, String(value));
  });

  return {
    to: variables.to as string,
    subject,
    html,
  };
}

/**
 * Prepare email for sending
 */
export function prepareEmail(payload: EmailPayload): RenderedEmail {
  const template = getEmailTemplate(payload.templateId);
  
  if (!template) {
    throw new Error(`Email template not found: ${payload.templateId}`);
  }

  const variables = {
    ...payload.variables,
    to: payload.to,
  };

  const rendered = renderEmailTemplate(template, variables);

  return {
    ...rendered,
    cc: payload.cc,
    bcc: payload.bcc,
  };
}

/**
 * Validate email variables against template requirements
 */
export function validateEmailVariables(templateId: string, variables: Record<string, string | number>): {
  valid: boolean;
  missing: string[];
} {
  const template = getEmailTemplate(templateId);
  
  if (!template) {
    return { valid: false, missing: [templateId] };
  }

  const missing = template.variables.filter((v) => !(v in variables));
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Email service class for managing email operations
 */
export class EmailService {
  static readonly ORDER_CONFIRMATION = 'order-confirmation';
  static readonly SHIPPING_NOTIFICATION = 'shipping-notification';
  static readonly DELIVERY_CONFIRMATION = 'delivery-confirmation';
  static readonly LOW_STOCK_ALERT = 'low-stock-alert';
  static readonly CUSTOMER_INQUIRY_RESPONSE = 'customer-inquiry-response';
  static readonly REVIEW_REQUEST = 'review-request';

  /**
   * Create order confirmation email
   */
  static createOrderConfirmationEmail(
    to: string,
    orderNumber: string,
    customerName: string,
    orderDate: string,
    totalAmount: number,
    itemCount: number,
    estimatedDelivery: string,
  ): EmailPayload {
    return {
      to,
      templateId: this.ORDER_CONFIRMATION,
      variables: {
        orderNumber,
        customerName,
        orderDate,
        totalAmount,
        itemCount,
        estimatedDelivery,
      },
    };
  }

  /**
   * Create shipping notification email
   */
  static createShippingNotificationEmail(
    to: string,
    orderNumber: string,
    customerName: string,
    trackingNumber: string,
    carrier: string,
    estimatedDelivery: string,
    itemCount: number,
  ): EmailPayload {
    return {
      to,
      templateId: this.SHIPPING_NOTIFICATION,
      variables: {
        orderNumber,
        customerName,
        trackingNumber,
        carrier,
        estimatedDelivery,
        itemCount,
      },
    };
  }

  /**
   * Create delivery confirmation email
   */
  static createDeliveryConfirmationEmail(
    to: string,
    orderNumber: string,
    customerName: string,
    deliveryDate: string,
    itemCount: number,
  ): EmailPayload {
    return {
      to,
      templateId: this.DELIVERY_CONFIRMATION,
      variables: {
        orderNumber,
        customerName,
        deliveryDate,
        itemCount,
      },
    };
  }

  /**
   * Create low stock alert email
   */
  static createLowStockAlertEmail(
    to: string,
    productName: string,
    currentStock: number,
    reorderLevel: number,
    sku: string,
    supplier: string,
    urgency: 'low' | 'medium' | 'high' | 'critical',
  ): EmailPayload {
    return {
      to,
      templateId: this.LOW_STOCK_ALERT,
      variables: {
        productName,
        currentStock,
        reorderLevel,
        sku,
        supplier,
        urgency,
      },
    };
  }

  /**
   * Create customer inquiry response email
   */
  static createInquiryResponseEmail(
    to: string,
    customerName: string,
    inquirySubject: string,
    response: string,
    supportEmail: string,
    referenceNumber: string,
  ): EmailPayload {
    return {
      to,
      templateId: this.CUSTOMER_INQUIRY_RESPONSE,
      variables: {
        customerName,
        inquirySubject,
        response,
        supportEmail,
        referenceNumber,
      },
    };
  }

  /**
   * Create review request email
   */
  static createReviewRequestEmail(
    to: string,
    customerName: string,
    productName: string,
    orderNumber: string,
    reviewLink: string,
  ): EmailPayload {
    return {
      to,
      templateId: this.REVIEW_REQUEST,
      variables: {
        customerName,
        productName,
        orderNumber,
        reviewLink,
      },
    };
  }
}
