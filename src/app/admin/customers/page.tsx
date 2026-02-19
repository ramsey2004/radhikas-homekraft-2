'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Eye, Mail } from 'lucide-react';
import { FiSearch } from 'react-icons/fi';

interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  joinDate: string;
  status: 'active' | 'inactive';
  segmentation: 'regular' | 'vip' | 'at-risk';
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState<'all' | 'regular' | 'vip' | 'at-risk'>('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSegment === 'all' || customer.segmentation === filterSegment;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    vipCustomers: customers.filter(c => c.segmentation === 'vip').length,
    avgLifetimeValue: customers.length > 0 
      ? (customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(2)
      : '0',
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading customers...</div>;
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
        <p className="text-gray-600">Analyze customer behavior, retention, and lifetime value</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <Users className="h-8 w-8 text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalCustomers}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-green-50 border border-green-200 rounded-lg p-6">
          <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
          <p className="text-sm text-gray-600">Active Customers</p>
          <p className="text-2xl font-bold text-green-600">{stats.activeCustomers}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
          <p className="text-sm text-gray-600">VIP Customers</p>
          <p className="text-2xl font-bold text-purple-600">{stats.vipCustomers}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <TrendingUp className="h-8 w-8 text-amber-600 mb-2" />
          <p className="text-sm text-gray-600">Avg Lifetime Value</p>
          <p className="text-2xl font-bold text-amber-600">₹{stats.avgLifetimeValue}</p>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <select
          value={filterSegment}
          onChange={(e) => setFilterSegment(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Segments</option>
          <option value="regular">Regular</option>
          <option value="vip">VIP</option>
          <option value="at-risk">At Risk</option>
        </select>
      </div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-gray-200 rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Orders</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total Spent</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Segment</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Last Activity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{customer.totalOrders}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{customer.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        customer.segmentation === 'vip'
                          ? 'bg-purple-100 text-purple-800'
                          : customer.segmentation === 'at-risk'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {customer.segmentation}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(customer.lastOrderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button className="text-primary-600 hover:text-primary-700" title="View details">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-amber-600 hover:text-amber-700" title="Send email">
                      <Mail className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No customers found</p>
        </div>
      )}
    </div>
  );
}
