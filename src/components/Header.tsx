'use client';

import Link from 'next/link';
import { Leaf, ShoppingCart } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';

export function Header() {
  const cartItems = useCheckoutStore((state) => state.cartItems);
  const isHydrated = useCheckoutStore((state) => state.isHydrated);
  const totalItems = isHydrated ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <header className="glass-card sticky top-0 z-50 w-full border-b border-green-100/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 shadow-md shadow-green-200 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-300">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight eco-text-gradient">Ecoyaan</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="relative rounded-xl p-2.5 text-gray-500 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="animate-bounceIn absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 text-[10px] font-bold text-white shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
