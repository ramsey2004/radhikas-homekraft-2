'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiCheck, FiTruck, FiLock, FiTag, FiUser } from 'react-icons/fi';
import { ROUTES } from '@/lib/constants';
import { useCart } from '@/hooks/useCart';
import OptimizedImage from '@/components/OptimizedImage';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [hasMounted, setHasMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmation'>(
    'cart'
  );
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [orderNumber, setOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const subtotal = getTotalPrice();
  const shippingCost = subtotal > 2000 ? 0 : 99;
  const discountAmount = Math.floor(subtotal * (discount / 100));
  const total = subtotal + shippingCost - discountAmount;

  // Prevent hydration mismatch by not rendering until client is ready
  if (!hasMounted) {
    return <div className="h-screen" />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.address &&
      formData.city &&
      formData.state &&
      formData.zipCode
    );
  };

  const applyPromoCode = () => {
    const codes: { [key: string]: number } = {
      'RADHIKA10': 10,
      'CRAFT15': 15,
      'SAVE20': 20,
    };
    if (codes[promoCode.toUpperCase()]) {
      setDiscount(codes[promoCode.toUpperCase()]);
    } else {
      alert('Invalid promo code');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order items from cart
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      // Call guest order API
      const response = await fetch('/api/orders/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          items: orderItems,
          paymentMethod: 'RAZORPAY',
          subtotal,
          shipping: shippingCost,
          discount: discountAmount,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Order created successfully
      alert('Thank you! Your order has been placed successfully!');
      setOrderNumber(data.order.orderNumber);
      setCurrentStep('confirmation');
      clearCart();
    } catch (error) {
      console.error('Order creation error:', error);
      const message = error instanceof Error ? error.message : 'Failed to place order';
      alert(`Error: ${message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add some handcrafted items to get started!</p>
            <Link href={ROUTES.SHOP} className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FiCheck className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg">Thank you for your purchase</p>
          </div>

          <div className="bg-gray-50 border-2 border-green-600 rounded-lg p-8 mb-8">
            <div className="mb-6">
              <p className="text-gray-600 uppercase tracking-widest text-sm mb-1">Order Number</p>
              <p className="text-3xl font-bold text-gray-900">{orderNumber}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-t border-b">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
                <p className="text-gray-700">
                  {formData.firstName} {formData.lastName}
                  <br />
                  {formData.address}
                  <br />
                  {formData.city}, {formData.state} {formData.zipCode}
                  <br />
                  {formData.country}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contact Info</h3>
                <p className="text-gray-700">
                  Email: {formData.email}
                  <br />
                  Phone: {formData.phone}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <FiTruck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Estimated Delivery</p>
                <p className="text-sm text-blue-800">5-7 business days</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <FiLock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Secure & Protected</p>
                <p className="text-sm text-green-800">
                  Your order is protected by our buyer protection policy
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              You&rsquo;ll receive an email confirmation with tracking details
            </p>
            <Link href={ROUTES.HOME} className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href={ROUTES.SHOP} className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
              <FiArrowLeft className="h-5 w-5" />
              Back to Shop
            </Link>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
              <FiUser className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Guest Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {['cart', 'shipping', 'payment', 'confirmation'].map((step, idx) => (
              <div key={step} className="flex items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    (currentStep === step || ['cart', 'shipping', 'payment'].indexOf(currentStep) >= idx)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < 3 && <div className="h-1 flex-1 mx-2 bg-gray-200"></div>}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Cart</span>
            <span>Shipping</span>
            <span>Payment</span>
            <span>Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'cart' && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6 border-b pb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <OptimizedImage
                          src={`/images/products/${item.product.slug}-1.jpg` || '/api/placeholder'}
                          alt={`${item.product.name} - ${item.product.material}`}
                          width={80}
                          height={80}
                          sizes="80px"
                          priority={false}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <FiTag className="inline mr-2" />
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Try: RADHIKA10, CRAFT15, or SAVE20</p>
                </div>

                <button
                  onClick={() => setCurrentStep('shipping')}
                  className="w-full btn btn-primary py-3"
                >
                  Proceed to Shipping
                </button>
              </div>
            )}

            {currentStep === 'shipping' && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address *"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State *"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code *"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                  />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setCurrentStep('cart')}
                    className="flex-1 btn btn-outline py-3"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep('payment')}
                    className="flex-1 btn btn-primary py-3"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Payment</h2>
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-3">
                    <FiLock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-blue-900">Secure Payment Gateway</p>
                      <p className="text-sm text-blue-800">Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <label className="flex items-center p-4 border-2 border-primary-600 rounded-lg cursor-pointer bg-primary-50">
                    <input type="radio" defaultChecked className="w-5 h-5" />
                    <span className="ml-3 font-semibold">Credit / Debit Card</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" className="w-5 h-5" />
                    <span className="ml-3 font-semibold">UPI</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" className="w-5 h-5" />
                    <span className="ml-3 font-semibold">Net Banking</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep('shipping')}
                    disabled={isProcessing}
                    className="flex-1 btn btn-outline py-3 disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Total</h3>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary-600">₹{total.toLocaleString()}</span>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex gap-2">
                  <FiTruck className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Free shipping on orders above ₹2000</span>
                </div>
                <div className="flex gap-2">
                  <FiCheck className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>30-day easy return policy</span>
                </div>
                <div className="flex gap-2">
                  <FiLock className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>100% secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
