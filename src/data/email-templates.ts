export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'order' | 'shipping' | 'inventory' | 'inquiry' | 'promotional';
  template: string;
  variables: string[];
}

// Email template definitions with Handlebars-style variables
export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'order-confirmation',
    name: 'Order Confirmation',
    category: 'order',
    subject: 'Order Confirmation - {{orderNumber}}',
    variables: ['orderNumber', 'customerName', 'orderDate', 'totalAmount', 'itemCount', 'estimatedDelivery'],
    template: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { padding: 20px; border: 1px solid #e0e0e0; border-top: none; }
    .detail { margin: 15px 0; }
    .detail-label { font-weight: bold; color: #667eea; }
    .button { background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmation</h1>
      <p>Thank you for your purchase!</p>
    </div>
    <div class="content">
      <p>Hi {{customerName}},</p>
      <p>Your order has been successfully placed. Here are the details:</p>
      
      <div class="detail">
        <span class="detail-label">Order Number:</span> {{orderNumber}}
      </div>
      <div class="detail">
        <span class="detail-label">Order Date:</span> {{orderDate}}
      </div>
      <div class="detail">
        <span class="detail-label">Total Items:</span> {{itemCount}}
      </div>
      <div class="detail">
        <span class="detail-label">Total Amount:</span> ₹{{totalAmount}}
      </div>
      <div class="detail">
        <span class="detail-label">Estimated Delivery:</span> {{estimatedDelivery}}
      </div>
      
      <p>You will receive a shipping confirmation email once your order is dispatched.</p>
      <a href="https://radhikas-homecraft.com/orders/{{orderNumber}}" class="button">View Order Details</a>
      
      <p>If you have any questions, please reply to this email or contact our support team.</p>
      <p>Thank you for shopping with Radhika's Homecraft!</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Radhika's Homecraft. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  },
  {
    id: 'shipping-notification',
    name: 'Shipping Notification',
    category: 'shipping',
    subject: 'Your Order is on the Way - {{orderNumber}}',
    variables: ['orderNumber', 'customerName', 'trackingNumber', 'carrier', 'estimatedDelivery', 'itemCount'],
    template: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { padding: 20px; border: 1px solid #e0e0e0; border-top: none; }
    .tracking-box { background: #f0f4ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
    .tracking-label { font-weight: bold; color: #667eea; }
    .button { background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Shipped!</h1>
      <p>Your order is on the way</p>
    </div>
    <div class="content">
      <p>Hi {{customerName}},</p>
      <p>Great news! Your order ({{orderNumber}}) has been shipped and is on its way to you.</p>
      
      <div class="tracking-box">
        <p class="tracking-label">Tracking Information:</p>
        <p><strong>Carrier:</strong> {{carrier}}</p>
        <p><strong>Tracking Number:</strong> <code>{{trackingNumber}}</code></p>
        <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
        <p><strong>Items Shipped:</strong> {{itemCount}}</p>
      </div>
      
      <p>You can track your shipment using the tracking number above on the carrier's website.</p>
      <a href="https://radhikas-homecraft.com/track/{{trackingNumber}}" class="button">Track Your Order</a>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Thank you for your business!</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Radhika's Homecraft. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  },
  {
    id: 'delivery-confirmation',
    name: 'Delivery Confirmation',
    category: 'shipping',
    subject: 'Your Order Has Been Delivered - {{orderNumber}}',
    variables: ['orderNumber', 'customerName', 'deliveryDate', 'itemCount'],
    template: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #34a853 0%, #0d652d 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { padding: 20px; border: 1px solid #e0e0e0; border-top: none; }
    .detail { margin: 15px 0; }
    .detail-label { font-weight: bold; color: #34a853; }
    .button { background-color: #34a853; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Order Delivered</h1>
      <p>Your order has been successfully delivered</p>
    </div>
    <div class="content">
      <p>Hi {{customerName}},</p>
      <p>Excellent! Your order has been delivered. Thank you for your purchase!</p>
      
      <div class="detail">
        <span class="detail-label">Order Number:</span> {{orderNumber}}
      </div>
      <div class="detail">
        <span class="detail-label">Delivery Date:</span> {{deliveryDate}}
      </div>
      <div class="detail">
        <span class="detail-label">Items Delivered:</span> {{itemCount}}
      </div>
      
      <p>We hope you enjoy your new products! If you have any feedback or issues, please let us know.</p>
      <a href="https://radhikas-homecraft.com/reviews" class="button">Share Your Review</a>
      
      <p>Thank you for choosing Radhika's Homecraft!</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Radhika's Homecraft. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  },
  {
    id: 'low-stock-alert',
    name: 'Low Stock Alert',
    category: 'inventory',
    subject: 'Inventory Alert: {{productName}} Low Stock',
    variables: ['productName', 'currentStock', 'reorderLevel', 'sku', 'supplier', 'urgency'],
    template: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f57c00 0%, #e65100 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { padding: 20px; border: 1px solid #e0e0e0; border-top: none; }
    .alert-box { background: #fff3e0; padding: 15px; border-left: 4px solid #f57c00; margin: 20px 0; }
    .detail { margin: 10px 0; }
    .detail-label { font-weight: bold; color: #e65100; }
    .button { background-color: #f57c00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Low Stock Alert</h1>
      <p>Action Required</p>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>The following product has reached low stock levels:</p>
      
      <div class="alert-box">
        <div class="detail">
          <span class="detail-label">Product:</span> {{productName}}
        </div>
        <div class="detail">
          <span class="detail-label">SKU:</span> {{sku}}
        </div>
        <div class="detail">
          <span class="detail-label">Current Stock:</span> {{currentStock}} units
        </div>
        <div class="detail">
          <span class="detail-label">Reorder Level:</span> {{reorderLevel}} units
        </div>
        <div class="detail">
          <span class="detail-label">Supplier:</span> {{supplier}}
        </div>
        <div class="detail">
          <span class="detail-label">Urgency:</span> <strong>{{urgency}}</strong>
        </div>
      </div>
      
      <p>Please take action to reorder this product as soon as possible to avoid stockouts.</p>
      <a href="https://radhikas-homecraft.com/admin/inventory" class="button">Go to Inventory</a>
      
      <p>Best regards,<br>Radhika's Homecraft Admin</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Radhika's Homecraft. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  },
  {
    id: 'customer-inquiry-response',
    name: 'Customer Inquiry Response',
    category: 'inquiry',
    subject: 'Re: {{inquirySubject}}',
    variables: ['customerName', 'inquirySubject', 'response', 'supportEmail', 'referenceNumber'],
    template: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { padding: 20px; border: 1px solid #e0e0e0; border-top: none; }
    .response-box { background: #f9f9f9; padding: 15px; border: 1px solid #e0e0e0; margin: 20px 0; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>We're Here to Help</h1>
      <p>Your inquiry response</p>
    </div>
    <div class="content">
      <p>Hi {{customerName}},</p>
      <p>Thank you for reaching out to us. We appreciate your inquiry about "<strong>{{inquirySubject}}</strong>".</p>
      
      <div class="response-box">
        <p>{{response}}</p>
      </div>
      
      <p>If you have any further questions, please don't hesitate to contact us.</p>
      <p>Reference Number: <strong>{{referenceNumber}}</strong></p>
      <p>Contact us: <a href="mailto:{{supportEmail}}">{{supportEmail}}</a></p>
      
      <p>Best regards,<br>Radhika's Homecraft Support Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Radhika's Homecraft. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  },
  {
    id: 'review-request',
    name: 'Review Request',
    category: 'promotional',
    subject: 'Share Your Experience with {{productName}}',
    variables: ['customerName', 'productName', 'orderNumber', 'reviewLink'],
    template: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { padding: 20px; border: 1px solid #e0e0e0; border-top: none; }
    .button { background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⭐ Share Your Review</h1>
      <p>We'd love to hear what you think</p>
    </div>
    <div class="content">
      <p>Hi {{customerName}},</p>
      <p>We hope you're enjoying your {{productName}}! Your feedback helps other customers make informed choices.</p>
      
      <p>Would you be willing to share your experience with this product? It only takes a minute!</p>
      <a href="{{reviewLink}}" class="button">Write Your Review</a>
      
      <p>Thank you for supporting Radhika's Homecraft and our artisans!</p>
      <p>Order Reference: {{orderNumber}}</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Radhika's Homecraft. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  },
];

// Helper function to get template by ID
export function getEmailTemplate(templateId: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find((t) => t.id === templateId);
}

// Helper function to get templates by category
export function getEmailTemplatesByCategory(category: EmailTemplate['category']): EmailTemplate[] {
  return EMAIL_TEMPLATES.filter((t) => t.category === category);
}
