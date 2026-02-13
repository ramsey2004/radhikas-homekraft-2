'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import {
  STORE_NAME,
  STORE_ADDRESS,
  STORE_EMAIL,
  STORE_PHONE,
  SOCIAL_LINKS,
  ROUTES,
} from '@/lib/constants';
import NewsletterForm from '@/components/NewsletterForm';

export function Footer() {

  return (
    <footer className="bg-dark-50 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-dark-100 bg-primary-600 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <NewsletterForm
            title="Join Our Community"
            description="Subscribe to get special offers, new arrivals, and craft stories delivered to your inbox."
            placeholder="Enter your email"
            buttonText="Subscribe"
            variant="footer"
          />
        </div>
      </div>

      {/* Main Footer */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* About */}
            <div>
              <h4 className="mb-4 font-serif text-lg font-bold">About {STORE_NAME}</h4>
              <p className="mb-4 text-gray-300 text-sm">
                We celebrate the art of Indian handicrafts, bringing authentic, handcrafted textiles and
                home decor from Jaipur to your home.
              </p>
              <div className="flex gap-4">
                {SOCIAL_LINKS.facebook && (
                  <a 
                    href={SOCIAL_LINKS.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Follow us on Facebook"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    <FaFacebook className="h-5 w-5" />
                  </a>
                )}
                {SOCIAL_LINKS.instagram && (
                  <a 
                    href={SOCIAL_LINKS.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Follow us on Instagram"
                    className="text-gray-300 hover:text-pink-400 transition-colors"
                  >
                    <FaInstagram className="h-5 w-5" />
                  </a>
                )}
                {SOCIAL_LINKS.twitter && (
                  <a 
                    href={SOCIAL_LINKS.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Follow us on Twitter"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    <FaTwitter className="h-5 w-5" />
                  </a>
                )}
                {SOCIAL_LINKS.youtube && (
                  <a 
                    href={SOCIAL_LINKS.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Subscribe on YouTube"
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <FaYoutube className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 font-serif text-lg font-bold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={ROUTES.SHOP} className="text-gray-300 hover:text-white">
                    Shop All Products
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.ABOUT} className="text-gray-300 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.BLOG} className="text-gray-300 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.CONTACT} className="text-gray-300 hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="mb-4 font-serif text-lg font-bold">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/shipping-returns" className="text-gray-300 hover:text-white">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.FAQ} className="text-gray-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <a href="/care-guide" className="text-gray-300 hover:text-white">
                    Care Guide
                  </a>
                </li>
                <li>
                  <Link href="/track-order" className="text-gray-300 hover:text-white">
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="mb-4 font-serif text-lg font-bold">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-1 h-4 w-4 flex-shrink-0" />
                  <span className="text-gray-300">{STORE_ADDRESS}</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaPhone className="h-4 w-4" />
                  <a href={`tel:${STORE_PHONE}`} className="text-gray-300 hover:text-white">
                    {STORE_PHONE}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="h-4 w-4" />
                  <a href={`mailto:${STORE_EMAIL}`} className="text-gray-300 hover:text-white">
                    {STORE_EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 border-t border-dark-100 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Refund Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
