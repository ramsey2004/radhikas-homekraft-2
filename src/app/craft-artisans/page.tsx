'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const COLORS = {
  deepTeal: '#1A7A6E',
  gold: '#C9A84C',
  ivory: '#FAF9F6',
  charcoal: '#2D2D2D',
};

export default function CraftArtisansPage() {
  return (
    <div className="w-full overflow-hidden" style={{ backgroundColor: COLORS.ivory }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-light tracking-widest" style={{ color: COLORS.deepTeal }}>
            RADHIKA'S
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1578926078328-123456789012?w=1600&h=1200&fit=crop"
          alt="Artisan crafting handmade ceramics"
          fill
          className="object-cover"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-12 lg:px-20"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif mb-4" style={{ color: COLORS.ivory }}>
            Craft & Artisans
          </h1>
          <p className="text-lg sm:text-xl" style={{ color: COLORS.gold }}>
            The story behind every carefully crafted piece
          </p>
        </motion.div>
      </section>

      {/* Content Section 1: Where Sourcing Happens */}
      <section className="w-full py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-serif mb-6" style={{ color: COLORS.deepTeal }}>
                Where It Begins
              </h2>
              <p className="text-lg mb-4" style={{ color: COLORS.charcoal }}>
                We work directly with master artisans across Rajasthan, Madhya Pradesh, and Gujarat. Each region brings its own tradition, technique, and aesthetic.
              </p>
              <p className="text-lg mb-4" style={{ color: COLORS.charcoal }}>
                Our sourcing philosophy is simple: direct relationships, fair wages, and zero exploitation. We visit workshops regularly, understand their challenges, and build long-term partnerships.
              </p>
              <p className="text-lg" style={{ color: COLORS.charcoal }}>
                By working directly with makers, we eliminate unnecessary middlemen. This allows us to offer fair prices to artisans while maintaining our luxury positioning.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-lg overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1578026474691-f01f1e45de8d?w=800&h=800&fit=crop"
                alt="Artisan at work"
                fill
                className="object-cover"
                quality={85}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Breathing Space */}
      <section 
        className="w-full py-12 sm:py-16"
        style={{ backgroundColor: COLORS.ivory }}
      />

      {/* Content Section 2: Why Finishing Matters */}
      <section className="w-full py-16 sm:py-20 md:py-24" style={{ backgroundColor: 'white' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-lg overflow-hidden order-2 md:order-1"
            >
              <Image
                src="https://images.unsplash.com/photo-1578926078328-789456123012?w=800&h=800&fit=crop"
                alt="Finishing details"
                fill
                className="object-cover"
                quality={85}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <h2 className="text-4xl sm:text-5xl font-serif mb-6" style={{ color: COLORS.deepTeal }}>
                The Finishing Difference
              </h2>
              <p className="text-lg mb-4" style={{ color: COLORS.charcoal }}>
                In luxury, finishing is everything. A handwoven textile isn't complete until the selvage is perfected. A ceramic piece requires the right glaze, the right burnish.
              </p>
              <p className="text-lg mb-4" style={{ color: COLORS.charcoal }}>
                We work with artisans to refine their finishing techniques, using sustainable dyes, natural oils, and traditional methods that respect both the craft and the environment.
              </p>
              <p className="text-lg" style={{ color: COLORS.charcoal }}>
                This attention to detail is why a Radhika's Homekraft product feels different the moment you touch it.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section 3: Material Choices */}
      <section className="w-full py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-serif mb-6" style={{ color: COLORS.deepTeal }}>
              Material Integrity
            </h2>
            <p className="text-lg mb-6" style={{ color: COLORS.charcoal }}>
              We believe luxury materials shouldn't compromise ethics. Every material is chosen for three reasons: beauty, durability, and responsibility.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Organic Cotton',
                description: 'Grown without pesticides, woven with precision. Our cotton linens are breathable, durable, and improve with every wash.',
              },
              {
                title: 'Natural Ceramics',
                description: 'Clay sourced from sustainable deposits. Hand-thrown and finished with natural glazes that are food-safe and non-toxic.',
              },
              {
                title: 'Repurposed Wood',
                description: 'We use reclaimed and sustainably-harvested timber. Every piece of wood has a history, now reborn.',
              },
            ].map((material, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-xl font-serif mb-4" style={{ color: COLORS.deepTeal }}>
                  {material.title}
                </h3>
                <p style={{ color: COLORS.charcoal }}>
                  {material.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Breathing Space */}
      <section 
        className="w-full py-12 sm:py-16"
        style={{ backgroundColor: COLORS.ivory }}
      />

      {/* Content Section 4: Quality Control */}
      <section className="w-full py-16 sm:py-20 md:py-24" style={{ backgroundColor: 'white' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-serif mb-6" style={{ color: COLORS.deepTeal }}>
              Uncompromising Quality
            </h2>
            <p className="text-lg mb-8 max-w-2xl" style={{ color: COLORS.charcoal }}>
              Every Radhika's product passes through multiple quality checkpoints before reaching you. Not just for defects—we check for character, consistency, and purpose.
            </p>

            <div className="space-y-6">
              {[
                'Hand inspection at artisan workshops',
                'Texture and finish verification',
                'Color accuracy across batches',
                'Durability and wear testing',
                'Packaging for safe transit',
                'Final inspection before dispatch',
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: COLORS.gold }} />
                  <p style={{ color: COLORS.charcoal }}>{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 sm:py-20 md:py-24" style={{ backgroundColor: COLORS.ivory }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-serif mb-6" style={{ color: COLORS.deepTeal }}>
              Discover the Craft
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: COLORS.charcoal }}>
              When you choose Radhika's Homekraft, you're purchasing more than a product. You're supporting artisans, preserving traditions, and investing in timeless quality.
            </p>
            <Link 
              href="/collections/bedsheets"
              className="inline-block px-8 py-3 text-sm tracking-widest font-medium transition-all duration-300"
              style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              SHOP CURATED COLLECTIONS
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12 sm:py-16" style={{ backgroundColor: COLORS.deepTeal }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="border-t pt-8" style={{ borderColor: COLORS.gold }}>
            <p className="text-center text-xs" style={{ color: COLORS.ivory }}>
              &copy; 2026 Radhika's Homekraft. Craft & Artisans
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
