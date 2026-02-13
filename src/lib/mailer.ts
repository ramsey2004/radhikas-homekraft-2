import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: any[];
}

// Initialize transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  // Use Resend if available, otherwise use SMTP
  if (process.env.RESEND_API_KEY) {
    // Note: Resend requires their official SDK
    // For now, we'll use SMTP as fallback
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter;
}

export async function sendEmail(options: EmailOptions) {
  try {
    // Skip if no email configured
    if (!process.env.SMTP_USER && !process.env.RESEND_API_KEY) {
      console.log('Email service not configured. Email not sent:', {
        to: options.to,
        subject: options.subject,
      });
      return { success: true, message: 'Email service not configured' };
    }

    const transport = getTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || `${process.env.NEXT_PUBLIC_STORE_NAME} <noreply@radhikashomecraft.com>`,
      to: Array.isArray(options.to) ? options.to.join(',') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    };

    const info = await transport.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Email template helpers
export const emailTemplates = {
  orderConfirmation: (orderNumber: string, customerName: string, total: number) => ({
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <h2>Order Confirmed!</h2>
      <p>Hi ${customerName},</p>
      <p>Thank you for your order! Your order number is <strong>${orderNumber}</strong></p>
      <p>Total Amount: <strong>₹${total.toLocaleString('en-IN')}</strong></p>
      <p>You'll receive shipping updates via email.</p>
      <p>Best regards,<br />Radhika's Homecraft Team</p>
    `,
  }),

  shippingNotification: (orderNumber: string, trackingNumber: string) => ({
    subject: `Your order ${orderNumber} is on the way!`,
    html: `
      <h2>Your Order is Shipped!</h2>
      <p>Your order <strong>${orderNumber}</strong> has been shipped.</p>
      <p>Tracking Number: <strong>${trackingNumber}</strong></p>
      <p>Track your order to see estimated delivery date.</p>
      <p>Best regards,<br />Radhika's Homecraft Team</p>
    `,
  }),

  passwordReset: (resetLink: string) => ({
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br />Radhika's Homecraft Team</p>
    `,
  }),

  welcomeEmail: (customerName: string) => ({
    subject: 'Welcome to Radhika\'s Homecraft!',
    html: `
      <h2>Welcome ${customerName}!</h2>
      <p>Thank you for joining our community of craft lovers.</p>
      <p>Explore our authentic handcrafted products and discover traditional beauty in every piece.</p>
      <p><a href="https://radhikashomecraft.com">Start Shopping</a></p>
      <p>Best regards,<br />Radhika's Homecraft Team</p>
    `,
  }),

  contactReply: (name: string, _message: string) => ({
    subject: 'We received your message',
    html: `
      <h2>Thank you for contacting us!</h2>
      <p>Hi ${name},</p>
      <p>We received your message and will get back to you shortly.</p>
      <p>Our team typically responds within 24 hours.</p>
      <p>Best regards,<br />Radhika's Homecraft Team</p>
    `,
  }),
};
