'use client';

import { useState, useCallback } from 'react';

export interface TrackingEvent {
  status: string;
  timestamp: string;
  description: string;
  location?: string;
}

export interface TrackingData {
  orderNumber: string;
  status: string;
  statusProgress: number;
  trackingNumber: string;
  items: any[];
  total: number;
  events: TrackingEvent[];
}

export function useOrderTracking() {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = useCallback(async (trackingNumber: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tracking/${trackingNumber}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error('Failed to fetch tracking information');
      }

      const data = await response.json();
      setTracking(data.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setTracking(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      PENDING: '#f97316',
      CONFIRMED: '#eab308',
      PROCESSING: '#3b82f6',
      SHIPPED: '#8b5cf6',
      IN_TRANSIT: '#06b6d4',
      DELIVERED: '#10b981',
      CANCELLED: '#ef4444',
    };
    return statusMap[status] || '#6b7280';
  };

  const getStatusIcon = (status: string): string => {
    const iconMap: Record<string, string> = {
      PENDING: '⏳',
      CONFIRMED: '✓',
      PROCESSING: '🔄',
      SHIPPED: '📦',
      IN_TRANSIT: '🚚',
      DELIVERED: '🎉',
      CANCELLED: '✗',
    };
    return iconMap[status] || '•';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return {
    tracking,
    loading,
    error,
    fetchTracking,
    getStatusColor,
    getStatusIcon,
    formatDate,
  };
}
