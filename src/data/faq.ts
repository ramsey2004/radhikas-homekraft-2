export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number; // Track how many found this helpful
  tags: string[];
}

export const FAQ_ITEMS: FAQItem[] = [
  // Order & Shipping
  {
    id: 'faq-1',
    question: 'How long does delivery usually take?',
    answer: 'We offer free delivery on orders over ₹2000 within India. Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available for an additional fee. Once your order ships, you\'ll receive a tracking number via email.',
    category: 'Shipping & Delivery',
    helpful: 142,
    tags: ['delivery', 'shipping', 'timeline'],
  },
  {
    id: 'faq-2',
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to select countries in Asia, Europe, and North America. Shipping costs vary by destination. Please add items to your cart and enter your address to see if we deliver to you. International orders typically take 2-3 weeks.',
    category: 'Shipping & Delivery',
    helpful: 98,
    tags: ['international', 'shipping'],
  },
  {
    id: 'faq-3',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return guarantee on all items. If you\'re not completely satisfied, return your purchase for a full refund or exchange. Items must be unused and in original packaging. Return shipping is free for defective items.',
    category: 'Returns & Exchanges',
    helpful: 287,
    tags: ['returns', 'refund', 'policy'],
  },
  {
    id: 'faq-4',
    question: 'How do I initiate a return?',
    answer: 'Visit our website and go to "My Orders". Select the item you wish to return and click "Return Item". Fill out the return form explaining your reason. We\'ll send you a prepaid return label via email. Drop off your package at any courier center and you\'re done!',
    category: 'Returns & Exchanges',
    helpful: 156,
    tags: ['returns', 'process'],
  },
  
  // Product Care
  {
    id: 'faq-5',
    question: 'How should I wash my handwoven bedsheets?',
    answer: 'Use cold water (max 30°C) with a gentle detergent. Avoid bleach and harsh chemicals. Hand wash or use a gentle machine cycle. Air dry in shade to prevent color fading. Do not use a tumble dryer on high heat.',
    category: 'Product Care',
    helpful: 201,
    tags: ['bedsheets', 'washing', 'care'],
  },
  {
    id: 'faq-6',
    question: 'Can I machine wash my products?',
    answer: 'Yes, machine washing on a gentle cycle is fine. Use lukewarm water and delicate detergent. Wash separately or with similar colors to prevent bleeding. Place in a mesh laundry bag for extra protection.',
    category: 'Product Care',
    helpful: 167,
    tags: ['washing', 'maintenance'],
  },
  {
    id: 'faq-7',
    question: 'How do I remove stains from handwoven fabrics?',
    answer: 'Treat stains immediately with cold water. Gently rub the affected area with a soft brush or cloth. For stubborn stains, soak in cold water for 30 minutes, then wash gently. Avoid hot water and never use bleach on colored fabrics.',
    category: 'Product Care',
    helpful: 134,
    tags: ['stain-removal', 'cleaning'],
  },
  {
    id: 'faq-8',
    question: 'How should I store my textiles?',
    answer: 'Store in a cool, dry place away from direct sunlight. Use breathable cotton storage bags instead of plastic to allow air circulation. Avoid plastic containers which can trap moisture and cause mildew. Ensure storage area is pest-free.',
    category: 'Product Care',
    helpful: 89,
    tags: ['storage', 'maintenance'],
  },

  // Quality & Materials
  {
    id: 'faq-9',
    question: 'Are your products organic and eco-friendly?',
    answer: 'Yes! All our products are made from organic cotton, silk, and wool. We use only natural dyes from plant and mineral sources. Our production follows fair-trade practices and our products are biodegradable.',
    category: 'Quality & Materials',
    helpful: 213,
    tags: ['organic', 'eco-friendly', 'sustainable'],
  },
  {
    id: 'faq-10',
    question: 'Why are handwoven products more expensive?',
    answer: 'Handwoven textiles are created using traditional looms by skilled artisans. Each piece takes days to complete and involves intricate work. Unlike mass-produced items, these are unique, longer-lasting, and directly support artisan livelihoods. Quality justifies the investment.',
    category: 'Quality & Materials',
    helpful: 178,
    tags: ['pricing', 'quality', 'value'],
  },
  {
    id: 'faq-11',
    question: 'How long do your products typically last?',
    answer: 'With proper care, our handwoven products last 5-10 years or more. Many become softer and more beautiful with age. This longevity, combined with their artisan quality, makes them a better long-term investment than mass-produced alternatives.',
    category: 'Quality & Materials',
    helpful: 145,
    tags: ['durability', 'longevity'],
  },

  // Payment & Security
  {
    id: 'faq-12',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, UPI, net banking, and digital wallets like Google Pay and Apple Pay. All transactions are secured with 256-bit SSL encryption.',
    category: 'Payment & Security',
    helpful: 124,
    tags: ['payment', 'methods'],
  },
  {
    id: 'faq-13',
    question: 'Is my payment information secure?',
    answer: 'Absolutely! We use industry-standard 256-bit SSL encryption to protect all payment information. We do not store credit card details on our servers. Payment processing is handled by trusted partners like Stripe and Razorpay.',
    category: 'Payment & Security',
    helpful: 198,
    tags: ['security', 'payment', 'privacy'],
  },
  {
    id: 'faq-14',
    question: 'Do you offer installment payment options?',
    answer: 'Yes, orders over ₹5000 are eligible for EMI options through most credit cards and digital lending partners. EMI options vary by card issuer. Check at checkout for available installment plans.',
    category: 'Payment & Security',
    helpful: 76,
    tags: ['payment', 'emi', 'installment'],
  },

  // Customization & Special Orders
  {
    id: 'faq-15',
    question: 'Can I customize products or place bulk orders?',
    answer: 'Yes! We offer customization for bulk orders (minimum 10 pieces). Contact our sales team at sales@radhikas.com with your requirements. We can create custom colors, sizes, and designs for corporate gifts or events.',
    category: 'Custom Orders',
    helpful: 87,
    tags: ['custom', 'bulk', 'corporate'],
  },
];

export const FAQ_CATEGORIES = ['Shipping & Delivery', 'Returns & Exchanges', 'Product Care', 'Quality & Materials', 'Payment & Security', 'Custom Orders'];
