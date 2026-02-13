'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { CONTACT_SUBJECTS, STORE_ADDRESS, STORE_EMAIL, STORE_PHONE } from '@/lib/constants';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/contact', formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="section bg-primary-600 text-white">
        <div className="section-container text-center">
          <h1 className="mb-4 font-serif text-5xl font-bold">Contact Us</h1>
          <p className="text-lg text-primary-100">
            We&rsquo;d love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section">
        <div className="section-container">
          <div className="grid gap-12 md:grid-cols-3">
            {/* Contact Info */}
            <div className="md:col-span-1">
              <div className="space-y-8">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <FiMapPin className="h-6 w-6 text-primary-600" />
                    <h3 className="font-serif text-lg font-bold">Address</h3>
                  </div>
                  <p className="text-gray-600">{STORE_ADDRESS}</p>
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <FiPhone className="h-6 w-6 text-primary-600" />
                    <h3 className="font-serif text-lg font-bold">Phone</h3>
                  </div>
                  <p className="text-gray-600">
                    <a href={`tel:${STORE_PHONE}`} className="link">
                      {STORE_PHONE}
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Mon-Sat, 10 AM - 6 PM IST</p>
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <FiMail className="h-6 w-6 text-primary-600" />
                    <h3 className="font-serif text-lg font-bold">Email</h3>
                  </div>
                  <p className="text-gray-600">
                    <a href={`mailto:${STORE_EMAIL}`} className="link">
                      {STORE_EMAIL}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-neutral-50 p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input w-full"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input w-full"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="+91-9999999999"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input w-full"
                    >
                      <option value="">Select a subject</option>
                      {CONTACT_SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input w-full resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-neutral-50">
        <div className="section-container">
          <h2 className="mb-12 text-center font-serif text-4xl font-bold">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {[
              {
                q: 'What is your return policy?',
                a: 'We offer 30-day returns on all products in original condition. Check our Returns & Refunds policy for details.',
              },
              {
                q: 'How long does shipping take?',
                a: 'Standard shipping takes 5-7 business days within India. Express options available in select areas.',
              },
              {
                q: 'Do you ship internationally?',
                a: 'Currently, we ship within India. International shipping coming soon!',
              },
              {
                q: 'How should I care for my handcrafted items?',
                a: 'Each product comes with care instructions. Generally, gentle washing and air-drying is recommended.',
              },
            ].map((faq, index) => (
              <div key={index} className="card">
                <h3 className="mb-3 font-serif text-lg font-bold">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
