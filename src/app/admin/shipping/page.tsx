'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiPackage, FiMapPin, FiClock, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  email: string;
  status: string;
  paymentMethod: string;
  total: number;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
  shippingAddress?: {
    name: string;
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export default function ShippingManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'pending' | 'processing' | 'shipped' | 'all'>('pending');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter.toUpperCase());
      }

      const response = await fetch(`/api/orders?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async (orderId: string, provider: 'shiprocket' | 'delhivery' = 'shiprocket') => {
    setProcessingOrders(new Set(processingOrders).add(orderId));

    try {
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, provider }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Shipment created! AWB: ${data.shipment.awbCode || data.shipment.shipmentId}`);
        fetchOrders();
      } else {
        toast.error(data.error || 'Failed to create shipment');
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error('Failed to create shipment');
    } finally {
      setProcessingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleTrackShipment = async (trackingCode: string, provider: string = 'shiprocket') => {
    try {
      const response = await fetch(`/api/shipping?trackingCode=${trackingCode}&provider=${provider}`);
      const data = await response.json();

      if (data.success) {
        window.open(data.trackingUrl, '_blank');
      } else {
        toast.error('Failed to get tracking info');
      }
    } catch (error) {
      console.error('Error tracking shipment:', error);
      toast.error('Failed to track shipment');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'confirmed':
      case 'processing':
        return <FiLoader className="text-blue-500 animate-spin" />;
      case 'shipped':
        return <FiTruck className="text-purple-500" />;
      case 'delivered':
        return <FiCheck className="text-green-500" />;
      case 'cancelled':
        return <FiX className="text-red-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { bg: string; text: string } } = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800' },
      processing: { bg: 'bg-purple-100', text: 'text-purple-800' },
      shipped: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
    };

    const badge = badges[status.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800' };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF3E0]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A7A6E]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2D2D2D] mb-2">Shipping Management</h1>
          <p className="text-gray-600">Create and track shipments for orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-[#1A7A6E] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-[#1A7A6E] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending Shipment
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'processing'
                  ? 'bg-[#1A7A6E] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilter('shipped')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'shipped'
                  ? 'bg-[#1A7A6E] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Shipped
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <FiPackage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
              <p className="text-gray-500">
                {filter === 'pending' 
                  ? 'All orders have been shipped!' 
                  : 'No orders match the selected filter.'}
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Order Info */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(order.status)}
                      <h3 className="font-semibold text-[#2D2D2D]">{order.orderNumber}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{order.email}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-lg font-bold text-[#1A7A6E] mt-2">
                      ₹{order.total.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FiMapPin className="text-gray-400" />
                      <h4 className="font-medium text-gray-700">Shipping Address</h4>
                    </div>
                    {order.shippingAddress ? (
                      <div className="text-sm text-gray-600">
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                        <p>{order.shippingAddress.zipCode}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No address provided</p>
                    )}
                  </div>

                  {/* Tracking Info */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Tracking</h4>
                    {order.trackingNumber ? (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">AWB:</span> {order.trackingNumber}
                        </p>
                        {order.trackingUrl && (
                          <button
                            onClick={() => window.open(order.trackingUrl, '_blank')}
                            className="text-sm text-[#1A7A6E] hover:underline"
                          >
                            Track Shipment →
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Not shipped yet</p>
                    )}
                    <div className="mt-2">{getStatusBadge(order.status)}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-center space-y-2">
                    {!order.trackingNumber && order.status !== 'CANCELLED' && (
                      <>
                        <button
                          onClick={() => handleCreateShipment(order.id, 'shiprocket')}
                          disabled={processingOrders.has(order.id)}
                          className="px-4 py-2 bg-[#1A7A6E] text-white rounded-lg hover:bg-[#156159] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                        >
                          {processingOrders.has(order.id) ? (
                            <span className="flex items-center justify-center">
                              <FiLoader className="animate-spin mr-2" />
                              Creating...
                            </span>
                          ) : (
                            'Ship with Shiprocket'
                          )}
                        </button>
                        <button
                          onClick={() => handleCreateShipment(order.id, 'delhivery')}
                          disabled={processingOrders.has(order.id)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                        >
                          Ship with Delhivery
                        </button>
                      </>
                    )}
                    {order.trackingNumber && (
                      <button
                        onClick={() => handleTrackShipment(order.trackingNumber!)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Track Now
                      </button>
                    )}
                    <a
                      href={`/admin/orders/${order.id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
