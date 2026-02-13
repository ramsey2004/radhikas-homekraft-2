/**
 * Admin Dashboard Management System
 * Product, Order, Analytics, and Inventory Management
 */

// Product Management
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  sku: string;
  stock: number;
  category: string;
  tags: string[];
  images: string[];
  material?: string;
  dimensions?: { width: number; height: number; depth: number };
  weight?: number;
  careInstructions?: string;
  artisan?: string;
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  sortBy?: 'newest' | 'price-high' | 'price-low' | 'rating';
  page?: number;
  limit?: number;
}

// Order Management
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Analytics
export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: { name: string; sales: number; revenue: number }[];
  topCustomers: { name: string; orders: number; spent: number }[];
  revenueByDate: { date: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  customerRetention: number;
  churnRate: number;
}

// Admin functions
export async function fetchProducts(filters: ProductFilter): Promise<{ products: Product[]; total: number }> {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/admin/products?${params}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const response = await fetch('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const response = await fetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete product');
}

export async function fetchOrders(filters?: { status?: string; page?: number; limit?: number }): Promise<{ orders: Order[]; total: number }> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/admin/orders?${params}`);
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  const response = await fetch(`/api/admin/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update order');
  return response.json();
}

export async function fetchAnalytics(): Promise<Analytics> {
  const response = await fetch('/api/admin/analytics');
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
}

export async function exportOrders(format: 'csv' | 'excel'): Promise<Blob> {
  const response = await fetch(`/api/admin/orders/export?format=${format}`);
  if (!response.ok) throw new Error('Failed to export orders');
  return response.blob();
}

export async function generateInvoice(orderId: string): Promise<Blob> {
  const response = await fetch(`/api/admin/orders/${orderId}/invoice`);
  if (!response.ok) throw new Error('Failed to generate invoice');
  return response.blob();
}
