'use client';

import { useOrders } from '@/hooks/useOrders';
import { useSession } from 'next-auth/react';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { FiPackage, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function OrdersPage() {
  const { data: session } = useSession();
  const { orders, loading } = useOrders();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your orders</p>
          <Link href="/login" className="text-accent-600 hover:underline">
            Sign in now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <FiPackage className="h-12 w-12 text-accent-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Orders' }]} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600 mb-8">Track and manage your orders</p>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No orders yet</p>
            <Link href="/shop" className="text-accent-600 hover:underline">
              Start shopping
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold text-lg">{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-accent-600">
                        ₹{order.total.toLocaleString()}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                          order.orderStatus === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.orderStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.orderStatus.charAt(0).toUpperCase() +
                          order.orderStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{order.items.length} item(s)</span>
                    <FiArrowRight className="h-5 w-5" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
