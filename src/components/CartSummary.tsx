'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, Package, Shield, Truck } from 'lucide-react';
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
  const couponAmount = couponDiscount > 0 ? Math.round((subtotal * couponDiscount) / 100) : 0;
  const grandTotal = subtotal + shippingFee - discountApplied - couponAmount;

  return (
    <div className="glass-card sticky top-24 space-y-5 rounded-2xl p-5 md:p-6">
      <div className="rounded-2xl bg-gradient-to-br from-green-900 to-green-700 p-4 text-white">
        <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-green-100">Order Summary</p>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-sm text-green-100">Total payable</p>
            <p className="text-3xl font-bold leading-none">Rs {grandTotal}</p>
          </div>
          <div className="rounded-xl bg-white/15 px-3 py-1.5 text-right text-xs">
            <p className="font-semibold">{totalItems} item{totalItems === 1 ? '' : 's'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-800">Rs {subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-semibold text-gray-800">Rs {shippingFee}</span>
        </div>
        {discountApplied > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-Rs {discountApplied}</span>
          </div>
        )}
        {couponAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span className="font-semibold">-Rs {couponAmount}</span>
          </div>
        )}
      </div>

      <CouponInput />

      <div className="rounded-xl border border-green-100 bg-green-50 px-3 py-2.5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 shrink-0 text-green-600" />
          <span>
            Estimated delivery: <strong className="text-green-700">{getEstimatedDelivery()}</strong>
          </span>
        </div>
      </div>

      <Link href="/checkout" className="btn-primary w-full">
        Proceed to Checkout
        <ArrowRight className="h-5 w-5" />
      </Link>

      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { icon: Shield, label: 'Secure Payment' },
          { icon: Truck, label: 'Easy Returns' },
          { icon: Package, label: 'Eco Packaging' },
        ].map((item) => (
          <div key={item.label} className="subtle-card flex flex-col items-center gap-1.5 px-2 py-2.5 text-center">
            <item.icon className="h-4 w-4 text-green-600" />
            <span className="text-[10px] leading-tight text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
