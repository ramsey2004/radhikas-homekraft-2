'use client';

import { useState, useCallback } from 'react';

export interface AnalyticsMetrics {
  period: {
    from: string;
    to: string;
    daysIncluded: number;
  };
  eventStats: Array<{
    type: string;
    count: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    viewCount: number;
  }>;
  topCategories: Array<{
    category: string;
    viewCount: number;
  }>;
  conversion: {
    totalViews: number;
    totalPurchases: number;
    conversionRate: number;
  };
  deviceStats: Array<{
    device: string;
    count: number;
  }>;
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics/dashboard?days=${days}`);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventStats = useCallback(() => {
    if (!analytics) return [];
    return analytics.eventStats;
  }, [analytics]);

  const getTopProducts = useCallback(() => {
    if (!analytics) return [];
    return analytics.topProducts.slice(0, 5);
  }, [analytics]);

  const getTopCategories = useCallback(() => {
    if (!analytics) return [];
    return analytics.topCategories.slice(0, 5);
  }, [analytics]);

  const getConversionMetrics = useCallback(() => {
    if (!analytics) return null;
    return {
      views: analytics.conversion.totalViews,
      purchases: analytics.conversion.totalPurchases,
      rate: (analytics.conversion.conversionRate * 100).toFixed(2) + '%',
      avgPercentage: analytics.conversion.conversionRate * 100,
    };
  }, [analytics]);

  const getDeviceBreakdown = useCallback(() => {
    if (!analytics) return [];

    const total = analytics.deviceStats.reduce((sum, d) => sum + d.count, 0);
    return analytics.deviceStats.map((device) => ({
      ...device,
      percentage: ((device.count / total) * 100).toFixed(1),
    }));
  }, [analytics]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    getEventStats,
    getTopProducts,
    getTopCategories,
    getConversionMetrics,
    getDeviceBreakdown,
  };
}
