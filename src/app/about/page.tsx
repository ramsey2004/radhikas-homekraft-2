import { Metadata } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Award, Heart, MapPin, Clock, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - Radhika\'s Homecraft',
  description: 'Learn about Radhika\'s Homecraft and our mission to bring authentic Indian handicrafts to your home.',
};

const COLORS = {
  deepTeal: '#1A7A6E',
  gold: '#C9A84C',
  ivory: '#FAF3E0',
  charcoal: '#2D2D2D',
  lightBeige: '#E8D5C4',
};

const stats = [
  { label: 'Artisans Supported', value: '500+', icon: Users },
  { label: 'Years of Tradition', value: '25+', icon: Clock },
  { label: 'Products Crafted', value: '10,000+', icon: Award },
  { label: 'Happy Customers', value: '50,000+', icon: Heart },
];

const team = [
  {
    name: 'Radhika Sharma',
    role: 'Founder & Master Artisan',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
    bio: 'With 25 years of experience in traditional Indian crafts, Radhika leads our artisan community with passion and expertise.'
  },
  {
    name: 'Amit Kumar',
    role: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    bio: 'Amit brings modern aesthetics to traditional techniques, creating pieces that bridge heritage and contemporary design.'
  },
  {
    name: 'Priya Patel',
    role: 'Quality Assurance',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    bio: 'Priya ensures every product meets our high standards of craftsmanship and sustainability.'
  }
];

const values = [
  {
    title: 'Authentic Craftsmanship',
    description: 'Every piece is handcrafted by skilled artisans using traditional techniques passed down through generations.',
    icon: Award
  },
  {
    title: 'Sustainable Practices',
    description: 'We use eco-friendly materials and processes that respect both our artisans and the environment.',
    icon: Heart
  },
  {
    title: 'Fair Trade',
    description: 'Our artisans receive fair wages and work in safe, dignified conditions that support their communities.',
    icon: Users
  },
  {
    title: 'Cultural Preservation',
    description: 'We actively work to preserve and promote India\'s rich textile and craft heritage for future generations.',
    icon: MapPin
  }
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: COLORS.ivory, minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ backgroundColor: COLORS.deepTeal, color: COLORS.ivory, paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-light tracking-wider mb-6"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg max-w-3xl mx-auto"
          >
            Preserving India&apos;s rich textile heritage through sustainable craftsmanship and empowering local artisans.
          </motion.p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.lightBeige }}>
                <stat.icon size={32} style={{ color: COLORS.deepTeal }} />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: COLORS.gold }}>{stat.value}</div>
              <div className="text-sm" style={{ color: COLORS.charcoal }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-light mb-6" style={{ color: COLORS.charcoal }}>
              From Jaipur&apos;s Workshops to Your Home
            </h2>
            <div className="space-y-4 text-lg leading-relaxed" style={{ color: COLORS.charcoal }}>
              <p>
                Founded in 1999, Radhika&apos;s Homecraft began as a small workshop in Jaipur, India&apos;s
                &quot;Pink City&quot; and the heart of traditional craftsmanship. What started as a passion
                for preserving dying art forms has grown into a global movement.
              </p>
              <p>
                Our founder, Radhika Sharma, recognized that traditional artisans were struggling to
                compete with mass-produced goods. She created a platform that not only preserves
                these ancient techniques but also provides fair wages and sustainable livelihoods
                for hundreds of families.
              </p>
              <p>
                Today, we work with over 500 skilled artisans across Rajasthan, ensuring that
                traditional crafts like block printing, hand-weaving, and ceramic work continue
                to thrive in the modern world.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <Image
              src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&h=400&fit=crop"
              alt="Artisan at work"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" style={{ backgroundColor: COLORS.lightBeige }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-light mb-4" style={{ color: COLORS.charcoal }}>Our Values</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.charcoal }}>
            These principles guide everything we do, from sourcing materials to delivering finished products.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-6 rounded-lg" style={{ backgroundColor: COLORS.ivory }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.deepTeal }}>
                <value.icon size={24} style={{ color: COLORS.gold }} />
              </div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: COLORS.deepTeal }}>{value.title}</h3>
              <p className="text-sm" style={{ color: COLORS.charcoal }}>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-light mb-4" style={{ color: COLORS.charcoal }}>Meet Our Team</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.charcoal }}>
            The passionate individuals who bring traditional crafts to the modern world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative w-48 h-48 mx-auto mb-6">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.deepTeal }}>{member.name}</h3>
              <p className="text-sm font-medium mb-4" style={{ color: COLORS.gold }}>{member.role}</p>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.charcoal }}>{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center p-8 rounded-lg"
          style={{ backgroundColor: COLORS.deepTeal, color: COLORS.ivory }}
        >
          <h2 className="text-3xl font-light mb-4">Join Our Craft Community</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Experience the beauty of traditional Indian craftsmanship. Every purchase supports our artisans
            and helps preserve cultural heritage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/collections"
              className="px-8 py-3 rounded-lg font-medium transition-all inline-block"
              style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
            >
              Explore Our Collections
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 rounded-lg font-medium transition-all inline-block border-2"
              style={{ borderColor: COLORS.gold, color: COLORS.gold }}
            >
              Get In Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
