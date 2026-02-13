'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPrinter, FiCheckCircle, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { ADMIN_ORDERS } from '@/data/admin-orders';
import { notFound } from 'next/navigation';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface PageProps {
  params: {
    id: string;
  };
}

export default function AdminOrderDetail({ params }: PageProps) {
  const order = ADMIN_ORDERS.find((o) => o.id === params.id);
  const [status, setStatus] = useState<OrderStatus>(order?.status as OrderStatus);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  if (!order) {
    notFound();
  }

  const getStatusColor = (stat: OrderStatus) => {
    switch (stat) {
      case 'delivered':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'shipped':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'confirmed':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'cancelled':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'refunded':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="mb-6" suppressHydrationWarning>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{order.orderNumber}</h1>
              <p className="text-slate-600 mt-1">Order Details</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium rounded-lg transition-colors">
              <FiPrinter className="w-4 h-4" />
              Print
            </button>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6" suppressHydrationWarning>
          {/* Order Status Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Order Status</h2>
              <button
                onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
              >
                Update Status
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              <span className="text-sm text-slate-600">
                Created: {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </span>
            </div>

            {showStatusUpdate && (
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <p className="text-sm font-medium text-slate-600 mb-3">Update Order Status:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'] as const).map(
                    (stat) => (
                      <button
                        key={stat}
                        onClick={() => {
                          setStatus(stat);
                          setShowStatusUpdate(false);
                        }}
                        className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                          status === stat
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {stat.charAt(0).toUpperCase() + stat.slice(1)}
                      </button>
                    ),
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Customer Information */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Name</p>
                <p className="text-slate-900 font-medium">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Email</p>
                <p className="text-slate-900">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Phone</p>
                <p className="text-slate-900">{order.customer.phone}</p>
              </div>
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Shipping Address</h2>
            <div className="text-slate-900">
              <p className="font-medium">{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
            {order.trackingNumber && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-slate-600 font-medium">Tracking Number</p>
                <p className="text-lg font-mono font-bold text-slate-900">{order.trackingNumber}</p>
              </div>
            )}
          </motion.div>

          {/* Order Items */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between pb-3 border-b border-slate-200 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{item.productName}</p>
                    <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">₹{item.price.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-slate-600">₹{item.subtotal.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">
                  ₹{order.items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium text-slate-900">₹{order.shippingCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Tax</span>
                <span className="font-medium text-slate-900">₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment & Notes */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-3">Payment Status</h3>
              <div className="flex items-center gap-2">
                {order.paymentStatus === 'paid' && (
                  <>
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-600">Paid</span>
                  </>
                )}
                {order.paymentStatus === 'refunded' && (
                  <>
                    <FiX className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-600">Refunded</span>
                  </>
                )}
                {order.paymentStatus === 'unpaid' && (
                  <>
                    <FiX className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-600">Unpaid</span>
                  </>
                )}
              </div>
            </div>

            {order.notes && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-3">Order Notes</h3>
                <p className="text-slate-600 text-sm">{order.notes}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
