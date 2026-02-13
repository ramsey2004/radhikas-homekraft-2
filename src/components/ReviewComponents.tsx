'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Review } from '@/types';

interface ReviewSubmitProps {
  productId: string;
  productName: string;
  onReviewSubmitted?: (review: Review) => void;
}

/**
 * Review Submission Form Component
 * Allows authenticated users to submit product reviews
 */
export function ReviewSubmitForm({
  productId,
  productName,
  onReviewSubmitted,
}: ReviewSubmitProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error('Please sign in to submit a review');
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
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
        throw new Error('Failed to submit review');
      }

      const data = await response.json();
      toast.success('Review submitted successfully!');
      setTitle('');
      setComment('');
      setRating(5);
      onReviewSubmitted?.(data.review);
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-4">Sign in to share your experience with this product</p>
        <a href="/auth/signin" className="text-accent-600 font-medium hover:text-accent-700">
          Sign in to write a review
        </a>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Share Your Experience</h3>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How would you rate {productName}?
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <FiStar
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {rating === 5 ? '⭐ Excellent' : rating >= 4 ? '⭐ Good' : rating >= 3 ? '⭐ Average' : 'Poor'}
        </p>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Review Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience..."
          maxLength={100}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share more details about your experience..."
          maxLength={1000}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{comment.length}/1000</p>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 disabled:bg-gray-400 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FiSend className="h-4 w-4" />
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </motion.button>
    </motion.form>
  );
}

/**
 * Review Display Component
 */
interface ReviewDisplayProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
}

export function ReviewDisplay({ review, onHelpful }: ReviewDisplayProps) {
  const [helpfulCount, setHelpfulCount] = useState((review as any).helpful || 0);
  const [isMarked, setIsMarked] = useState(false);

  const handleHelpful = async () => {
    if (isMarked) return;

    try {
      const response = await fetch(`/api/reviews/${review.id}/helpful`, {
        method: 'POST',
      });

      if (response.ok) {
        setHelpfulCount(helpfulCount + 1);
        setIsMarked(true);
        onHelpful?.(review.id);
      }
    } catch (error) {
      console.error('Failed to mark review as helpful:', error);
    }
  };

  return (
    <motion.div
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              className={`h-4 w-4 ${
                star <= review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
      <p className="text-gray-700 text-sm mb-3">{review.comment}</p>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">By {review.userName}</span>
        <button
          onClick={handleHelpful}
          disabled={isMarked}
          className="text-gray-500 hover:text-accent-600 disabled:text-gray-300 transition-colors"
        >
          👍 Helpful {helpfulCount > 0 && `(${helpfulCount})`}
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Reviews List Component
 */
interface ReviewsListProps {
  reviews: Review[];
  isLoading?: boolean;
}

export function ReviewsList({ reviews, isLoading = false }: ReviewsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewDisplay key={review.id} review={review} />
      ))}
    </div>
  );
}
