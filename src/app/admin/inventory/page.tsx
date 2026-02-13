'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';
import { INVENTORY_ITEMS, INVENTORY_STATS } from '@/data/admin-inventory';

type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';

export default function AdminInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | 'all'>('all');

  // Get unique categories
  const categories = useMemo(() => {
    return ['all', ...new Set(INVENTORY_ITEMS.map((item) => item.category))];
  }, []);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    let filtered = INVENTORY_ITEMS;

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    return filtered;
  }, [searchTerm, categoryFilter, statusFilter]);

  const getStatusColor = (status: InventoryStatus) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'low-stock':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'out-of-stock':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'discontinued':
        return 'bg-slate-50 border-slate-200 text-slate-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status: InventoryStatus) => {
    switch (status) {
      case 'in-stock':
        return <FiCheckCircle className="w-4 h-4 text-green-600" />;
      case 'low-stock':
        return <FiAlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'out-of-stock':
        return <FiAlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="mb-8" suppressHydrationWarning>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Inventory</h1>
              <p className="text-slate-600 mt-2">Manage product stock levels and inventory</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium rounded-lg transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Inventory Stats */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          suppressHydrationWarning
        >
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <p className="text-sm text-slate-600 font-medium mb-1">Total Products</p>
            <p className="text-3xl font-bold text-slate-900">{INVENTORY_STATS.totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <p className="text-sm text-slate-600 font-medium mb-1">In Stock</p>
            <p className="text-3xl font-bold text-green-600">{INVENTORY_STATS.inStock}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <p className="text-sm text-slate-600 font-medium mb-1">Low Stock</p>
            <p className="text-3xl font-bold text-yellow-600">{INVENTORY_STATS.lowStock}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <p className="text-sm text-slate-600 font-medium mb-1">Out of Stock</p>
            <p className="text-3xl font-bold text-red-600">{INVENTORY_STATS.outOfStock}</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6"
          suppressHydrationWarning
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as InventoryStatus | 'all')}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>

            <div className="text-sm text-slate-600 flex items-center">
              Showing <span className="font-semibold ml-1">{filteredInventory.length}</span> of{' '}
              <span className="font-semibold ml-1">{INVENTORY_ITEMS.length}</span> products
            </div>
          </div>
        </motion.div>

        {/* Inventory Table */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" suppressHydrationWarning>
          {filteredInventory.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Unit Price</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Supplier
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredInventory.map((item) => (
                      <motion.tr
                        key={item.productId}
                        variants={itemVariants}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900">{item.productName}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-600">{item.sku}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{item.stock}</span>
                            <span className="text-xs text-slate-600">/ {item.reorderLevel}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                              {item.status === 'in-stock'
                                ? 'In Stock'
                                : item.status === 'low-stock'
                                  ? 'Low Stock'
                                  : item.status === 'out-of-stock'
                                    ? 'Out of Stock'
                                    : 'Discontinued'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.supplier}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center"
            >
              <FiAlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">No products found</p>
              <p className="text-sm text-slate-500">Try adjusting your filters</p>
            </motion.div>
          )}
        </motion.div>

        {/* Inventory Value Summary */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
        >
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <p className="text-sm text-slate-600 font-medium mb-2">Total Inventory Value</p>
            <p className="text-3xl font-bold text-blue-600">
              ₹{(INVENTORY_STATS.totalInventoryValue / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-slate-500 mt-2">Based on unit price × quantity</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <p className="text-sm text-slate-600 font-medium mb-2">Total Cost Value</p>
            <p className="text-3xl font-bold text-slate-900">
              ₹{(INVENTORY_STATS.totalCostValue / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-slate-500 mt-2">Based on cost price × quantity</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
