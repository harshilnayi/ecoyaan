'use client';

import { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';

export default function CouponInput() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const applyCoupon = useCheckoutStore((state) => state.applyCoupon);
  const removeCoupon = useCheckoutStore((state) => state.removeCoupon);
  const couponCode = useCheckoutStore((state) => state.couponCode);
  const couponDiscount = useCheckoutStore((state) => state.couponDiscount);

  const handleApply = () => {
    if (!code.trim()) return;
    const result = applyCoupon(code);
    setMessage(result.message);
    setIsSuccess(result.success);
    if (result.success) {
      setCode('');
    }
    setTimeout(() => setMessage(''), 4000);
  };

  const handleRemove = () => {
    removeCoupon();
    setMessage('');
    setCode('');
  };

  if (couponCode) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <span className="font-bold text-green-700 text-sm">{couponCode}</span>
            <span className="text-green-600 text-xs ml-1">({couponDiscount}% off)</span>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove coupon"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Coupon code"
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
          />
        </div>
        <button
          onClick={handleApply}
          className="px-4 py-2.5 bg-green-50 text-green-700 text-sm font-semibold rounded-xl hover:bg-green-100 transition-colors border border-green-200"
        >
          Apply
        </button>
      </div>
      {message && (
        <p className={`text-xs font-medium animate-fadeInUp ${isSuccess ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      <p className="text-[10px] text-gray-400">Try: ECO10, GREEN20, EARTH15, NATURE25</p>
    </div>
  );
}
