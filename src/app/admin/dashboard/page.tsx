'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiShoppingCart, FiUsers, FiAward, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import {
  DAILY_SALES,
  CATEGORY_SALES,
  MONTHLY_ANALYTICS,
  DASHBOARD_STATS,
} from '@/data/admin-analytics';
import { ADMIN_ORDERS } from '@/data/admin-orders';
import { INVENTORY_STATS } from '@/data/admin-inventory';

export default function AdminDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'customers'>('revenue');

  // Calculate chart data
  const chartData = useMemo(() => {
    if (selectedMetric === 'revenue') {
      return DAILY_SALES.map((day) => ({
        name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: day.revenue,
      }));
    } else if (selectedMetric === 'orders') {
      return DAILY_SALES.map((day) => ({
        name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: day.orders,
      }));
    } else {
      return DAILY_SALES.map((day) => ({
        name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: day.customers,
      }));
    }
  }, [selectedMetric]);

  // Get max value for chart scaling
  const maxValue = Math.max(...chartData.map((d) => d.value));

  // Recent orders
  const recentOrders = useMemo(() => {
    return ADMIN_ORDERS.slice(0, 5).map((order) => ({
      ...order,
      statusColor:
        order.status === 'delivered'
          ? 'text-green-600'
          : order.status === 'shipped'
            ? 'text-blue-600'
            : order.status === 'pending'
              ? 'text-yellow-600'
              : order.status === 'cancelled'
                ? 'text-red-600'
                : 'text-gray-600',
      statusBg:
        order.status === 'delivered'
          ? 'bg-green-50'
          : order.status === 'shipped'
            ? 'bg-blue-50'
            : order.status === 'pending'
              ? 'bg-yellow-50'
              : order.status === 'cancelled'
                ? 'bg-red-50'
                : 'bg-gray-50',
    }));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="mb-8" suppressHydrationWarning>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome back! Here&apos;s your business overview.</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          suppressHydrationWarning
        >
          {/* Revenue Card */}
          <motion.div variants={itemVariants} className="group" suppressHydrationWarning>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FiTrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600">+12.5%</span>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                ₹{(DASHBOARD_STATS.thisMonth.revenue / 100000).toFixed(1)}L
              </p>
              <p className="text-xs text-slate-500 mt-2">This month</p>
            </div>
          </motion.div>

          {/* Orders Card */}
          <motion.div variants={itemVariants} className="group" suppressHydrationWarning>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiShoppingCart className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600">+8.3%</span>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Orders</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{DASHBOARD_STATS.thisMonth.orders}</p>
              <p className="text-xs text-slate-500 mt-2">This month</p>
            </div>
          </motion.div>

          {/* Customers Card */}
          <motion.div variants={itemVariants} className="group" suppressHydrationWarning>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600">+15.2%</span>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">New Customers</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{DASHBOARD_STATS.thisMonth.customers}</p>
              <p className="text-xs text-slate-500 mt-2">This month</p>
            </div>
          </motion.div>

          {/* Satisfaction Card */}
          <motion.div variants={itemVariants} className="group" suppressHydrationWarning>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <FiAward className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-600">4.8/5</span>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">Satisfaction</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                {(MONTHLY_ANALYTICS.customerSatisfaction * 20).toFixed(0)}%
              </p>
              <p className="text-xs text-slate-500 mt-2">Customer rating</p>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            suppressHydrationWarning
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Sales Trends</h2>
              <div className="flex gap-3 flex-wrap">
                {(['revenue', 'orders', 'customers'] as const).map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedMetric === metric
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mini Bar Chart */}
            <div className="h-64 flex items-end gap-1">
              {chartData.map((data, idx) => (
                <motion.div
                  key={idx}
                  initial={false}
                  animate={{ height: `${(data.value / maxValue) * 100}%` }}
                  transition={{ delay: idx * 0.02 }}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t opacity-80 hover:opacity-100 transition-opacity group relative"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                    {data.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* X-axis labels */}
            <div className="flex gap-1 mt-2 text-xs text-slate-500">
              {chartData.map((data, idx) => (
                <div key={idx} className="flex-1 text-center truncate">
                  {idx % 5 === 0 ? data.name : ''}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Sales */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            suppressHydrationWarning
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">Top Categories</h2>
            <div className="space-y-3">
              {CATEGORY_SALES.map((category, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-slate-700">{category.category}</p>
                      <span className="text-xs font-semibold text-slate-600">{category.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-900 font-medium">Total Category Revenue</p>
              <p className="text-lg font-bold text-blue-900 mt-1">
                ₹{(CATEGORY_SALES.reduce((sum, cat) => sum + cat.revenue, 0) / 100000).toFixed(1)}L
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            suppressHydrationWarning
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
              <Link href="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View All
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className={`${order.statusBg} border border-slate-200 rounded-lg p-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                      <p className="text-sm text-slate-600">{order.customer.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">₹{order.total.toLocaleString('en-IN')}</p>
                      <p className={`text-sm font-medium ${order.statusColor} capitalize`}>{order.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
            suppressHydrationWarning
          >
            {/* Inventory Alert */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-3">Inventory Alerts</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Low Stock Items</span>
                  <span className="font-bold text-amber-600">{INVENTORY_STATS.lowStock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Out of Stock</span>
                  <span className="font-bold text-red-600">{INVENTORY_STATS.outOfStock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">In Stock</span>
                  <span className="font-bold text-green-600">{INVENTORY_STATS.inStock}</span>
                </div>
              </div>
              <Link
                href="/admin/inventory"
                className="w-full mt-4 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors inline-block text-center"
              >
                Manage Inventory
              </Link>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-3">Key Metrics</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Avg Order Value</p>
                  <p className="text-2xl font-bold text-slate-900">₹{MONTHLY_ANALYTICS.avgOrderValue.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Conversion Rate</p>
                  <p className="text-2xl font-bold text-slate-900">{MONTHLY_ANALYTICS.conversionRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Return Rate</p>
                  <p className="text-2xl font-bold text-slate-900">{MONTHLY_ANALYTICS.returnRate}%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
