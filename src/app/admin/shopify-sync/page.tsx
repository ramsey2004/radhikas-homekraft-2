'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface SyncStatus {
  shopifySyncedProducts: number;
  totalProducts: number;
  syncPercentage: string | number;
  lastSyncNote: string;
}

interface SyncResponse {
  success: boolean;
  message: string;
  synced: number;
  errors: { count: number; details: string[] } | null;
  total: number;
}

export default function ShopifySyncPage() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/shopify/sync');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch sync status:', error);
      toast.error('Failed to fetch sync status');
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/shopify/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data: SyncResponse = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Sync failed');
        return;
      }

      toast.success(`${data.synced} products synced successfully!`);
      setLastSync(new Date());
      await fetchSyncStatus();
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync products');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopify Integration</h1>
          <p className="text-gray-600">Sync products from your Shopify store to your database</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Synced Products Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Synced from Shopify</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {status?.shopifySyncedProducts || 0}
                </p>
              </div>
              <CheckCircle className="text-blue-500" size={40} />
            </div>
          </motion.div>

          {/* Total Products Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {status?.totalProducts || 0}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={40} />
            </div>
          </motion.div>

          {/* Sync Percentage Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sync Coverage</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {status?.syncPercentage}%
                </p>
              </div>
              <AlertCircle className="text-purple-500" size={40} />
            </div>
          </motion.div>
        </div>

        {/* Last Sync Info */}
        {lastSync && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8"
          >
            <p className="text-green-800">
              ✓ Last sync: {lastSync.toLocaleString()}
            </p>
          </motion.div>
        )}

        {/* Sync Button */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-lg shadow-md p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sync Products</h2>
          <p className="text-gray-600 mb-6">
            Click below to sync all products from your Shopify store to your database.
            This will:
          </p>
          <ul className="text-left text-gray-600 mb-8 max-w-md mx-auto space-y-2">
            <li>✓ Fetch all products from Shopify</li>
            <li>✓ Update prices and inventory</li>
            <li>✓ Sync product images</li>
            <li>✓ Create or update in your database</li>
          </ul>

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Start Sync'}
          </button>

          {isSyncing && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-blue-600 mt-4 text-sm"
            >
              Syncing products... This may take a minute.
            </motion.p>
          )}
        </motion.div>

        {/* Setup Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-blue-900 mb-4">Setup Required?</h3>
          <p className="text-blue-800 mb-4">
            Before syncing, make sure you've configured your Shopify credentials:
          </p>
          <ol className="text-blue-800 space-y-2 ml-6 list-decimal">
            <li>Set SHOPIFY_STORE_NAME in your environment variables</li>
            <li>Set SHOPIFY_STOREFRONT_ACCESS_TOKEN in your environment variables</li>
            <li>Restart your development server</li>
            <li>Create products in your Shopify store</li>
          </ol>
          <p className="text-sm text-blue-700 mt-4">
            📖 See <code className="bg-white px-2 py-1 rounded">SHOPIFY_SETUP.md</code> for detailed instructions.
          </p>
        </motion.div>

        {/* API Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">API Endpoints</h3>
          <div className="space-y-4">
            <div>
              <p className="font-mono text-sm bg-white p-3 rounded border border-gray-200">
                POST /api/shopify/sync
              </p>
              <p className="text-sm text-gray-600 mt-1">Sync products from Shopify</p>
            </div>
            <div>
              <p className="font-mono text-sm bg-white p-3 rounded border border-gray-200">
                GET /api/shopify/sync
              </p>
              <p className="text-sm text-gray-600 mt-1">Get sync status</p>
            </div>
            <div>
              <p className="font-mono text-sm bg-white p-3 rounded border border-gray-200">
                POST /api/shopify/checkout
              </p>
              <p className="text-sm text-gray-600 mt-1">Create checkout and redirect to Shopify</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
