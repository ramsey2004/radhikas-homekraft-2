import nodemailer from 'nodemailer';
import { STORE_EMAIL, STORE_NAME } from './constants';

// Email templates
const templates = {
  welcome: (name: string) => ({
    subject: `Welcome to ${STORE_NAME}!`,
    html: `
      <h1>Welcome to ${STORE_NAME}!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for signing up! We're excited to have you as part of our community.</p>
      <p>Explore our handcrafted collection and discover authentic Indian handicrafts.</p>
      <p>Happy shopping!</p>
      <p>${STORE_NAME} Team</p>
    `,
  }),

  orderConfirmation: (orderNumber: string, total: number) => ({
    subject: `Order Confirmed - ${orderNumber}`,
    html: `
      <h1>Order Confirmed!</h1>
      <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
      <p>Order Total: <strong>₹${total.toLocaleString()}</strong></p>
      <p>You'll receive a shipping confirmation email once your items are dispatched.</p>
      <p>Track your order in your account dashboard.</p>
      <p>${STORE_NAME} Team</p>
    `,
  }),

  shipment: (orderNumber: string, trackingNumber: string, trackingUrl: string) => ({
    subject: `Your Order is on the Way! - ${orderNumber}`,
    html: `
      <h1>Your Order is Shipped!</h1>
      <p>Order <strong>${orderNumber}</strong> is on its way to you.</p>
      <p>Tracking Number: <strong>${trackingNumber}</strong></p>
      <p><a href="${trackingUrl}">Track your shipment</a></p>
      <p>${STORE_NAME} Team</p>
    `,
  }),

  delivery: (orderNumber: string) => ({
    subject: `Order Delivered - ${orderNumber}`,
    html: `
      <h1>Your Order Has Been Delivered!</h1>
      <p>Order <strong>${orderNumber}</strong> has been delivered.</p>
      <p>We hope you love your purchase!</p>
      <p>Please share your feedback by writing a review.</p>
      <p>${STORE_NAME} Team</p>
    `,
  }),

  passwordReset: (resetLink: string) => ({
    subject: 'Reset Your Password',
    html: `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>${STORE_NAME} Team</p>
    `,
  }),

  newsletter: (message: string) => ({
    subject: `${STORE_NAME} Newsletter`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        ${message}
        <p><small>You received this because you're subscribed to our newsletter.</small></p>
        <p>${STORE_NAME} Team</p>
      </div>
    `,
  }),
};

interface EmailPayload {
  to: string;
  template: keyof typeof templates;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export async function sendEmail({ to, template, data }: EmailPayload) {
  try {
    // Use environment variables for email configuration
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
      ...Object.values(data)
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
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Email queue for async processing
export async function queueEmail({ to, template, data }: EmailPayload) {
  // This would typically save to database for async processing
  // For now, we'll try to send directly
  return sendEmail({ to, template, data });
}
