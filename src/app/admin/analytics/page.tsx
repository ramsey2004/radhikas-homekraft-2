'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiShoppingCart, FiPercent } from 'react-icons/fi';
import Link from 'next/link';
import { DAILY_SALES, CATEGORY_SALES, CUSTOMER_ANALYTICS, MONTHLY_ANALYTICS } from '@/data/admin-analytics';
import { ADMIN_ORDERS } from '@/data/admin-orders';

export default function AdminAnalytics() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Calculate top performing products
  const topProducts = useMemo(() => {
    const productMap = new Map<string, { name: string; orders: number; revenue: number }>();

    ADMIN_ORDERS.forEach((order) => {
      order.items.forEach((item) => {
        if (productMap.has(item.productId)) {
          const existing = productMap.get(item.productId)!;
          existing.orders++;
          existing.revenue += item.subtotal;
        } else {
          productMap.set(item.productId, {
            name: item.productName,
            orders: 1,
            revenue: item.subtotal,
          });
        }
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, []);

  // Generate weekly data
  const weeklyData = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = i * 7;
      const weekEnd = Math.min((i + 1) * 7, DAILY_SALES.length);
      const weekData = DAILY_SALES.slice(weekStart, weekEnd);

      weeks.push({
        week: `Week ${i + 1}`,
        revenue: weekData.reduce((sum, day) => sum + day.revenue, 0),
        orders: weekData.reduce((sum, day) => sum + day.orders, 0),
        customers: weekData.reduce((sum, day) => sum + day.customers, 0),
      });
    }
    return weeks;
  }, []);

  // Monthly data
  const monthlyData = [
    {
      month: 'Jan',
      revenue: DAILY_SALES.filter((d) => d.date.startsWith('2026-01')).reduce((sum, d) => sum + d.revenue, 0),
      orders: DAILY_SALES.filter((d) => d.date.startsWith('2026-01')).reduce((sum, d) => sum + d.orders, 0),
    },
    {
      month: 'Feb',
      revenue: DAILY_SALES.filter((d) => d.date.startsWith('2026-02')).reduce((sum, d) => sum + d.revenue, 0),
      orders: DAILY_SALES.filter((d) => d.date.startsWith('2026-02')).reduce((sum, d) => sum + d.orders, 0),
    },
  ];

  const getChartData = () => {
    if (timeframe === 'daily') {
      return DAILY_SALES.map((day) => ({
        label: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: day.revenue,
      }));
    } else if (timeframe === 'weekly') {
      return weeklyData.map((week) => ({
        label: week.week,
        value: week.revenue,
      }));
    } else {
      return monthlyData.map((month) => ({
        label: month.month,
        value: month.revenue,
      }));
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map((d) => d.value));

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

  // Calculate order statuses
  const orderStatuses = useMemo(() => {
    const stats = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    ADMIN_ORDERS.forEach((order) => {
      if (order.status !== 'refunded') {
        stats[order.status]++;
      }
    });

    return stats;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="mb-8" suppressHydrationWarning>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Analytics</h1>
              <p className="text-slate-600 mt-2">Detailed business metrics and performance data</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium rounded-lg transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-6 border border-slate-200" suppressHydrationWarning>
            <div className="flex items-center justify-between mb-4">
              <FiTrendingUp className="w-8 h-8 text-blue-500" />
              <span className="text-sm font-semibold text-green-600">+5.2%</span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-900">
              ₹{(MONTHLY_ANALYTICS.totalRevenue / 100000).toFixed(1)}L
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-6 border border-slate-200" suppressHydrationWarning>
            <div className="flex items-center justify-between mb-4">
              <FiShoppingCart className="w-8 h-8 text-purple-500" />
              <span className="text-sm font-semibold text-green-600">+3.1%</span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-slate-900">{MONTHLY_ANALYTICS.totalOrders}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-6 border border-slate-200" suppressHydrationWarning>
            <div className="flex items-center justify-between mb-4">
              <FiUsers className="w-8 h-8 text-emerald-500" />
              <span className="text-sm font-semibold text-green-600">+8.5%</span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Avg Order Value</p>
            <p className="text-3xl font-bold text-slate-900">₹{MONTHLY_ANALYTICS.avgOrderValue.toLocaleString('en-IN')}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-6 border border-slate-200" suppressHydrationWarning>
            <div className="flex items-center justify-between mb-4">
              <FiPercent className="w-8 h-8 text-amber-500" />
              <span className="text-sm font-semibold text-slate-600">Stable</span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-slate-900">{MONTHLY_ANALYTICS.conversionRate}%</p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Revenue Trend</h2>
              <div className="flex gap-3">
                {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      timeframe === tf
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tf.charAt(0).toUpperCase() + tf.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 flex items-end gap-1 mb-4">
              {chartData.map((data, idx) => (
                <motion.div
                  key={idx}
                  initial={false}
                  animate={{ height: `${(data.value / maxValue) * 100}%` }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t opacity-80 hover:opacity-100 transition-opacity group relative"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                    ₹{(data.value / 1000).toFixed(0)}K
                  </div>
                </motion.div>
              ))}
            </div>

            {/* X-axis labels */}
            <div className="flex gap-1 text-xs text-slate-600 overflow-x-auto">
              {chartData.map((data, idx) => (
                <div key={idx} className="flex-1 text-center min-w-fit">
                  {idx % Math.ceil(chartData.length / 10) === 0 ? data.label : ''}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Status Breakdown */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">Order Status</h2>
            <div className="space-y-4">
              {[
                { status: 'Pending', count: orderStatuses.pending, color: 'bg-yellow-100 text-yellow-700' },
                { status: 'Confirmed', count: orderStatuses.confirmed, color: 'bg-purple-100 text-purple-700' },
                { status: 'Shipped', count: orderStatuses.shipped, color: 'bg-blue-100 text-blue-700' },
                { status: 'Delivered', count: orderStatuses.delivered, color: 'bg-green-100 text-green-700' },
                { status: 'Cancelled', count: orderStatuses.cancelled, color: 'bg-red-100 text-red-700' },
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.color}`}>{item.status}</span>
                  <span className="font-bold text-slate-900">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">Top 5 Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-600">{product.orders} orders</p>
                  </div>
                  <p className="font-bold text-blue-600">₹{(product.revenue / 1000).toFixed(0)}K</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Customer Insights */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">Customer Insights</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Total Customers</span>
                <span className="font-bold text-slate-900 text-lg">{CUSTOMER_ANALYTICS.totalCustomers}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Repeat Customers</span>
                <span className="font-bold text-slate-900 text-lg">
                  {CUSTOMER_ANALYTICS.repeatCustomers}{' '}
                  <span className="text-sm text-slate-500">
                    ({((CUSTOMER_ANALYTICS.repeatCustomers / CUSTOMER_ANALYTICS.totalCustomers) * 100).toFixed(1)}%)
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="text-slate-600 font-medium">New This Month</span>
                <span className="font-bold text-slate-900 text-lg">{CUSTOMER_ANALYTICS.newCustomersThisMonth}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Churn Rate</span>
                <span className="font-bold text-red-600 text-lg">
                  {((CUSTOMER_ANALYTICS.churn / CUSTOMER_ANALYTICS.totalCustomers) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Avg Orders per Customer</span>
                <span className="font-bold text-slate-900 text-lg">
                  {(CUSTOMER_ANALYTICS.totalOrdersPlaced / CUSTOMER_ANALYTICS.totalCustomers).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Category Performance */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 bg-white rounded-lg shadow-sm border border-slate-200 p-6"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Category Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATEGORY_SALES.map((category, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <p className="font-medium text-slate-900 mb-2">{category.category}</p>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  ₹{(category.revenue / 1000).toFixed(0)}K
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{category.orderCount} orders</span>
                  <span className="font-semibold text-slate-600">{category.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
