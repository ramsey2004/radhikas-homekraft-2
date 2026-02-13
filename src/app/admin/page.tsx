'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Package, Users, TrendingUp } from 'lucide-react';

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueByCategory: Array<{ category: string; revenue: number }>;
  ordersTimeline: Array<{ date: string; orders: number; revenue: number }>;
  topProducts: Array<{ name: string; orders: number; revenue: number }>;
  customerRetention: number;
  churnRate: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers'>('overview');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full"
          suppressHydrationWarning
        />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 bg-black text-white">
        <p className="text-lg">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Business metrics and performance overview</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Revenue', value: `$${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign },
            { label: 'Total Orders', value: analytics.totalOrders, icon: Package },
            { label: 'Customers', value: analytics.totalCustomers, icon: Users },
            { label: 'Avg Order Value', value: `$${analytics.averageOrderValue.toFixed(2)}`, icon: TrendingUp },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-amber-900/20 to-amber-700/10 p-6 rounded-lg border border-amber-700/30"
            >
              <card.icon className="w-8 h-8 text-amber-600 mb-3" />
              <p className="text-gray-400 text-sm mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-amber-500">{card.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-4 border-b border-gray-700 mb-6">
            {(['overview', 'products', 'orders', 'customers'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tab
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Revenue Chart */}
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Revenue Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.ordersTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #666' }} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#f59e0b" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Orders Chart */}
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Orders Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.ordersTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #666' }} />
                    <Bar dataKey="orders" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue by Category */}
              {analytics.revenueByCategory.length > 0 && (
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Revenue by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.revenueByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                        nameKey="category"
                      >
                        {analytics.revenueByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              className="bg-gray-900/50 rounded-lg border border-gray-800 p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Top Products</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 text-gray-400">Product</th>
                    <th className="text-right py-3 text-gray-400">Orders</th>
                    <th className="text-right py-3 text-gray-400">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topProducts.map((product, idx) => (
                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3">{product.name}</td>
                      <td className="text-right">{product.orders}</td>
                      <td className="text-right font-semibold text-amber-500">${product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                <div className="text-sm text-gray-400 mb-2">Customer Retention</div>
                <div className="text-3xl font-bold text-green-500">{analytics.customerRetention}%</div>
                <p className="text-xs text-gray-500 mt-2">Customers returning for repeat purchases</p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                <div className="text-sm text-gray-400 mb-2">Churn Rate</div>
                <div className="text-3xl font-bold text-red-500">{analytics.churnRate}%</div>
                <p className="text-xs text-gray-500 mt-2">Customers lost this period</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Refresh Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchAnalytics}
          className="w-full sm:w-auto px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
        >
          Refresh Data
        </motion.button>
      </div>
    </div>
  );
}
