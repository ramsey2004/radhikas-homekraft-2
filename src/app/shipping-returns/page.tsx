'use client';

import Link from 'next/link';
import { FiTruck, FiRotateCcw, FiMapPin, FiCalendar } from 'react-icons/fi';
import Breadcrumb from '@/components/Breadcrumb';
import { ROUTES } from '@/lib/constants';

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold mb-2">Shipping & Returns</h1>
          <p className="text-primary-100">We want you to be completely satisfied with your purchase</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Shipping & Returns' },
          ]}
        />

        {/* Shipping Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FiTruck className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">Shipping Information</h2>
          </div>

          <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded mb-6">
            <h3 className="font-semibold text-lg mb-2 text-primary-900">Free Shipping</h3>
            <p className="text-primary-800">On all orders above ₹2,000 within India</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FiCalendar className="h-5 w-5 text-primary-600" />
                Delivery Timeline
              </h3>
              <div className="space-y-3 ml-7">
                <div>
                  <p className="font-medium text-gray-900">Metro Cities (Delhi, Mumbai, Bangalore, Chennai, Hyderabad)</p>
                  <p className="text-gray-600">3-5 business days</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tier 1 & 2 Cities</p>
                  <p className="text-gray-600">5-7 business days</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Remote/Tier 2 Areas</p>
                  <p className="text-gray-600">7-12 business days</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FiMapPin className="h-5 w-5 text-primary-600" />
                Shipping Rates
              </h3>
              <div className="ml-7 space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Orders above ₹2,000</span>
                  <span className="font-semibold text-gray-900">FREE</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Orders between ₹1,000 - ₹2,000</span>
                  <span className="font-semibold text-gray-900">₹99</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Orders below ₹1,000</span>
                  <span className="font-semibold text-gray-900">₹149</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">Remote Pincodes Surcharge</span>
                  <span className="font-semibold text-gray-900">+₹50 - ₹200</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Tracking Your Order</h3>
              <p className="text-gray-700">
                Once your order ships, you'll receive an email with a tracking number and a link to track 
                your package in real-time. You can also track your order using your Order ID on our 
                <Link href="/track-order" className="text-primary-600 hover:underline"> Track Order page</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Returns Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FiRotateCcw className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">Return Policy</h2>
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded mb-6">
            <h3 className="font-semibold text-lg mb-2 text-green-900">30-Day Return Guarantee</h3>
            <p className="text-green-800">If you're not satisfied with your purchase, you can return it within 30 days for a refund or exchange</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Eligibility for Returns</h3>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">Product must be unused and in original condition</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">Original packaging and tags must be intact</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">Return requested within 30 days of delivery</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span className="text-gray-700">Order must have been purchased from our official website</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Non-Returnable Items</h3>
              <p className="text-gray-700 mb-3">
                The following items cannot be returned:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">×</span>
                  <span className="text-gray-700">Customized or personalized products</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">×</span>
                  <span className="text-gray-700">Items showing signs of wear or damage</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">×</span>
                  <span className="text-gray-700">Products washed, dry-cleaned, or ironed</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">×</span>
                  <span className="text-gray-700">Final sale or clearance items</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">How to Return</h3>
              <ol className="space-y-3 ml-4">
                <li className="flex gap-3">
                  <span className="font-bold text-primary-600">1.</span>
                  <span className="text-gray-700">Contact our support team at <a href="mailto:support@radhikashomecraft.com" className="text-primary-600 hover:underline">support@radhikashomecraft.com</a> with your Order ID</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary-600">2.</span>
                  <span className="text-gray-700">We'll provide you with a prepaid return label (if eligible)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary-600">3.</span>
                  <span className="text-gray-700">Pack the item securely and use the provided label to ship</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary-600">4.</span>
                  <span className="text-gray-700">Once received and inspected, we'll process your refund within 7-10 business days</span>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Refunds</h3>
              <p className="text-gray-700 mb-3">
                We offer a full refund of the product price. Please note:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span className="text-gray-700">Original shipping charges are non-refundable (unless return is due to our error)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span className="text-gray-700">Refunds are processed to the original payment method</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span className="text-gray-700">Please allow 5-7 business days for funds to appear in your account</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Exchange Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Exchanges</h2>
          <p className="text-gray-700 mb-4">
            If you'd like to exchange a product for a different size, color, or item, please:
          </p>
          <ol className="space-y-3 ml-4 mb-6">
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">1.</span>
              <span>Contact us within 30 days of delivery</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">2.</span>
              <span>Return the original item in unused condition</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">3.</span>
              <span>We'll send you the replacement at no additional cost</span>
            </li>
          </ol>
        </section>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Still Have Questions?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our customer support team is here to help. Reach out to us via email or phone, 
            and we'll be happy to assist you with any concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@radhikashomecraft.com"
              className="btn btn-primary"
            >
              Email Support
            </a>
            <a
              href="tel:+918239316066"
              className="btn btn-outline"
            >
              Call Us: +91-8239-316066
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
