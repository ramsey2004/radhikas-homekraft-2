'use client';

import Link from 'next/link';
import { FiCalendar, FiClock, FiArrowLeft, FiShare2, FiBookmark } from 'react-icons/fi';
import { BLOG_POSTS } from '@/data/blog';
import { ROUTES } from '@/lib/constants';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Article not found</h1>
          <Link href="/blog" className="btn btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.category === post.category && p.slug !== post.slug
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-6"
          >
            <FiArrowLeft className="h-5 w-5" />
            Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            {post.title}
          </h1>
          <p className="text-primary-100 text-lg">{post.excerpt}</p>
        </div>
      </div>

      {/* Article */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-12 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FiCalendar className="h-5 w-5 text-primary-600" />
            <span>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="h-5 w-5 text-primary-600" />
            <span>{post.readTime} min read</span>
          </div>
          <div className="text-sm">
            <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full font-semibold">
              {post.category}
            </span>
          </div>
          <div className="flex-1"></div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiShare2 className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiBookmark className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 h-96 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center text-9xl">
          {post.image}
        </div>

        {/* Author Info */}
        <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Written by</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-xl font-bold text-white">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author}</p>
              <p className="text-sm text-gray-600">{post.authorRole}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('##')) {
              return (
                <h2 key={idx} className="text-3xl font-serif font-bold text-gray-900 mt-8 mb-4">
                  {paragraph.replace('##', '').trim()}
                </h2>
              );
            }
            return (
              <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="mb-12 py-6 border-t border-b border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Tags</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?search=${tag}`}
                className="px-3 py-1 bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary-600 rounded-full text-sm font-medium transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all">
                    <div className="h-32 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-3xl">
                      {relatedPost.image}
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {relatedPost.category}
                      </span>
                      <h4 className="font-serif font-bold text-gray-900 mt-2 group-hover:text-primary-600 text-sm line-clamp-2">
                        {relatedPost.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Ready to transform your space?
          </h3>
          <p className="text-gray-600 mb-6">
            Explore our collection of handcrafted products mentioned in this article
          </p>
          <Link href={ROUTES.SHOP} className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
