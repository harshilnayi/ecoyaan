'use client';

import Link from 'next/link';
import { Leaf, ShoppingCart } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useEffect, useState } from 'react';

export function Header() {
  const cartItems = useCheckoutStore((state) => state.cartItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-green-100 bg-white/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors">
          <Leaf className="h-6 w-6" />
          <span className="font-bold text-xl tracking-tight">Ecoyaan</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse-once">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
