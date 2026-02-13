/**
 * Dynamic SEO Metadata Generation
 * Generates Open Graph tags, JSON-LD structured data, and metadata
 * for better social sharing and search engine optimization
 */

import { Metadata } from 'next';

interface SEOProductData {
  name: string;
  description: string;
  price: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  image: string;
  productUrl: string;
  brand?: string;
  category?: string;
}

interface SEOArticleData {
  title: string;
  description: string;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  image?: string;
  articleUrl: string;
}

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(product: SEOProductData): Metadata {
  const { name, description, price, rating, image, productUrl, brand = 'Radhika\'s Homecraft' } = product;

  const title = `${name} | Premium Handcrafted Collections - ${brand}`;
  const ogDescription = `${description} • Price: ₹${price.toLocaleString('en-IN')}${rating ? ` • Rating: ${rating}★` : ''}`;

  return {
    title,
    description: ogDescription,
    openGraph: {
      title,
      description: ogDescription,
      url: productUrl,
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 800,
          alt: name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: ogDescription,
      images: [image],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

/**
 * Generate JSON-LD structured data for products
 * Helps Google and other search engines understand product info
 */
export function generateProductStructuredData(product: SEOProductData) {
  const { name, description, price, currency = 'INR', rating, reviewCount, image, productUrl, brand = 'Radhika\'s Homecraft' } = product;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    image,
    url: productUrl,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      url: productUrl,
    },
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.toString(),
        reviewCount: reviewCount?.toString() || '0',
      },
    }),
  };
}

/**
 * Generate metadata for article/blog pages
 */
export function generateArticleMetadata(article: SEOArticleData): Metadata {
  const { title, description, author, publishDate, image, articleUrl } = article;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: articleUrl,
      type: 'article',
      publishedTime: publishDate,
      ...(author && { authors: [author] }),
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

/**
 * Generate JSON-LD structured data for articles
 */
export function generateArticleStructuredData(article: SEOArticleData) {
  const { title, description, author, publishDate, modifiedDate, image, articleUrl } = article;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    author: {
      '@type': 'Person',
      name: author || 'Radhika\'s Homecraft Team',
    },
    url: articleUrl,
  };
}

/**
 * Generate JSON-LD for organization (for homepage)
 */
export function generateOrganizationSchema(config: {
  name: string;
  logo: string;
  description: string;
  url: string;
  email: string;
  phone?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  socialProfiles?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: config.url,
    logo: config.logo,
    description: config.description,
    email: config.email,
    telephone: config.phone,
    address: config.address ? {
      '@type': 'PostalAddress',
      ...config.address,
    } : undefined,
    sameAs: config.socialProfiles || [],
  };
}

/**
 * Generate JSON-LD for LocalBusiness (if applicable)
 */
export function generateLocalBusinessSchema(config: {
  name: string;
  image: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHours?: Array<{ day: string; opens: string; closes: string }>;
  priceRange?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    image: config.image,
    name: config.name,
    description: config.description,
    url: config.url,
    telephone: config.telephone,
    email: config.email,
    address: {
      '@type': 'PostalAddress',
      ...config.address,
    },
    openingHoursSpecification: config.openingHours?.map((oh) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: oh.day,
      opens: oh.opens,
      closes: oh.closes,
    })),
    priceRange: config.priceRange,
  };
}

/**
 * Generate JSON-LD for BreadcrumbList (for navigation)
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Format JSON-LD for Next.js Script component
 */
export function formatJsonLd(data: any): string {
  return JSON.stringify(data);
}
