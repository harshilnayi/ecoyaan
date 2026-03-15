'use client';

import Link from 'next/link';
import { Leaf, ShoppingCart } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';

export function Header() {
  const cartItems = useCheckoutStore((state) => state.cartItems);
  const isHydrated = useCheckoutStore((state) => state.isHydrated);
  const totalItems = isHydrated ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-green-100/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-md shadow-green-200 group-hover:shadow-lg group-hover:shadow-green-300 transition-all duration-300">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight eco-text-gradient">Ecoyaan</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="relative p-2.5 text-gray-500 hover:text-green-600 rounded-xl hover:bg-green-50 transition-all duration-300"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm animate-bounceIn">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
