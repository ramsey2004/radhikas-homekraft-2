'use client';

import { useState, useCallback } from 'react';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpful: number;
  createdAt: string;
  author?: {
    name: string;
    image?: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReview = useCallback(
    async (
      productId: string,
      rating: number,
      title: string,
      comment: string
    ) => {
      try {
        setLoading(true);
        setError(null);

        if (rating < 1 || rating > 5) {
          throw new Error('Rating must be between 1 and 5');
        }

        if (!title.trim() || !comment.trim()) {
          throw new Error('Title and comment are required');
        }

        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            rating,
            title,
            comment,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to submit review');
        }

        const data = await response.json();
        setReviews((prev) => [data.data, ...prev]);

        return data.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to submit review';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchProductReviews = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/reviews?productId=${productId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.data.reviews);
      setStats(data.data.stats);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch reviews';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const markHelpful = useCallback(
    async (reviewId: string) => {
      try {
        const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to mark as helpful');
        }

        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? { ...review, helpful: review.helpful + 1 }
              : review
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to mark as helpful';
        console.error(errorMessage);
      }
    },
    []
  );

  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete review';
      console.error(errorMessage);
    }
  }, []);

  const getRatingPercentage = useCallback(
    (rating: number): number => {
      if (!stats || stats.totalReviews === 0) return 0;
      return (
        ((stats.ratingDistribution[rating] || 0) / stats.totalReviews) * 100
      );
    },
    [stats]
  );

  return {
    reviews,
    stats,
    loading,
    error,
    submitReview,
    fetchProductReviews,
    markHelpful,
    deleteReview,
    getRatingPercentage,
  };
}
