export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  total: number;
  shippingCost: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  notes?: string;
}

export interface AdminOrderStats {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  completedOrders: number;
  cancellations: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export const ADMIN_ORDERS: AdminOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2026-001',
    customer: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91-9876-543210',
    },
    items: [
      {
        productId: '1',
        productName: 'Terracotta Artisan Bedsheet',
        quantity: 1,
        price: 3499,
        subtotal: 3499,
      },
    ],
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '123 Market Street',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India',
    },
    total: 4204,
    shippingCost: 99,
    tax: 606,
    createdAt: '2026-02-08',
    updatedAt: '2026-02-09',
    trackingNumber: 'TRK-2026-001',
    notes: 'Customer satisfied with purchase',
  },
  {
    id: '2',
    orderNumber: 'ORD-2026-002',
    customer: {
      name: 'Raj Kumar',
      email: 'raj@example.com',
      phone: '+91-9123-456789',
    },
    items: [
      {
        productId: '2',
        productName: 'Sage Green Cushions',
        quantity: 2,
        price: 1299,
        subtotal: 2598,
      },
      {
        productId: '3',
        productName: 'Natural Wool Rug',
        quantity: 1,
        price: 5999,
        subtotal: 5999,
      },
    ],
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '456 Business Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
    },
    total: 11101,
    shippingCost: 99,
    tax: 1405,
    createdAt: '2026-02-07',
    updatedAt: '2026-02-08',
    trackingNumber: 'TRK-2026-002',
  },
  {
    id: '3',
    orderNumber: 'ORD-2026-003',
    customer: {
      name: 'Anjali Desai',
      email: 'anjali@example.com',
      phone: '+91-9456-123456',
    },
    items: [
      {
        productId: '4',
        productName: 'Indigo Bedsheet',
        quantity: 2,
        price: 2999,
        subtotal: 5998,
      },
    ],
    status: 'confirmed',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '789 Home Lane',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India',
    },
    total: 7197,
    shippingCost: 99,
    tax: 1080,
    createdAt: '2026-02-09',
    updatedAt: '2026-02-09',
  },
  {
    id: '4',
    orderNumber: 'ORD-2026-004',
    customer: {
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      phone: '+91-9789-456123',
    },
    items: [
      {
        productId: '5',
        productName: 'Block Print Throw',
        quantity: 1,
        price: 1599,
        subtotal: 1599,
      },
    ],
    status: 'pending',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '321 Heritage Street',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500001',
      country: 'India',
    },
    total: 1918,
    shippingCost: 0,
    tax: 287,
    createdAt: '2026-02-09',
    updatedAt: '2026-02-09',
  },
  {
    id: '5',
    orderNumber: 'ORD-2026-005',
    customer: {
      name: 'Neha Kapoor',
      email: 'neha@example.com',
      phone: '+91-8765-432109',
    },
    items: [
      {
        productId: '6',
        productName: 'Wall Hanging Art',
        quantity: 1,
        price: 3999,
        subtotal: 3999,
      },
    ],
    status: 'cancelled',
    paymentStatus: 'refunded',
    shippingAddress: {
      street: '654 Arts Avenue',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600001',
      country: 'India',
    },
    total: 4799,
    shippingCost: 99,
    tax: 600,
    createdAt: '2026-02-06',
    updatedAt: '2026-02-08',
    notes: 'Customer requested cancellation - refund processed',
  },
];

export const ADMIN_ORDER_STATS: AdminOrderStats = {
  totalOrders: ADMIN_ORDERS.length,
  pendingOrders: ADMIN_ORDERS.filter((o) => o.status === 'pending').length,
  shippedOrders: ADMIN_ORDERS.filter((o) => o.status === 'shipped').length,
  completedOrders: ADMIN_ORDERS.filter((o) => o.status === 'delivered').length,
  cancellations: ADMIN_ORDERS.filter((o) => o.status === 'cancelled').length,
  totalRevenue: ADMIN_ORDERS.reduce((sum, o) => sum + o.total, 0),
  averageOrderValue: ADMIN_ORDERS.reduce((sum, o) => sum + o.total, 0) / ADMIN_ORDERS.length,
};
