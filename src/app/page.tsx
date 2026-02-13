'use client';

import Link from 'next/link';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ROUTES, STORE_TAGLINE } from '@/lib/constants';
import { PRODUCTS, CATEGORIES, TESTIMONIALS } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Avatar from '@/components/Avatar';
import { ShieldIcon, VerifiedIcon, TruckIcon, CheckIcon, getCategoryIcon } from '@/components/Icons';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { 
  slideInUp, 
  slideInLeft,
  slideInDown,
  staggerContainer, 
  staggerItem, 
  scaleIn,
} from '@/lib/animations';
import { 
  FadeInOnScroll, 
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
} from '@/components/ScrollAnimations';

export default function HomePage() {
  return (
    <div className="bg-white" suppressHydrationWarning>
      {/* Exit Intent Popup */}
      <ExitIntentPopup />
      
      {/* Hero Section - Professional Design */}
      <section className="relative overflow-hidden py-8 sm:py-12 md:py-20 lg:py-28">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#pattern)" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 items-center">
            {/* Text content */}
            <motion.div
              initial={false}
              animate={false}
              variants={slideInLeft}
              custom={0}
            >
              <motion.p 
                className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-4"
                variants={slideInDown}
                custom={0}
                initial={false}
              >
                Authentic Indian Handicrafts
              </motion.p>
              <motion.h1 
                className="mb-6 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                variants={slideInDown}
                custom={0.1}
                initial={false}
              >
                {STORE_TAGLINE}
              </motion.h1>
              <motion.p 
                className="mb-8 text-lg text-gray-700"
                variants={slideInDown}
                custom={0.2}
                initial={false}
              >
                Discover authentic textiles, rugs, wall art, and home décor that bring character and warmth to your space.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8"
                variants={staggerContainer}
                initial={false}
                animate={false}
              >
                <motion.div variants={staggerItem} suppressHydrationWarning>
                  <Link href={ROUTES.SHOP} className="btn btn-accent inline-flex gap-2 justify-center px-8 py-4 text-lg">
                    Shop Now <FiArrowRight className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div variants={staggerItem} suppressHydrationWarning>
                  <Link href={ROUTES.ABOUT} className="btn border-2 border-gray-900 text-gray-900 hover:bg-gray-50 justify-center px-8 py-4 text-lg">
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div 
                className="flex items-center gap-6 text-sm text-gray-600"
                variants={slideInUp}
                custom={0.5}
                initial={false}
              >
                <div className="flex items-center gap-2">
                  <FiStar className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8+ Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">2000+ Customers</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero image - Professional placeholder */}
            <motion.div
              className="relative h-64 md:h-96 lg:h-full"
              initial={false}
              animate={false}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-100 via-slate-50 to-primary-50 border border-gray-200 overflow-hidden flex items-center justify-center group">
                {/* Placeholder content */}
                <div className="text-center px-6">
                  <div className="text-6xl font-serif font-bold text-slate-300 mb-4">RH</div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">Radhika&rsquo;s Homecraft</h2>
                  <p className="text-gray-600 mb-4">Premium Handcrafted Collections</p>
                  <div className="flex gap-3 justify-center text-sm text-gray-600 flex-wrap">
                    <span className="flex items-center gap-1"><CheckIcon className="h-4 w-4 text-green-600" /> Authentic</span>
                    <span className="flex items-center gap-1"><CheckIcon className="h-4 w-4 text-green-600" /> Handmade</span>
                    <span className="flex items-center gap-1"><CheckIcon className="h-4 w-4 text-green-600" /> Quality</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust/Benefits Section */}
      <section className="section bg-neutral-50">
        <div className="section-container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              {
                icon: <TruckIcon className="h-8 w-8" />,
                title: 'Free Shipping',
                description: 'On orders above ₹2000',
              },
              {
                icon: <VerifiedIcon className="h-8 w-8" />,
                title: 'Authentic Crafts',
                description: 'Handmade by skilled artisans',
              },
              {
                icon: <CheckIcon className="h-6 w-6" />,
                title: 'Quality Guaranteed',
                description: '30-day return policy',
              },
              {
                icon: <ShieldIcon className="h-8 w-8" />,
                title: 'Secure Payment',
                description: '100% safe & encrypted',
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center text-primary-600">{benefit.icon}</div>
                <h3 className="mb-2 font-serif text-lg font-bold">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section">
        <div className="section-container">
          <motion.div
            className="mb-12 text-center"
            initial={false}
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInUp}
          >
            <motion.span 
              className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-2 block"
              variants={scaleIn}
              initial={false}
            >
              Featured Collections
            </motion.span>
            <motion.h2 
              className="mb-4 font-serif text-4xl font-bold"
              variants={slideInUp}
              custom={0.1}
              initial={false}
            >
              Our Best Sellers
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              variants={slideInUp}
              custom={0.2}
              initial={false}
            >
              Discover our most loved handcrafted collections trusted by thousands of customers
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            variants={staggerContainer}
            initial={false}
            whileInView="visible"
            viewport={{ once: true }}
          >
            {PRODUCTS.slice(0, 4).map((product) => (
              <motion.div key={product.id} variants={staggerItem} suppressHydrationWarning>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  image={product.images[0]}
                  badge={product.badge || undefined}
                  description={product.description}
                  material={product.material}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link href={ROUTES.SHOP} className="btn btn-outline inline-flex gap-2 px-8 py-3">
              View All Products <FiArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section bg-white">
        <div className="section-container">
          <div className="mb-12 text-center">
            <FadeInOnScroll direction="up">
              <h2 className="mb-4 font-serif text-4xl font-bold">Shop by Category</h2>
              <p className="text-gray-600">Find exactly what you&rsquo;re looking for</p>
            </FadeInOnScroll>
          </div>

          <StaggerContainer>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
              {CATEGORIES.map((category) => (
                <StaggerItem key={category.id}>
                  <Link
                    href={`${ROUTES.SHOP}?category=${encodeURIComponent(category.name.toLowerCase())}`}
                    className="group card text-center hover:shadow-lg transition-shadow"
                  >
                    <motion.div 
                      className="mb-4 flex justify-center text-primary-600 group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: 10 }}
                      initial={false}
                      suppressHydrationWarning
                    >
                      {getCategoryIcon(category.icon, 'w-12 h-12')}
                    </motion.div>
                    <h3 className="mb-2 font-serif text-lg font-bold group-hover:text-primary-600">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">{category.productCount} products</p>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="section bg-gradient-to-r from-gray-50 to-primary-50">
        <div className="section-container">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInUp}
          >
            <motion.h2 
              className="mb-4 font-serif text-3xl font-bold"
              variants={slideInUp}
              custom={0}
            >
              Why Choose Radhika&rsquo;s Homecraft?
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              variants={slideInUp}
              custom={0.1}
            >
              Trusted by thousands of happy customers worldwide
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                number: 2000,
                label: 'Happy Customers',
                description: 'Join our growing community of satisfied buyers',
              },
              {
                number: 50,
                label: 'Artisans',
                description: 'Skilled craftspeople creating beautiful pieces',
              },
              {
                number: 100,
                label: 'Authentic Pieces',
                description: 'Directly sourced from certified artisans',
              },
              {
                number: 30,
                label: 'Day Returns',
                description: 'Easy returns for peace of mind',
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-6 text-center border border-gray-100 hover:shadow-md transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -4 }}
                suppressHydrationWarning
              >
                <motion.div 
                  className="text-3xl font-bold text-primary-600 mb-2"
                  initial={false}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedCounter 
                    end={stat.number} 
                    suffix={stat.label === 'Day Returns' ? '' : stat.label === 'Artisans' ? ' +' : '+'}
                    duration={2}
                  />
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">{stat.label}</h3>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 bg-white rounded-lg p-8 border-2 border-primary-200"
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Security & Trust</h3>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { icon: <ShieldIcon className="h-8 w-8" />, text: 'SSL Secured' },
                { icon: <VerifiedIcon className="h-8 w-8" />, text: 'Verified Seller' },
                { icon: <TruckIcon className="h-8 w-8" />, text: 'Tracked Delivery' },
                { icon: <CheckIcon className="h-8 w-8" />, text: 'Safe Payment' },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors text-primary-600"
                  variants={staggerItem}
                  whileHover={{ scale: 1.05 }}
                  suppressHydrationWarning
                >
                  <motion.div
                    className="mb-2"
                    whileHover={{ rotate: 10 }}
                    suppressHydrationWarning
                  >
                    {badge.icon}
                  </motion.div>
                  <p className="text-sm font-semibold text-gray-700">{badge.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="section bg-neutral-50">
        <div className="section-container">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInUp}
          >
            <motion.h2 
              className="mb-4 font-serif text-4xl font-bold"
              variants={slideInUp}
              custom={0}
            >
              What Our Customers Say
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              variants={slideInUp}
              custom={0.1}
            >
              Join thousands of happy customers
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {TESTIMONIALS.slice(0, 3).map((testimonial) => (
              <FadeInOnScroll key={testimonial.id}>
                <motion.div className="card" whileHover={{ y: -8 }} suppressHydrationWarning>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={false}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    {testimonial.verified && (
                      <p className="text-xs font-semibold text-green-600 flex items-center gap-1">
                        <CheckIcon className="h-3 w-3" /> Verified
                      </p>
                    )}
                  </div>
                  <p className="mb-6 text-sm italic text-gray-700 line-clamp-3">&ldquo;{testimonial.comment}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <Avatar initials={testimonial.image} name={testimonial.name} size="md" />
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeInOnScroll>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-secondary-600 to-secondary-700 text-white">
        <div className="section-container text-center">
          <h2 className="mb-4 font-serif text-4xl font-bold">Ready to Transform Your Home?</h2>
          <p className="mb-8 text-lg text-secondary-100">
            Discover our complete collection of handcrafted items
          </p>
          <Link href={ROUTES.SHOP} className="btn bg-white text-secondary-600 hover:bg-gray-100">
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
