'use client';

import { useEffect } from 'react';
import { useCheckoutStore, CartItem } from '@/store/checkoutStore';

interface CartInitializerProps {
  items: CartItem[];
  fee: number;
  discount: number;
}

export default function CartInitializer({ items, fee, discount }: CartInitializerProps) {
  const setCartData = useCheckoutStore((state) => state.setCartData);

  useEffect(() => {
    setCartData(items, fee, discount);
  }, [items, fee, discount, setCartData]);

  return null;
}
