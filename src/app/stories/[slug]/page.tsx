'use client';

import Link from 'next/link';
import { FiArrowLeft, FiArrowRight, FiMapPin, FiAward } from 'react-icons/fi';
import { CUSTOMER_STORIES } from '@/data/stories';
import { motion } from 'framer-motion';

export default function StoryDetailPage({ params }: { params: { slug: string } }) {
  const story = CUSTOMER_STORIES.find((s) => s.slug === params.slug);

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Story not found</h1>
          <Link href="/stories" className="btn btn-primary">
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const relatedStories = CUSTOMER_STORIES.filter(
    (s) => s.category === story.category && s.slug !== story.slug
  ).slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-amber-100 hover:text-white mb-6"
          >
            <FiArrowLeft className="h-5 w-5" />
            Back to Stories
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            {story.title}
          </h1>
          <p className="text-amber-100 text-lg">{story.testimonial}</p>
        </div>
      </div>

      {/* Story Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Customer Introduction */}
        <div className="mb-12 p-8 bg-amber-50 rounded-lg border-2 border-amber-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {story.image}
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                {story.customerName}
              </h2>
              <div className="flex flex-col gap-1 text-gray-600">
                {story.customerRole && <p>{story.customerRole}</p>}
                <p className="flex items-center gap-2">
                  <FiMapPin className="h-4 w-4" />
                  {story.customerLocation}
                </p>
              </div>
            </div>
            <div className="ml-auto">
              <span className="text-xs font-semibold text-amber-600 bg-white px-4 py-2 rounded-full border border-amber-200">
                {story.category}
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 h-96 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center text-9xl">
          {story.image}
        </div>

        {/* Story Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Challenge */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-red-50 p-6 rounded-lg border-2 border-red-200"
          >
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-3">
              The Challenge
            </h3>
            <p className="text-gray-700">{story.challenge}</p>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200"
          >
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-3">
              The Solution
            </h3>
            <p className="text-gray-700">{story.solution}</p>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-green-50 p-6 rounded-lg border-2 border-green-200"
          >
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-3">
              Key Results
            </h3>
            <ul className="space-y-2">
              {story.results.slice(0, 3).map((result, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  {result}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Full Story */}
        <div className="mb-12 p-8 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">The Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">{story.story}</p>
          </div>
        </div>

        {/* All Results */}
        <div className="mb-12">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Complete Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {story.results.map((result, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <FiAward className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 font-medium">{result}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Highlight */}
        <div className="mb-12 p-8 border-l-4 border-amber-600 bg-amber-50 rounded-r-lg">
          <p className="text-2xl font-serif italic text-gray-900 mb-4">
            &ldquo;{story.testimonial}&rdquo;
          </p>
          <p className="text-gray-600 font-semibold">
            — {story.customerName}
            {story.customerRole && `, ${story.customerRole}`}
          </p>
        </div>

        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">
              More Stories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedStories.map((relatedStory) => (
                <Link
                  key={relatedStory.id}
                  href={`/stories/${relatedStory.slug}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-white border-2 border-amber-100 rounded-lg overflow-hidden hover:shadow-lg transition-all">
                    <div className="h-32 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-4xl">
                      {relatedStory.image}
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        {relatedStory.category}
                      </span>
                      <h4 className="font-serif font-bold text-gray-900 mt-2 group-hover:text-amber-600 line-clamp-2">
                        {relatedStory.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {relatedStory.customerName}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-amber-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 border-t-2 border-amber-200">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Ready to transform your space?
            </h3>
            <p className="text-gray-600 mb-8">
              Experience the same quality and craftsmanship that helped {story.customerName} achieve their goals.
            </p>
            <Link href="/shop" className="btn btn-primary inline-flex items-center gap-2">
              Explore Products <FiArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
