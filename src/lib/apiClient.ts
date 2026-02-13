// API client utility for frontend to interact with backend endpoints
'use client';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

export interface ApiErrorResponse {
  error: string;
  details?: Record<string, string[]>;
  status?: number;
}

class ApiClient {
  private baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '';

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    path: string,
    options?: {
      body?: any;
      headers?: Record<string, string>;
      cache?: RequestCache;
      revalidate?: number;
    }
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${path}`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
        cache: options?.cache || 'no-cache',
      });

      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return {
        success: response.ok,
        data,
        status: response.status,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Request failed';
      return {
        success: false,
        error: errorMessage,
        status: 0,
      };
    }
  }

  // Authentication endpoints
  async getProfile() {
    return this.request<any>('GET', '/api/auth/profile', {
      cache: 'no-cache',
    });
  }

  async updateProfile(data: any) {
    return this.request<any>('PUT', '/api/auth/profile', {
      body: data,
    });
  }

  async changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    return this.request<any>('POST', '/api/auth/change-password', {
      body: { oldPassword, newPassword, confirmPassword },
    });
  }

  // Upload endpoints
  async uploadImage(file: File, productId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (productId) formData.append('productId', productId);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  async uploadBatch(files: File[], productId?: string) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (productId) formData.append('productId', productId);

    const response = await fetch('/api/upload/batch', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Batch upload failed');
    }

    return response.json();
  }

  async deleteImage(filename?: string, imageId?: string) {
    const params = new URLSearchParams();
    if (filename) params.append('filename', filename);
    if (imageId) params.append('imageId', imageId);

    return this.request<any>('DELETE', `/api/upload?${params}`);
  }

  // Payment endpoints
  async createRazorpayOrder(amount: number, currency: string = 'INR', receipt?: string) {
    return this.request<any>('POST', '/api/checkout', {
      body: { amount, currency, receipt },
    });
  }

  async verifyRazorpayPayment(orderId: string, paymentId: string, signature: string) {
    return this.request<any>('PUT', '/api/checkout', {
      body: { orderId, paymentId, signature },
    });
  }

  async createStripeIntent(amount: number, currency: string = 'inr') {
    return this.request<any>('POST', '/api/payment/stripe', {
      body: { amount, currency },
    });
  }

  // Order tracking
  async getOrderTracking(trackingNumber: string) {
    return this.request<any>('GET', `/api/tracking/${trackingNumber}`, {
      cache: 'no-cache',
    });
  }

  async updateOrderStatus(orderId: string, status: string, trackingNumber?: string) {
    return this.request<any>('PUT', `/api/admin/orders/${orderId}/status`, {
      body: { status, trackingNumber },
    });
  }

  // Reviews endpoints
  async submitReview(productId: string, rating: number, title: string, comment: string) {
    return this.request<any>('POST', '/api/reviews', {
      body: { productId, rating, title, comment },
    });
  }

  async getReviews(productId?: string) {
    const params = productId ? `?productId=${productId}` : '';
    return this.request<any>('GET', `/api/reviews${params}`, {
      cache: 'no-cache',
    });
  }

  async markReviewHelpful(reviewId: string) {
    return this.request<any>('POST', `/api/reviews/${reviewId}/helpful`);
  }

  async deleteReview(reviewId: string) {
    return this.request<any>('DELETE', `/api/reviews/${reviewId}`);
  }

  // Wishlist endpoints
  async addToWishlist(productId: string) {
    return this.request<any>('POST', '/api/wishlist', {
      body: { productId },
    });
  }

  async removeFromWishlist(productId: string) {
    return this.request<any>('DELETE', `/api/wishlist/${productId}`);
  }

  async getWishlist() {
    return this.request<any>('GET', '/api/wishlist', {
      cache: 'no-cache',
    });
  }

  // Analytics endpoints
  async getAnalyticsDashboard(days: number = 30) {
    return this.request<any>('GET', `/api/analytics/dashboard?days=${days}`, {
      cache: 'no-cache',
    });
  }

  async trackEvent(eventType: string, data?: any) {
    return this.request<any>('POST', '/api/analytics/track', {
      body: { eventType, data },
    });
  }

  // Checkout endpoints
  async createCheckoutSession(items: any[], shippingAddress?: any) {
    return this.request<any>('POST', '/api/checkout', {
      body: { items, shippingAddress },
    });
  }

  async getCheckoutSession(sessionId: string) {
    return this.request<any>('GET', `/api/checkout/${sessionId}`);
  }

  // Contact endpoints
  async submitContactForm(name: string, email: string, message: string) {
    return this.request<any>('POST', '/api/contact', {
      body: { name, email, message },
    });
  }
}

export const apiClient = new ApiClient();

export default apiClient;
