'use client';

import { useState } from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiSearch } from 'react-icons/fi';
import Breadcrumb from '@/components/Breadcrumb';
import { ROUTES } from '@/lib/constants';

interface OrderStatus {
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: string;
}

interface Order {
  id: string;
  email: string;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  statuses: OrderStatus[];
}

// Mock orders for demonstration
const mockOrders: Record<string, Order> = {
  'ORD-2024-001': {
    id: 'ORD-2024-001',
    email: 'customer@example.com',
    status: 'shipped',
    trackingNumber: 'TRACK123456789',
    estimatedDelivery: '2 Feb 2026',
    items: [
      { name: 'Block Print Cotton Bedsheet', quantity: 1, price: 2499 },
    ],
    total: 2599,
    statuses: [
      { status: 'pending', timestamp: '25 Jan 2026, 2:30 PM' },
      { status: 'confirmed', timestamp: '25 Jan 2026, 3:15 PM' },
      { status: 'packed', timestamp: '26 Jan 2026, 10:00 AM' },
      { status: 'shipped', timestamp: '27 Jan 2026, 4:30 PM' },
    ],
  },
  'ORD-2024-002': {
    id: 'ORD-2024-002',
    email: 'another@example.com',
    status: 'delivered',
    trackingNumber: 'TRACK987654321',
    estimatedDelivery: 'Delivered',
    items: [
      { name: 'Handwoven Jaipur Rug', quantity: 1, price: 8999 },
    ],
    total: 8999,
    statuses: [
      { status: 'pending', timestamp: '15 Jan 2026, 11:00 AM' },
      { status: 'confirmed', timestamp: '15 Jan 2026, 12:00 PM' },
      { status: 'packed', timestamp: '16 Jan 2026, 2:00 PM' },
      { status: 'shipped', timestamp: '18 Jan 2026, 9:00 AM' },
      { status: 'delivered', timestamp: '22 Jan 2026, 5:30 PM' },
    ],
  },
};

export default function TrackOrderPage() {
  const [orderInput, setOrderInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSelectedOrder(null);

    const order = mockOrders[orderInput.toUpperCase()];
    
    if (!order) {
      setError('Order not found. Please check your Order ID and try again.');
      return;
    }

    if (order.email !== emailInput) {
      setError('Email does not match the order. Please verify and try again.');
      return;
    }

    setSelectedOrder(order);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'packed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="h-6 w-6" />;
      case 'shipped':
        return <FiTruck className="h-6 w-6" />;
      case 'packed':
        return <FiPackage className="h-6 w-6" />;
      default:
        return <FiCheckCircle className="h-6 w-6" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold mb-2">Track Your Order</h1>
          <p className="text-primary-100">Enter your Order ID and email to track your shipment</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Track Order' },
          ]}
        />

        {/* Search Form */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="order-id" className="block text-sm font-semibold text-gray-900 mb-2">
                  Order ID *
                </label>
                <input
                  id="order-id"
                  type="text"
                  placeholder="e.g., ORD-2024-001"
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-600 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-600 transition-colors"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full btn btn-primary flex items-center justify-center gap-2"
            >
              <FiSearch className="h-5 w-5" />
              Track Order
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Demo Orders */}
        {!selectedOrder && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Demo Orders</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-blue-900 font-semibold mb-3">Try searching with these sample orders:</p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-blue-900">Order ID: ORD-2024-001</p>
                  <p className="text-sm text-blue-800">Email: customer@example.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Order ID: ORD-2024-002</p>
                  <p className="text-sm text-blue-800">Email: another@example.com</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        {selectedOrder && (
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedOrder.estimatedDelivery}</p>
                </div>
              </div>

              {selectedOrder.trackingNumber && (
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                  <p className="text-lg font-mono font-semibold text-primary-600">{selectedOrder.trackingNumber}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipment Timeline</h2>
              
              <div className="space-y-6">
                {selectedOrder.statuses.map((status, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`p-3 rounded-full ${getStatusColor(status.status)}`}>
                        {getStatusIcon(status.status)}
                      </div>
                      {index < selectedOrder.statuses.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-300 my-2" />
                      )}
                    </div>
                    <div className="pt-2">
                      <h3 className="font-semibold text-gray-900">
                        {getStatusLabel(status.status)}
                      </h3>
                      <p className="text-sm text-gray-600">{status.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
              
              <div className="space-y-4">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-bold text-primary-600">₹{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 text-center">
              <h3 className="text-lg font-bold text-primary-900 mb-3">Need Help?</h3>
              <p className="text-primary-800 mb-6">
                If you have any questions about your order, please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:support@radhikashomecraft.com" className="btn btn-primary">
                  Email Support
                </a>
                <a href="tel:+918239316066" className="btn btn-outline">
                  Call Us
                </a>
              </div>
            </div>

            {/* Back Button */}
            <div>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setOrderInput('');
                  setEmailInput('');
                }}
                className="btn btn-outline"
              >
                Track Another Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
