/**
 * Email Templates for Orders
 */

export const orderConfirmationTemplate = (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1A7A6E; color: #FAF3E0; padding: 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
    .order-details { background-color: white; padding: 15px; border-left: 4px solid #C9A84C; }
    .item { padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
    .total { font-size: 18px; font-weight: bold; color: #1A7A6E; padding: 15px; background-color: #C9A84C; margin-top: 15px; }
    .button { display: inline-block; background-color: #1A7A6E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Order Confirmed!</h1>
      <p>Thank you for your purchase, ${data.name}</p>
    </div>

    <div class="content">
      <p>We're delighted to confirm that your order has been received and is being prepared for shipment.</p>

      <div class="order-details">
        <h3 style="margin: 0 0 15px 0; color: #1A7A6E;">Order Information</h3>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
        <p><strong>Estimated Delivery:</strong> 5-7 business days</p>
      </div>

      <h3 style="color: #1A7A6E; margin-top: 20px;">Order Items</h3>
      ${data.items
        .map(
          (item: any) => `
        <div class="item">
          <span>${item.product?.name || 'Product'} x ${item.quantity}</span>
          <span>₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
        </div>
      `
        )
        .join('')}

      <div class="total">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Subtotal:</span>
          <span>₹${data.subtotal?.toLocaleString('en-IN') || '0'}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Total:</span>
          <span>₹${data.total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <h3 style="color: #1A7A6E; margin-top: 20px;">What's Next?</h3>
      <ul>
        <li>We'll process your order within 24 hours</li>
        <li>You'll receive a shipping confirmation with tracking details</li>
        <li>Free shipping on orders above ₹2000 ✓</li>
        <li>Easy returns within 30 days</li>
      </ul>

      <a href="${data.orderUrl}" class="button">Track Your Order</a>
    </div>

    <div class="footer">
      <p>Questions? Contact us at support@radhikashomecraft.com</p>
      <p>© Radhika's Homecraft. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const shipmentNotificationTemplate = (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1A7A6E; color: #FAF3E0; padding: 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .tracking-box { background-color: #C9A84C; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
    .tracking-number { font-size: 24px; font-weight: bold; color: #1A7A6E; }
    .button { display: inline-block; background-color: #1A7A6E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Your Order is On Its Way!</h1>
      <p>Order #${data.orderNumber}</p>
    </div>

    <p>Great news! Your order has been shipped and is on its way to you.</p>

    <div class="tracking-box">
      <p style="margin: 0 0 10px 0; color: #1A7A6E;">Track Your Shipment</p>
      <div class="tracking-number">${data.trackingNumber}</div>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #1A7A6E;">Use this number to track your package</p>
      <a href="${data.trackingUrl}" class="button">Track Now</a>
    </div>

    <h3 style="color: #1A7A6E;">Estimated Delivery</h3>
    <p>Your package should arrive within 5-7 business days. You can track its progress using the tracking number above.</p>

    <h3 style="color: #1A7A6E;">Questions?</h3>
    <p>For any questions or concerns about your order, please visit your order page or contact our customer support team.</p>

    <div class="footer">
      <p>Thank you for shopping with Radhika's Homecraft!</p>
      <p>© Radhika's Homecraft. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const refundTemplate = (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1A7A6E; color: #FAF3E0; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; background-color: #1A7A6E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Refund Processed</h1>
      <p>Order #${data.orderNumber}</p>
    </div>

    <div class="content">
      <p>Hello ${data.name},</p>
      <p>Your refund has been successfully processed.</p>

      <p><strong>Refund Amount:</strong> ₹${data.amount.toLocaleString('en-IN')}</p>
      <p><strong>Refund ID:</strong> ${data.refundId}</p>
      <p><strong>Refund Reason:</strong> ${data.reason}</p>

      <p>The refund will be credited to your original payment method within 5-7 business days.</p>
    </div>

    <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
      © Radhika's Homecraft
    </div>
  </div>
</body>
</html>
`;
