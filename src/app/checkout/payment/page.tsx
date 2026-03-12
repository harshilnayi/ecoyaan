'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store/checkoutStore';
import { ArrowLeft, CheckCircle, ShieldCheck, CreditCard, Smartphone, Banknote, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckoutProgress } from '@/components/CheckoutProgress';

type PaymentMethod = 'upi' | 'card' | 'cod';

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems, shippingFee, discountApplied, shippingAddress, couponDiscount, isHydrated } = useCheckoutStore();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isHydrated && (!shippingAddress || cartItems.length === 0)) {
      router.push('/checkout');
    }
  }, [isHydrated, shippingAddress, cartItems, router]);

  // Don't render until hydrated
  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <p className="text-gray-500 text-sm">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!shippingAddress || cartItems.length === 0) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
  const couponAmount = couponDiscount > 0 ? Math.round(subtotal * couponDiscount / 100) : 0;
  const grandTotal = subtotal + shippingFee - discountApplied - couponAmount;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      router.push('/checkout/success');
    }, 2500);
  };

  const paymentMethods = [
    { id: 'upi' as const, label: 'UPI', sublabel: 'GPay, PhonePe, Paytm', icon: Smartphone },
    { id: 'card' as const, label: 'Card', sublabel: 'Visa, Mastercard', icon: CreditCard },
    { id: 'cod' as const, label: 'COD', sublabel: 'Cash on Delivery', icon: Banknote },
  ];

  return (
    <div className="container mx-auto px-4 py-6 lg:py-10 max-w-5xl flex-grow relative">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeInUp">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
            <div>
              <p className="font-bold text-green-900 text-lg">Processing Payment</p>
              <p className="text-gray-500 text-sm mt-1">Please wait while we secure your order...</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      )}

      <CheckoutProgress currentStep={3} />

      <div className="flex items-center gap-4 border-b border-green-100 pb-6 mb-8 animate-fadeInUp">
        <Link href="/checkout" className="text-gray-400 hover:text-green-600 transition-colors p-2 rounded-xl hover:bg-green-50">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-900">Payment & Confirmation</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review your order and complete the purchase</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Details */}
        <div className="lg:w-2/3 space-y-5">
          {/* Shipping Address Card */}
          <div className="glass-card p-5 md:p-6 rounded-2xl animate-fadeInUp delay-100">
            <h2 className="text-base font-bold text-green-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Delivering To
            </h2>
            <div className="bg-green-50/80 rounded-xl p-4 text-sm text-gray-700 space-y-0.5">
              <p className="font-semibold text-base text-gray-900">{shippingAddress.fullName}</p>
              <p>{shippingAddress.addressLine}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} — {shippingAddress.pinCode}</p>
              <p className="text-gray-500">{shippingAddress.email} • +91 {shippingAddress.phoneNumber}</p>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="glass-card p-5 md:p-6 rounded-2xl animate-fadeInUp delay-200">
            <h2 className="text-base font-bold text-green-900 mb-3">Order Items</h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.product_id} className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-green-50">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.product_name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-800 truncate">{item.product_name}</h4>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.product_price}</p>
                  </div>
                  <div className="font-bold text-green-700 text-sm">
                    ₹{item.product_price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="glass-card p-5 md:p-6 rounded-2xl animate-fadeInUp delay-300">
            <h2 className="text-base font-bold text-green-900 mb-3">Payment Method</h2>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`
                    p-4 rounded-xl border-2 text-center transition-all duration-300
                    ${selectedMethod === method.id
                      ? 'border-green-500 bg-green-50 shadow-md shadow-green-100'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50/30'
                    }
                  `}
                >
                  <method.icon className={`w-6 h-6 mx-auto mb-2 ${selectedMethod === method.id ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-semibold ${selectedMethod === method.id ? 'text-green-700' : 'text-gray-700'}`}>{method.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{method.sublabel}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Final Summary & Pay Button */}
        <div className="lg:w-1/3 animate-slideInRight delay-300">
          <div className="glass-card p-5 rounded-2xl sticky top-24">
            <h2 className="text-base font-bold text-green-900 mb-5 border-b border-green-100 pb-3">Final Summary</h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-gray-800">₹{shippingFee}</span>
              </div>
              {couponAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">-₹{couponAmount}</span>
                </div>
              )}

              <div className="border-t border-green-100 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-base">Amount to Pay</span>
                  <span className="font-bold text-green-700 text-2xl">₹{grandTotal}</span>
                </div>
                {couponAmount > 0 && (
                  <p className="text-xs text-green-600 text-right mt-1 font-medium">
                    You saved ₹{couponAmount}! 🎉
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="btn-primary w-full mt-6 disabled:opacity-60"
            >
              <ShieldCheck className="w-5 h-5" />
              {isProcessing ? 'Processing...' : `Pay ₹${grandTotal} Securely`}
            </button>

            <p className="text-[10px] text-center text-gray-400 mt-3">
              Simulated payment — no real charges applied.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
