# API Integration & Frontend Hooks Guide

## Overview
This document provides a complete reference for all implemented APIs and their corresponding React hooks.

---

## 1. Authentication & Profile

### API Endpoints

**GET /api/auth/profile**
- Retrieves current user's profile
- Returns: name, email, phone, image, emailVerified, role, createdAt
- Authentication: Required (session-based)

**PUT /api/auth/profile**
- Updates user profile information
- Accepts: name, phone, image
- Returns: Updated user object
- Authentication: Required

**POST /api/auth/change-password**
- Changes user password
- Accepts: oldPassword, newPassword, confirmPassword
- Validation: Min 8 chars, password must match confirmation
- Returns: Success message
- Authentication: Required

### React Hook

```typescript
import { useUserProfile } from '@/hooks/useUserProfile';

function ProfileComponent() {
  const { 
    profile, 
    loading, 
    error, 
    updateProfile 
  } = useUserProfile();

  const handleUpdate = async (name, phone) => {
    try {
      await updateProfile({ name, phone });
      // Profile updated successfully
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {profile && <p>Welcome, {profile.name}!</p>}
    </div>
  );
}
```

---

## 2. Image Upload

### API Endpoints

**POST /api/upload** (Single file)
- Accepts: FormData with file, optional productId
- Processing: Sharp optimization, format conversion, resizing
- Returns: { publicUrl, filename, width, height, size }
- Size Limit: 10MB per file

**POST /api/upload/batch** (Multiple files)
- Accepts: FormData with up to 10 files
- Returns: { successful: [...], failed: [...] }
- Individual error handling maintains upload for valid files

**DELETE /api/upload**
- Query params: filename OR imageId
- Deletes image from storage and database
- Returns: { success: true }

### React Hook

```typescript
import { useImageUpload } from '@/hooks/useImageUpload';

function ImageUploadComponent() {
  const {
    uploads,
    uploadedImages,
    uploadImage,
    uploadBatch,
    clearUploads,
    removeImage
  } = useImageUpload();

  // Single file upload
  const handleSingleUpload = async (file) => {
    const result = await uploadImage(file, productId);
    console.log(result.publicUrl); // /uploads/optimized-image.webp
  };

  // Batch upload
  const handleBatchUpload = async (files) => {
    const result = await uploadBatch(files, productId);
    console.log(result.successful); // Successfully uploaded images
    console.log(result.failed); // Failed uploads with errors
  };

  return (
    <div>
      {uploads.map((upload) => (
        <div key={upload.file}>
          <p>{upload.file}</p>
          <progress value={upload.progress} max={100} />
          <span>{upload.status}</span>
          {upload.error && <p style={{ color: 'red' }}>{upload.error}</p>}
        </div>
      ))}
      {uploadedImages.map((img) => (
        <div key={img.filename}>
          <img src={img.publicUrl} alt={img.filename} />
          <button onClick={() => removeImage(img.filename)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 3. Payment Processing

### API Endpoints

**POST /api/checkout** (Razorpay)
- Creates a payment order
- Accepts: amount, currency, receipt
- Returns: { orderId, amount, currency }
- Usage: Pass to Razorpay script

**PUT /api/checkout** (Razorpay Verification)
- Verifies payment signature
- Accepts: orderId, paymentId, signature
- Returns: { status, amount, method }
- Security: HMAC SHA256 verification

**POST /api/payment/stripe**
- Creates Stripe payment intent
- Accepts: amount, currency, metadata
- Returns: { id, clientSecret, amount, currency }
- Usage: Pass clientSecret to Stripe.js

**POST /api/webhooks/stripe**
- Handles Stripe webhook events
- Events: payment_intent.succeeded, payment_intent.payment_failed
- Auto-sends confirmation/failure emails
- Updates order status

### React Hook

```typescript
import { usePayment } from '@/hooks/usePayment';

function PaymentComponent() {
  const {
    isProcessing,
    error,
    processRazorpayPayment,
    processStripePayment
  } = usePayment();

  // Razorpay checkout
  const handleRazorpayPayment = async () => {
    try {
      await processRazorpayPayment(orderId, amount);
      // Payment handled by Razorpay popup
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  // Stripe checkout
  const handleStripePayment = async () => {
    try {
      await processStripePayment(clientSecret);
      // Use with Stripe Elements or Payment Element
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  return (
    <div>
      <button 
        onClick={handleRazorpayPayment} 
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

---

## 4. Order Tracking

### API Endpoints

**GET /api/tracking/{trackingNumber}**
- Retrieves order details by tracking number
- Returns:
  ```json
  {
    "orderNumber": "ORD-001",
    "status": "SHIPPED",
    "statusProgress": 60,
    "trackingNumber": "TRK-123456",
    "items": [...],
    "total": 5000,
    "events": [
      {
        "status": "CONFIRMED",
        "timestamp": "2025-01-15T10:00:00Z",
        "description": "Order confirmed and preparing for shipment",
        "location": "Warehouse, Delhi"
      },
      // ... more events
    ]
  }
  ```
- No authentication required (public endpoint)

**PUT /api/admin/orders/{orderId}/status**
- Updates order status (admin only)
- Accepts: status, trackingNumber, estimatedDelivery
- Sends email notification to customer
- Valid statuses: CONFIRMED, SHIPPED, IN_TRANSIT, DELIVERED, CANCELLED
- Authentication: Required (admin)

### React Hook

```typescript
import { useOrderTracking } from '@/hooks/useOrderTracking';

function TrackingComponent() {
  const {
    tracking,
    loading,
    error,
    fetchTracking,
    getStatusColor,
    getStatusIcon,
    formatDate
  } = useOrderTracking();

  useEffect(() => {
    fetchTracking('TRK-123456');
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {tracking && (
        <div>
          <h2>{tracking.orderNumber}</h2>
          <div>
            <div style={{ width: `${tracking.statusProgress}%`, background: 'green' }}>
              Progress: {tracking.statusProgress}%
            </div>
          </div>
          {tracking.events.map((event, idx) => (
            <div key={idx} style={getStatusColor(event.status)}>
              <span>{getStatusIcon(event.status)}</span>
              <h4>{event.status}</h4>
              <p>{formatDate(event.timestamp)}</p>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 5. Product Reviews

### API Endpoints

**POST /api/reviews**
- Submit a product review
- Accepts: productId, rating (1-5), title, comment
- Returns: Review object with user details
- Authentication: Required

**GET /api/reviews**
- Fetch reviews for a product
- Query: productId (optional, returns all if not specified)
- Returns: { reviews: [...], stats: { averageRating, totalReviews, ratingDistribution } }

**POST /api/reviews/{reviewId}/helpful**
- Mark review as helpful
- Increments helpful count
- Returns: Updated review

**DELETE /api/reviews/{reviewId}**
- Delete own review
- Returns: { success: true }
- Authentication: Required (own review)

### React Hook

```typescript
import { useReviews } from '@/hooks/useReviews';

function ReviewComponent() {
  const {
    reviews,
    stats,
    loading,
    error,
    submitReview,
    fetchProductReviews,
    markHelpful,
    deleteReview,
    getRatingPercentage
  } = useReviews();

  useEffect(() => {
    fetchProductReviews(productId);
  }, [productId]);

  const handleSubmitReview = async (rating, title, comment) => {
    try {
      await submitReview(productId, rating, title, comment);
      await fetchProductReviews(productId); // Refresh
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  return (
    <div>
      {stats && (
        <div>
          <h3>Average Rating: {stats.averageRating.toFixed(1)}</h3>
          <p>Total Reviews: {stats.totalReviews}</p>
          {[5,4,3,2,1].map(r => (
            <div key={r}>
              <span>{r} stars: {getRatingPercentage(r).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
      {reviews.map((review) => (
        <div key={review.id}>
          <p>{review.author?.name} - {review.rating}★</p>
          <h5>{review.title}</h5>
          <p>{review.comment}</p>
          <button onClick={() => markHelpful(review.id)}>
            Helpful ({review.helpful})
          </button>
          <button onClick={() => deleteReview(review.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 6. Wishlist

### API Endpoints

**POST /api/wishlist**
- Add product to wishlist
- Accepts: productId
- Returns: Wishlist item with product details
- Authentication: Required

**DELETE /api/wishlist/{productId}**
- Remove product from wishlist
- Returns: { success: true }
- Authentication: Required

**GET /api/wishlist**
- Get user's wishlist
- Returns: Array of wishlist items with product details
- Authentication: Required

### React Hook

```typescript
import { useWishlist } from '@/hooks/useWishlist';

function WishlistComponent() {
  const {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    moveToCart,
    itemCount
  } = useWishlist();

  return (
    <div>
      <p>Wishlist Items: {itemCount}</p>
      {wishlistItems.map((item) => (
        <div key={item.id}>
          <p>{item.product?.name}</p>
          <p>₹{item.product?.price}</p>
          <button 
            onClick={() => removeFromWishlist(item.productId)}
            disabled={loading}
          >
            Remove
          </button>
          <button 
            onClick={() => moveToCart(item.productId)}
            disabled={loading}
          >
            Move to Cart
          </button>
        </div>
      ))}
      <button onClick={clearWishlist}>Clear All</button>
    </div>
  );
}
```

---

## 7. Shopping Cart

### React Hook (Client-side only)

```typescript
import { useCart } from '@/hooks/useCart';

function CartComponent() {
  const {
    cart,
    summary,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    isEmpty,
    itemCount
  } = useCart();

  return (
    <div>
      <h2>Cart ({itemCount} items)</h2>
      {isEmpty ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.productId}>
              <p>{item.name}</p>
              <p>₹{item.price}</p>
              <div>
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
              </div>
              <button onClick={() => removeItem(item.productId)}>Remove</button>
            </div>
          ))}
          <div>
            <p>Subtotal: ₹{summary.subtotal}</p>
            <p>Tax (18%): ₹{summary.tax}</p>
            <p>Shipping: ₹{summary.shipping}</p>
            <h3>Total: ₹{summary.total}</h3>
          </div>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
}
```

---

## 8. Analytics

### API Endpoints

**GET /api/analytics/dashboard**
- Fetch analytics metrics
- Query: days (default: 30)
- Returns:
  ```json
  {
    "period": {
      "from": "2025-01-15T00:00:00Z",
      "to": "2025-02-15T00:00:00Z",
      "daysIncluded": 30
    },
    "eventStats": [
      { "type": "PAGE_VIEW", "count": 1000 },
      { "type": "PURCHASE", "count": 25 }
    ],
    "topProducts": [
      { "productId": "...", "productName": "...", "viewCount": 100 }
    ],
    "topCategories": [
      { "category": "Textiles", "viewCount": 500 }
    ],
    "conversion": {
      "totalViews": 10000,
      "totalPurchases": 250,
      "conversionRate": 0.025
    },
    "deviceStats": [
      { "device": "Mozilla/5.0...", "count": 5000, "percentage": "50.0" }
    ]
  }
  ```

**POST /api/analytics/track**
- Track custom analytics events
- Accepts: eventType, eventName, page, referer, productId, category, metadata
- Valid eventTypes: PAGE_VIEW, PRODUCT_VIEW, ADD_TO_CART, PURCHASE, SEARCH, FILTER, REVIEW_SUBMIT, etc.

### React Hook

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function AnalyticsDashboard() {
  const {
    analytics,
    loading,
    error,
    fetchAnalytics,
    getEventStats,
    getTopProducts,
    getConversionMetrics,
    getDeviceBreakdown
  } = useAnalytics();

  useEffect(() => {
    fetchAnalytics(30); // Last 30 days
  }, []);

  return (
    <div>
      {loading && <p>Loading analytics...</p>}
      {error && <p>Error: {error}</p>}
      {analytics && (
        <>
          <div>
            <h3>Conversion Rate</h3>
            <p>{getConversionMetrics().rate}</p>
            <p>{getConversionMetrics().views} views → {getConversionMetrics().purchases} purchases</p>
          </div>
          <div>
            <h3>Top Products</h3>
            {getTopProducts().map(p => (
              <p key={p.productId}>{p.productName}: {p.viewCount} views</p>
            ))}
          </div>
          <div>
            <h3>Device Stats</h3>
            {getDeviceBreakdown().map((d, i) => (
              <p key={i}>{d.device}: {d.percentage}%</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

---

## Complete Example Component

```typescript
'use client';

import { usePayment } from '@/hooks/usePayment';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useCart } from '@/hooks/useCart';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { apiClient } from '@/lib/apiClient';

export default function ShoppingFlow() {
  const payment = usePayment();
  const imageUpload = useImageUpload();
  const cart = useCart();
  const tracking = useOrderTracking();

  const handleCheckout = async () => {
    // 1. Create order
    const order = await apiClient.createCheckoutSession(cart.cart);
    
    // 2. Process payment
    await payment.processRazorpayPayment(order.id, cart.summary.total);
    
    // 3. Track order
    await tracking.fetchTracking(order.trackingNumber);
  };

  return (
    <div>
      {/* Cart display */}
      <div>
        <h2>Cart ({cart.itemCount})</h2>
        <p>Total: ₹{cart.summary.total}</p>
        <button 
          onClick={handleCheckout}
          disabled={payment.isProcessing || cart.isEmpty}
        >
          {payment.isProcessing ? 'Processing...' : 'Checkout'}
        </button>
      </div>

      {/* Tracking display */}
      {tracking.tracking && (
        <div>
          <h2>Order Status</h2>
          <p>{tracking.tracking.orderNumber}</p>
          <div style={{ width: `${tracking.tracking.statusProgress}%`, background: 'green' }} />
        </div>
      )}
    </div>
  );
}
```

---

## Common Error Handling

```typescript
try {
  // API call
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  
  if (message.includes('401')) {
    // Unauthorized - redirect to login
  } else if (message.includes('404')) {
    // Not found
  } else if (message.includes('500')) {
    // Server error
  }
}
```

---

## Best Practices

1. **Always check loading/error states** in components
2. **Use TypeScript** for better type safety with hooks
3. **Implement optimistic updates** for better UX
4. **Cache API responses** when appropriate
5. **Handle payment errors** gracefully with user feedback
6. **Validate input** before sending to API (use clientUtils)
7. **Track analytics events** for key user actions
8. **Test payment flows** in sandbox mode first

---

Last Updated: January 2025
