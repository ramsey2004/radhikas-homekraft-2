import nodemailer from 'nodemailer';
import { STORE_EMAIL, STORE_NAME } from './constants';

// Email templates
const templates = {
  welcome: (name: string) => ({
    subject: `Welcome to ${STORE_NAME}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to ${STORE_NAME}!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for signing up! We&apos;re excited to have you as part of our community of handcraft enthusiasts.</p>
        <h3>What to Expect:</h3>
        <ul>
          <li>Authentic Indian handcraft products</li>
          <li>Support for traditional artisans</li>
          <li>Exclusive member discounts</li>
          <li>Personalized recommendations</li>
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #8b4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Start Shopping</a></p>
        <p>Best regards,<br/>${STORE_NAME} Team</p>
      </div>
    `,
  }),

  orderConfirmation: (orderNumber: string, total: number, items: any[]) => ({
    subject: `Order Confirmed - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmed!</h1>
        <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
        <h3>Order Summary:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ddd;">
            <th style="text-align: left; padding: 8px;">Item</th>
            <th style="text-align: right; padding: 8px;">Qty</th>
            <th style="text-align: right; padding: 8px;">Price</th>
          </tr>
          ${items.map(item => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 8px;">${item.productName} (${item.productId})</td>
              <td style="text-align: right; padding: 8px;">${item.quantity}</td>
              <td style="text-align: right; padding: 8px;">₹${item.price.toLocaleString()}</td>
            </tr>
          `).join('')}
        </table>
        <p style="margin-top: 16px; font-size: 18px; font-weight: bold;">Order Total: ₹${total.toLocaleString()}</p>
        <p>You&apos;ll receive a shipping confirmation email as soon as your items are dispatched.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" style="background-color: #8b4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Track Your Order</a></p>
        <p>Thank you for shopping with ${STORE_NAME}!</p>
      </div>
    `,
  }),

  shipment: (orderNumber: string, trackingNumber: string, trackingUrl: string) => ({
    subject: `Your Order is on the Way! - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Your Order is Shipped!</h1>
        <p>Order <strong>${orderNumber}</strong> is on its way to you.</p>
        <div style="background-color: #f5f5f5; padding: 16px; border-radius: 4px; margin: 16px 0;">
          <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          <p><strong>Status:</strong> In Transit</p>
        </div>
        <p><a href="${trackingUrl}" style="background-color: #8b4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Track Your Shipment</a></p>
        <p>Typically, delivery takes 5-7 business days. Thank you for your patience!</p>
        <p>Best regards,<br/>${STORE_NAME} Team</p>
      </div>
    `,
  }),

  delivery: (orderNumber: string) => ({
    subject: `Order Delivered - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Your Order Has Been Delivered!</h1>
        <p>Order <strong>${orderNumber}</strong> has been delivered to your address.</p>
        <p>We hope you absolutely love your purchase!</p>
        <h3>Next Steps:</h3>
        <ul>
          <li>Unpack and enjoy your handcrafted product</li>
          <li>Share photos of your new items on social media</li>
          <li><a href="${process.env.NEXT_PUBLIC_APP_URL}/shop">Browse more items</a></li>
          <li><a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderNumber}/review">Leave a review</a></li>
        </ul>
        <p>If you have any questions or concerns, don&apos;t hesitate to <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact">contact us</a>.</p>
        <p>Thank you for supporting traditional artisans!<br/>${STORE_NAME} Team</p>
      </div>
    `,
  }),

  contactReply: (name: string, message: string) => ({
    subject: `We Received Your Message - ${STORE_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Thank You for Contacting Us!</h1>
        <p>Hi ${name},</p>
        <p>We&apos;ve received your message and will get back to you as soon as possible, typically within 24-48 hours.</p>
        <div style="background-color: #f5f5f5; padding: 16px; border-radius: 4px; margin: 16px 0;">
          <p><strong>Your Message:</strong></p>
          <p>${message}</p>
        </div>
        <p>In the meantime, you can:</p>
        <ul>
          <li><a href="${process.env.NEXT_PUBLIC_APP_URL}/shop">Browse our collection</a></li>
          <li><a href="${process.env.NEXT_PUBLIC_APP_URL}/about">Learn more about us</a></li>
          <li><a href="${process.env.NEXT_PUBLIC_APP_URL}/contact">View FAQs</a></li>
        </ul>
        <p>Best regards,<br/>${STORE_NAME} Team</p>
      </div>
    `,
  }),

  passwordReset: (resetLink: string, expiresIn: string) => ({
    subject: `Reset Your Password - ${STORE_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>We received a request to reset your password.</p>
        <p><a href="${resetLink}" style="background-color: #8b4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Your Password</a></p>
        <p style="color: #666; font-size: 12px;">This link will expire in ${expiresIn}. If you didn&apos;t request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br/>${STORE_NAME} Team</p>
      </div>
    `,
  }),

  reviewReminder: (orderNumber: string, productName: string) => ({
    subject: `Share Your Thoughts - ${STORE_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">How was your experience?</h1>
        <p>We hope you&apos;re enjoying your <strong>${productName}</strong>!</p>
        <p>Your feedback helps other customers discover amazing handcrafted products and supports our artisan community.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderNumber}/review" style="background-color: #8b4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Write a Review</a></p>
        <p>Sharing your experience takes just 2 minutes!</p>
        <p>Thank you,<br/>${STORE_NAME} Team</p>
      </div>
    `,
  }),

  paymentFailed: (orderNumber: string, retryLink: string) => ({
    subject: `Payment Failed - Action Required - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d32f2f;">Payment Failed</h1>
        <p>We encountered an issue processing your payment for order <strong>${orderNumber}</strong>.</p>
        <p>This could be due to:</p>
        <ul>
          <li>Insufficient funds</li>
          <li>Card expiration</li>
          <li>Incorrect card details</li>
          <li>Temporary network issue</li>
        </ul>
        <p>Please try again with a different payment method or card.</p>
        <p><a href="${retryLink}" style="background-color: #8b4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Retry Payment</a></p>
        <p>If you continue experiencing issues, please <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact">contact us</a> for assistance.</p>
        <p>Best regards,<br/>${STORE_NAME} Team</p>
      </div>
    `,
  }),
};

export async function sendEmail({
  to,
  template,
  data,
}: {
  to: string;
  template: keyof typeof templates;
  data?: Record<string, any>;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const templateFunction = templates[template] as (...args: any[]) => { subject: string; html: string };
    if (!templateFunction) {
      throw new Error(`Unknown email template: ${template}`);
    }

    const { subject, html } = templateFunction(
      ...Object.values(data || {})
    );

    const result = await transporter.sendMail({
      from: `${STORE_NAME} <${STORE_EMAIL}>`,
      to,
      subject,
      html,
    });

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: 'Failed to send email',
    };
  }
}
