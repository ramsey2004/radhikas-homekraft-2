'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface CheckoutProps {
  cartItems: any[];
  onSuccess?: (orderId: string) => void;
}

export function Checkout({ cartItems, onSuccess }: CheckoutProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe' | 'cod'>('razorpay');
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const COLORS = {
    deepTeal: '#1A7A6E',
    gold: '#C9A84C',
    ivory: '#FAF3E0',
    charcoal: '#2D2D2D',
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 100;
  const gst = (subtotal + shipping) * 0.18;
  const total = subtotal + shipping + gst;

  const handleCreateOrder = async () => {
    if (!session?.user?.email) {
      toast.error('Please log in to continue');
      return;
    }

    setIsProcessing(true);
    try {
      // Create order
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Process payment based on method
      if (paymentMethod === 'razorpay') {
        processRazorpayPayment(data.payment, data.order.id);
      } else if (paymentMethod === 'cod') {
        // Cash on delivery - order is already confirmed
        toast.success('Order placed successfully!');
        onSuccess?.(data.order.id);
        router.push(`/orders/${data.order.id}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Checkout failed';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const processRazorpayPayment = (payment: any, orderId: string) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: payment.amount,
        currency: payment.currency,
        order_id: payment.orderId,
        name: "Radhika's Homecraft",
        description: 'Handcrafted Indian Textiles & Decor',
        image: '/logo.png',
        handler: async (response: any) => {
          try {
            // Verify payment signature
            const verifyRes = await fetch('/api/checkout', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              toast.success('Payment successful! Order confirmed.');
              onSuccess?.(orderId);
              router.push(`/orders/${orderId}`);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: COLORS.deepTeal,
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };

    document.body.appendChild(script);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.ivory }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <h1 className="text-4xl font-light mb-8" style={{ color: COLORS.deepTeal }}>
          Checkout
        </h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-8">
            {/* Step 1: Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-gray-200 p-6"
              style={{ borderColor: COLORS.deepTeal, borderOpacity: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6 cursor-pointer" onClick={() => setStep(1)}>
                <h2 className="text-xl font-medium flex items-center gap-2" style={{ color: COLORS.deepTeal }}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: COLORS.deepTeal }}>
                    1
                  </span>
                  Shipping Address
                </h2>
                <ChevronDown size={20} />
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              )}
            </motion.div>

            {/* Step 2: Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-gray-200 p-6"
              style={{ borderColor: COLORS.deepTeal, borderOpacity: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6 cursor-pointer" onClick={() => setStep(2)}>
                <h2 className="text-xl font-medium flex items-center gap-2" style={{ color: COLORS.deepTeal }}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: COLORS.deepTeal }}>
                    2
                  </span>
                  Payment Method
                </h2>
              </div>

              {step === 2 && (
                <div className="space-y-3">
                  {(['razorpay', 'cod'] as const).map((method) => (
                    <label key={method} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                      />
                      <span className="ml-3 font-medium">
                        {method === 'razorpay' && 'Razorpay (UPI, Cards, Wallets)'}
                        {method === 'cod' && 'Cash on Delivery'}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="col-span-1">
            <div className="rounded-lg sticky top-20" style={{ backgroundColor: COLORS.gold }}>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4" style={{ color: COLORS.deepTeal }}>
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6 pb-6 border-b" style={{ borderColor: COLORS.deepTeal, borderOpacity: 0.2 }}>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <div className="pb-6 border-b mb-6" style={{ borderColor: COLORS.deepTeal, borderOpacity: 0.2 }}>
                  <div className="flex justify-between font-bold text-lg" style={{ color: COLORS.deepTeal }}>
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <button
                  onClick={handleCreateOrder}
                  disabled={isProcessing || !shippingAddress.name}
                  className="w-full py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: COLORS.deepTeal }}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Check size={20} />
                      Complete Order
                    </span>
                  )}
                </button>

                <p className="text-xs mt-4 text-center" style={{ color: COLORS.charcoal, opacity: 0.7 }}>
                  🚚 Free shipping on orders above ₹2000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
