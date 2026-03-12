'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Truck, Package, Calendar, Tag } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';
import CouponInput from '@/components/CouponInput';

function getEstimatedDelivery() {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 3);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 5);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${minDate.toLocaleDateString('en-IN', options)} - ${maxDate.toLocaleDateString('en-IN', options)}`;
}

export default function CartSummary() {
  const cartItems = useCheckoutStore((state) => state.cartItems);
  const shippingFee = useCheckoutStore((state) => state.shippingFee);
  const discountApplied = useCheckoutStore((state) => state.discountApplied);
  const couponDiscount = useCheckoutStore((state) => state.couponDiscount);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product_price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const couponAmount = couponDiscount > 0 ? Math.round(subtotal * couponDiscount / 100) : 0;
  const grandTotal = subtotal + shippingFee - discountApplied - couponAmount;

  return (
    <div className="glass-card p-6 rounded-2xl sticky top-24 space-y-5">
      <h2 className="text-xl font-bold text-green-900 border-b border-green-100 pb-4">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
          <span className="font-semibold text-gray-800">₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-semibold text-gray-800">₹{shippingFee}</span>
        </div>
        {discountApplied > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discountApplied}</span>
          </div>
        )}
        {couponAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span className="font-semibold">-₹{couponAmount}</span>
          </div>
        )}
      </div>

      {/* Coupon Input */}
      <CouponInput />

      <div className="border-t border-green-100 pt-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-800 text-lg">Grand Total</span>
          <span className="font-bold text-green-700 text-2xl">₹{grandTotal}</span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1 text-right">Inclusive of all taxes</p>
        {couponAmount > 0 && (
          <p className="text-xs text-green-600 text-right mt-1 font-medium">
            You save ₹{couponAmount}! 🎉
          </p>
        )}
      </div>

      <Link href="/checkout" className="btn-primary w-full">
        Proceed to Checkout
        <ArrowRight className="w-5 h-5" />
      </Link>

      {/* Delivery Estimate */}
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-green-50 rounded-xl p-3">
        <Calendar className="w-4 h-4 text-green-600 shrink-0" />
        <span>Estimated delivery: <strong className="text-green-700">{getEstimatedDelivery()}</strong></span>
      </div>

      {/* Trust Signals */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        {[
          { icon: Shield, label: 'Secure\nPayment' },
          { icon: Truck, label: 'Free\nReturns' },
          { icon: Package, label: 'Eco\nPackaging' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-1.5 py-2">
            <item.icon className="w-4 h-4 text-green-500" />
            <span className="text-[10px] text-gray-400 leading-tight whitespace-pre-line">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
