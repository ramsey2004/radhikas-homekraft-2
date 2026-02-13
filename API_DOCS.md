# API Endpoints Documentation

## Overview
This document describes all API endpoints available in the e-commerce application. All endpoints are located in `/src/app/api/`.

## Base URL
```
Development: http://localhost:3003/api
Production: https://radhikashomecraft.com/api
```

## Authentication
Most endpoints require authentication via NextAuth.js. Include the session cookie in requests to authenticated endpoints.

---

## 1. Reviews API

### GET /api/reviews
Retrieve reviews for a specific product.

**Query Parameters:**
- `productId` (required) - Product ID to fetch reviews for
- `limit` (optional) - Number of reviews to return (default: 10)
- `offset` (optional) - Pagination offset

**Response:**
```json
{
  "success": true,
  "reviews": [
    {
      "id": "rev-123",
      "rating": 5,
      "comment": "Great product!",
      "createdAt": "2024-01-15T10:00:00Z",
      "helpful": 10,
      "unhelpful": 2,
      "user": {
        "name": "John Doe",
        "image": "https://..."
      }
    }
  ],
  "stats": [
    {
      "rating": 5,
      "_count": 45
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3003/api/reviews?productId=prod-123
```

---

### POST /api/reviews
Submit a new review for a product.

**Required Authentication:** Yes

**Request Body:**
```json
{
  "productId": "prod-123",
  "rating": 4,
  "comment": "Good quality, fast shipping"
}
```

**Validation:**
- `rating` must be between 1-5
- `comment` must be 10-1000 characters (optional)
- User must have purchased the product
- User can only review each product once

**Response:**
```json
{
  "success": true,
  "review": {
    "id": "rev-456",
    "productId": "prod-123",
    "userId": "user-123",
    "rating": 4,
    "comment": "Good quality, fast shipping",
    "verified": true,
    "helpful": 0,
    "unhelpful": 0,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3003/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod-123",
    "rating": 4,
    "comment": "Good quality, fast shipping"
  }'
```

---

### PUT /api/reviews/:id
Mark a review as helpful or unhelpful.

**Query Parameters:**
- `action` (required) - Either "helpful" or "unhelpful"

**Request Body:** (empty)

**Response:**
```json
{
  "success": true,
  "review": {
    "id": "rev-456",
    "helpful": 11,
    "unhelpful": 2
  }
}
```

**Example:**
```bash
curl -X PUT http://localhost:3003/api/reviews/rev-456?action=helpful
```

---

## 2. Orders API

### GET /api/orders
Retrieve all orders for the current user.

**Required Authentication:** Yes

**Query Parameters:**
- `status` (optional) - Filter by order status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `limit` (optional) - Number of orders per page (default: 10)
- `offset` (optional) - Pagination offset

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "ord-123",
      "orderNumber": "ORD-1705317600000-abc123",
      "status": "SHIPPED",
      "total": 4999.99,
      "createdAt": "2024-01-15T10:00:00Z",
      "items": [
        {
          "id": "item-456",
          "productId": "prod-123",
          "quantity": 2,
          "price": 2499.99,
          "product": {
            "title": "Premium Pillow",
            "image": "https://...",
            "slug": "premium-pillow"
          }
        }
      ]
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 10,
    "offset": 0,
    "pages": 2
  }
}
```

**Example:**
```bash
curl http://localhost:3003/api/orders?status=SHIPPED&limit=5
```

---

### GET /api/orders/:id
Get detailed information about a specific order.

**Required Authentication:** Yes

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "ord-123",
    "orderNumber": "ORD-1705317600000-abc123",
    "status": "SHIPPED",
    "paymentStatus": "COMPLETED",
    "paymentMethod": "razorpay",
    "total": 4999.99,
    "shippingTrackingNumber": "TRACK123456",
    "shippingEstimate": "2024-01-20T00:00:00Z",
    "createdAt": "2024-01-15T10:00:00Z",
    "items": [
      {
        "id": "item-456",
        "productId": "prod-123",
        "quantity": 2,
        "price": 2499.99,
        "product": {
          "id": "prod-123",
          "title": "Premium Pillow",
          "image": "https://...",
          "slug": "premium-pillow",
          "price": 2499.99
        }
      }
    ],
    "address": {
      "id": "addr-123",
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "MH",
      "pincode": "400001",
      "country": "India"
    },
    "paymentLogs": [
      {
        "id": "pay-789",
        "paymentGateway": "razorpay",
        "amount": 4999.99,
        "status": "COMPLETED",
        "gatewayTransactionId": "pay_123456789"
      }
    ]
  }
}
```

**Example:**
```bash
curl http://localhost:3003/api/orders/ord-123
```

---

### PUT /api/orders/:id
Update order status or shipping information.

**Required Authentication:** Yes (Admin can update status, Users can update shipping info)

**Request Body:**
```json
{
  "status": "SHIPPED",
  "shippingTrackingNumber": "TRACK123456",
  "shippingEstimate": "2024-01-20T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "ord-123",
    "orderNumber": "ORD-1705317600000-abc123",
    "status": "SHIPPED",
    "shippingTrackingNumber": "TRACK123456"
  }
}
```

---

### POST /api/orders/:id/cancel
Cancel a pending or processing order.

**Required Authentication:** Yes

**Request Body:** (empty)

**Note:** Can only cancel orders with status `PENDING` or `PROCESSING`

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "ord-123",
    "status": "CANCELLED"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3003/api/orders/ord-123/cancel
```

---

## 3. Checkout API

### POST /api/checkout
Create an order and initiate payment.

**Required Authentication:** Yes

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod-123",
      "quantity": 2,
      "price": 2499.99
    }
  ],
  "addressId": "addr-123",
  "paymentMethod": "razorpay",
  "discountCode": "SAVE20"
}
```

**Validation:**
- Items array cannot be empty
- Address must belong to the current user
- Payment method must be "razorpay", "stripe", or "cod"
- Product prices verified (within 10% of current price)

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "ord-123",
    "orderNumber": "ORD-1705317600000-abc123",
    "total": 4999.99,
    "status": "PENDING"
  },
  "payment": {
    "gateway": "razorpay",
    "orderId": "order_123456789",
    "amount": 499900,
    "currency": "INR",
    "receipt": "order-receipt-123"
  }
}
```

**Error Responses:**
```json
{
  "error": "Price for Premium Pillow has changed. Please refresh and try again.",
  "status": 400
}
```

**Example:**
```bash
curl -X POST http://localhost:3003/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod-123",
        "quantity": 2,
        "price": 2499.99
      }
    ],
    "addressId": "addr-123",
    "paymentMethod": "razorpay"
  }'
```

---

### PUT /api/checkout
Verify payment and complete the order.

**Request Body:**
```json
{
  "orderId": "ord-123",
  "paymentId": "pay_123456789",
  "signature": "signature_hash_here"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "ord-123",
    "orderNumber": "ORD-1705317600000-abc123",
    "status": "CONFIRMED",
    "paymentStatus": "COMPLETED"
  }
}
```

---

## 4. Image Upload API

### POST /api/upload
Upload an image file.

**Required Authentication:** Yes

**Form Data:**
- `file` (required) - Image file (JPEG, PNG, WebP, GIF)
- `productId` (optional) - Product ID to associate image with
- `altText` (optional) - Alt text for accessibility
- `caption` (optional) - Image caption
- `order` (optional) - Display order for multiple images

**Constraints:**
- File must be an image (image/*)
- Maximum file size: 5MB
- Supported formats: JPEG, PNG, WebP, GIF

**Response:**
```json
{
  "success": true,
  "url": "/uploads/1705317600000-abc123-image.jpg",
  "filename": "1705317600000-abc123-image.jpg",
  "productImage": {
    "id": "img-123",
    "productId": "prod-123",
    "url": "/uploads/1705317600000-abc123-image.jpg",
    "altText": "Premium Pillow",
    "caption": "Product main image",
    "order": 0
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3003/api/upload \
  -F "file=@image.jpg" \
  -F "productId=prod-123" \
  -F "altText=Premium Pillow" \
  -F "caption=Product main image" \
  -F "order=0"
```

---

### DELETE /api/upload
Delete an uploaded image.

**Required Authentication:** Yes

**Query Parameters:**
- `imageId` (required) - Product image ID to delete
- OR `filename` - Filename to delete

**Response:**
```json
{
  "success": true
}
```

**Example:**
```bash
curl -X DELETE http://localhost:3003/api/upload?imageId=img-123
```

---

## 5. Analytics API

### POST /api/analytics
Track user events and interactions.

**Request Body:**
```json
{
  "eventType": "PRODUCT_VIEW",
  "eventName": "Viewed Premium Pillow",
  "page": "/products/premium-pillow",
  "productId": "prod-123",
  "category": "Pillows",
  "metadata": {
    "source": "search",
    "duration": 5000
  }
}
```

**Valid Event Types:**
- PAGE_VIEW
- PRODUCT_VIEW
- ADD_TO_CART
- REMOVE_FROM_CART
- WISHLIST_ADD
- WISHLIST_REMOVE
- CHECKOUT_START
- CHECKOUT_COMPLETE
- PURCHASE
- SEARCH
- FILTER
- REVIEW_SUBMIT
- REVIEW_HELPFUL
- CLICK
- SCROLL

**Response:**
```json
{
  "success": true,
  "eventId": "evt-123"
}
```

**Example:**
```bash
curl -X POST http://localhost:3003/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "PRODUCT_VIEW",
    "eventName": "Viewed Premium Pillow",
    "page": "/products/premium-pillow",
    "productId": "prod-123"
  }'
```

---

### GET /api/analytics/stats
Get analytics statistics and reports.

**Required Authentication:** Yes (Admin only)

**Query Parameters:**
- `startDate` (optional) - ISO date string for start of period
- `endDate` (optional) - ISO date string for end of period

**Response:**
```json
{
  "success": true,
  "stats": {
    "eventTypes": [
      {
        "eventType": "PRODUCT_VIEW",
        "_count": 150
      }
    ],
    "topProducts": [
      {
        "productId": "prod-123",
        "_count": 45
      }
    ],
    "topCategories": [
      {
        "category": "Pillows",
        "_count": 120
      }
    ],
    "conversionFunnel": {
      "pageViews": 1000,
      "productViews": 500,
      "addToCart": 150,
      "checkoutStart": 75,
      "purchases": 45
    },
    "uniqueUsers": 450,
    "conversionRate": "4.50"
  }
}
```

**Example:**
```bash
curl http://localhost:3003/api/analytics/stats?startDate=2024-01-01&endDate=2024-01-31
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "status": 401
}
```

**404 Not Found:**
```json
{
  "error": "Product not found",
  "status": 404
}
```

**400 Bad Request:**
```json
{
  "error": "Invalid review data",
  "issues": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "number",
      "path": ["rating"]
    }
  ],
  "status": 400
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to create review",
  "status": 500
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. It's recommended to add rate limiting for production:
- Analytics API: 100 requests per minute per IP
- Checkout API: 10 requests per minute per user
- Reviews API: 5 requests per minute per user

---

## Integration Examples

### Vue 3/React Reviews Component
```javascript
// Fetch reviews
const response = await fetch(`/api/reviews?productId=${productId}`);
const data = await response.json();

// Submit review
const reviewResponse = await fetch('/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'prod-123',
    rating: 5,
    comment: 'Great product!'
  })
});
```

### Razorpay Payment Flow
```javascript
// 1. Create order
const orderResponse = await fetch('/api/checkout', {
  method: 'POST',
  body: JSON.stringify({ items, paymentMethod: 'razorpay' })
});
const { payment } = await orderResponse.json();

// 2. Open Razorpay modal
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: payment.amount,
  currency: payment.currency,
  order_id: payment.orderId,
  handler: async (response) => {
    // 3. Verify payment
    const verificationResponse = await fetch('/api/checkout', {
      method: 'PUT',
      body: JSON.stringify({
        orderId: order.id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature
      })
    });
  }
};
```

### Analytics Tracking
```javascript
// Track page view
fetch('/api/analytics', {
  method: 'POST',
  body: JSON.stringify({
    eventType: 'PAGE_VIEW',
    eventName: 'Home page viewed',
    page: '/'
  })
});

// Track product view
fetch('/api/analytics', {
  method: 'POST',
  body: JSON.stringify({
    eventType: 'PRODUCT_VIEW',
    eventName: 'Viewed Premium Pillow',
    page: `/products/${slug}`,
    productId: productId
  })
});
```

---

## Testing

Testing instructions for each endpoint are provided in the [MIGRATIONS.md](./MIGRATIONS.md) file.

---

## Support

For API issues, check:
1. Request body format and required fields
2. User authentication status
3. Server logs for detailed error messages
4. Database connection and status
