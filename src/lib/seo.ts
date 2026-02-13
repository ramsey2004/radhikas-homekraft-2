// SEO utilities for generating structured data and metadata

export function generateProductSchema(product: {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: `https://radhikashomecraft.com/products/${product.slug}`,
    image: `https://radhikashomecraft.com/api/placeholder/${product.id}`,
    brand: {
      '@type': 'Brand',
      name: "Radhika's Homecraft",
    },
    offers: {
      '@type': 'Offer',
      url: `https://radhikashomecraft.com/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price.toString(),
      priceValidUntil: new Date(new Date().setDate(new Date().getDate() + 30))
        .toISOString()
        .split('T')[0],
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
    },
  };
}

export function generateBreadcrumbSchema(items: { label: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: (index + 1).toString(),
      name: item.label,
      ...(item.url && { item: item.url }),
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Radhika's Homecraft",
    url: 'https://radhikashomecraft.com',
    logo: 'https://radhikashomecraft.com/logo.png',
    description:
      'Experience the soul of tradition woven into every print. Authentic Indian handicrafts.',
    founded: '2020',
    sameAs: [
      'https://www.facebook.com/radhikashomecraft',
      'https://www.instagram.com/radhikashomecraft',
      'https://www.twitter.com/radhikashomecraft',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+91-8239316066',
      email: 'radhikashomekraft.in',
    },
    location: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'Rajasthan',
      addressLocality: 'Jaipur',
      streetAddress: '11-B Purohit Ji Ka Bagh, Gopinath Marg, MI Road',
    },
  };
}
