'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Truck, Home, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: string;
  total: number;
  subtotal: number;
  createdAt: string;
  items: any[];
  trackingNumber?: string;
  shippingAddress: any;
  paymentMethod: string;
}

const COLORS = {
  deepTeal: '#1A7A6E',
  gold: '#C9A84C',
  ivory: '#FAF3E0',
  charcoal: '#2D2D2D',
};

const statusSteps = [
  { status: 'PENDING', label: 'Order Placed', icon: Package },
  { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
  { status: 'PROCESSING', label: 'Processing', icon: Package },
  { status: 'SHIPPED', label: 'Shipped', icon: Truck },
  { status: 'DELIVERED', label: 'Delivered', icon: Home },
];

export function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error('Order not found');
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.ivory }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-2 animate-spin mx-auto mb-4" style={{ borderTopColor: COLORS.deepTeal }}></div>
          <p style={{ color: COLORS.charcoal }}>Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.ivory }}>
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.findIndex((s) => s.status === order.status);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.ivory }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-light mb-2" style={{ color: COLORS.deepTeal }}>
            Order Tracking
          </h1>
          <p className="text-gray-600">Order #{order.orderNumber}</p>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
          </p>
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 p-8 rounded-lg"
          style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <div className="flex justify-between items-center mb-8">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div key={step.status} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCompleted ? 'text-white' : 'text-gray-400'
                    }`}
                    style={{
                      backgroundColor: isCompleted ? COLORS.deepTeal : '#E5E7EB',
                      transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <p className={`text-sm text-center font-medium ${isCompleted ? '' : 'text-gray-400'}`}>{step.label}</p>

                  {index < statusSteps.length - 1 && (
                    <div
                      className="absolute w-32 h-1 mt-6"
                      style={{
                        backgroundColor: isCompleted ? COLORS.deepTeal : '#E5E7EB',
                        left: 'calc(50% + 24px)',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-lg"
            style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.deepTeal }}>
              Order Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span
                  className="font-medium px-3 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: order.paymentStatus === 'COMPLETED' ? '#10B981' : COLORS.gold }}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold" style={{ color: COLORS.deepTeal }}>
                  Total:
                </span>
                <span className="font-bold text-lg" style={{ color: COLORS.deepTeal }}>
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-lg"
            style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.deepTeal }}>
              Shipping Address
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="mt-3 text-gray-600">
                <strong>Phone:</strong> {order.shippingAddress?.phone}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-lg mb-12"
          style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <h2 className="text-xl font-semibold mb-6" style={{ color: COLORS.deepTeal }}>
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex justify-between items-center pb-4 border-b"
              >
                <div>
                  <p className="font-medium">{item.product?.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tracking Number */}
        {order.trackingNumber && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: COLORS.gold }}
          >
            <p className="text-sm text-gray-700 mb-2">Tracking Number</p>
            <p className="text-2xl font-bold" style={{ color: COLORS.deepTeal }}>
              {order.trackingNumber}
            </p>
            <p className="text-xs text-gray-600 mt-2">You can track your shipment using this number on the courier website</p>
          </motion.div>
        )}

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link href="/" style={{ color: COLORS.deepTeal }} className="hover:underline">
            ← Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
