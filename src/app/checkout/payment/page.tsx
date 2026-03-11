'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store/checkoutStore';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems, shippingFee, discountApplied, shippingAddress, clearCart } = useCheckoutStore();

  useEffect(() => {
    if (!shippingAddress || cartItems.length === 0) {
      router.push('/checkout');
    }
  }, [shippingAddress, cartItems, router]);

  if (!shippingAddress || cartItems.length === 0) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
  const grandTotal = subtotal + shippingFee - discountApplied;

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      router.push('/checkout/success');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl flex-grow animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b border-green-100 pb-6 mb-8">
        <Link href="/checkout" className="text-gray-400 hover:text-green-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-green-900">Payment & Confirmation</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Details */}
        <div className="lg:w-2/3 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Shipping To
            </h2>
            <div className="bg-green-50 rounded-xl p-4 text-gray-700">
              <p className="font-semibold text-lg">{shippingAddress.fullName}</p>
              <p>{shippingAddress.email}</p>
              <p>+91 {shippingAddress.phoneNumber}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pinCode}</p>
            </div>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-green-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product_id} className="flex items-center gap-4 bg-white/50 p-3 rounded-xl border border-green-50">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 line-clamp-1">{item.product_name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-green-700">
                    ₹{item.product_price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final Summary & Payment */}
        <div className="lg:w-1/3">
          <div className="glass-card p-6 rounded-2xl sticky top-24">
            <h2 className="text-xl font-bold text-green-900 mb-6 border-b border-green-100 pb-4">Final Summary</h2>
            
            <div className="space-y-4 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-gray-800">₹{shippingFee}</span>
              </div>
              
              <div className="border-t border-green-100 pt-4 mt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-800">Amount to Pay</span>
                  <span className="font-bold text-green-700 text-2xl">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-green-200"
            >
              <ShieldCheck className="w-5 h-5" />
              Pay Securely
            </button>
            
            <p className="text-xs text-center text-gray-400 mt-4">
              This is a simulated payment for Ecoyaan. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
