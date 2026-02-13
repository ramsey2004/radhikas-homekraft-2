import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { StickyHeader } from '@/components/layout/StickyHeader';
import { Footer } from '@/components/layout/Footer';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { CustomCursor } from '@/components/CustomCursor';
import { StickyCartButton } from '@/components/StickyCartButton';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { ComparisonCounter } from '@/components/ComparisonButton';
import './globals.css';

export const metadata: Metadata = {
  title: "Radhika's Homecraft - Premium Handcrafted Indian Textiles & Home Decor",
  description:
    'Artistry Unleashed - Experience the soul of tradition woven into every print. Handcrafted textiles, block print bedsheets, rugs & home decor from Jaipur. Premium quality with free shipping on orders over ₹2000.',
  keywords: [
    'indian handicrafts',
    'block print',
    'textiles',
    'home decor',
    'jaipur textiles',
    'bedsheet',
    'rug',
    'artisan',
    'handcrafted',
    'block printed',
    'traditional textiles',
  ],
  authors: [{ name: 'Radhika Craft Team' }],
  creator: 'Radhika Craft Team',
  publisher: "Radhika's Homecraft",
  robots: {
    index: true,
    follow: true,
    googleBot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  alternates: {
    canonical: 'https://radhikashomecraft.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://radhikashomecraft.com',
    siteName: "Radhika's Homecraft",
    title: "Radhika's Homecraft - Premium Handcrafted Indian Textiles",
    description:
      'Experience the soul of tradition woven into every print. Handcrafted textiles, block print bedsheets, rugs & home decor from Jaipur.',
    images: [
      {
        url: 'https://radhikashomecraft.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Radhika's Homecraft - Premium Handcrafted Collections",
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@radhikashomecraft',
    creator: '@radhikashomecraft',
    title: "Radhika's Homecraft - Premium Handcrafted Indian Textiles",
    description:
      'Experience tradition woven into every print. Handcrafted textiles, block print bedsheets, and more from Jaipur.',
    images: ['https://radhikashomecraft.com/og-image.jpg'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS Prefetch and Preconnect */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />

        {/* Color Scheme and Branding */}
        <meta name="color-scheme" content="light dark" />
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C85A3A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Radhika's Homecraft" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />

        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#C85A3A" />

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Source+Sans+Pro:wght@400;600;700&family=Hanken+Grotesque:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Google Analytics */}
        {gaId && <GoogleAnalytics gaId={gaId} />}

        {/* Main Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: "Radhika's Homecraft",
              url: 'https://radhikashomecraft.com',
              logo: 'https://radhikashomecraft.com/logo.png',
              description:
                'Experience the soul of tradition woven into every print. Authentic Indian handicrafts, handcrafted textiles, and home decor from Jaipur.',
              image: 'https://radhikashomecraft.com/og-image.jpg',
              telephone: '+91-8239316066',
              email: 'radhikashomekraft.in',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Jaipur',
                addressLocality: 'Jaipur',
                addressRegion: 'Rajasthan',
                postalCode: '302000',
                addressCountry: 'IN',
              },
              sameAs: [
                'https://www.facebook.com/radhikashomecraft',
                'https://www.instagram.com/radhikashomecraft',
                'https://www.twitter.com/radhikashomecraft',
                'https://www.youtube.com/c/radhikashomecraft',
              ],
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  contactType: 'Customer Service',
                  telephone: '+91-8239316066',
                  email: 'radhikashomekraft.in',
                  contactOption: 'TollFree',
                  areaServed: 'IN',
                  availableLanguage: 'en',
                },
              ],
            }),
          }}
        />

        {/* WebSite Schema for Search Box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: 'https://radhikashomecraft.com',
              name: "Radhika's Homecraft",
              description: 'Premium Handcrafted Indian Textiles & Home Decor',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://radhikashomecraft.com/products?search={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="bg-neutral-50 dark:bg-gray-900 font-sans text-dark-50 dark:text-gray-100 transition-colors duration-300">
        <Providers>
          <CustomCursor />
          <StickyCartButton />
          <ComparisonCounter />
          <ExitIntentPopup 
            discount={15}
            headline="Don't Leave Empty-Handed!"
            subheadline="Get 15% off your first order"
          />
          <StickyHeader />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
