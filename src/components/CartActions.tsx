'use client';

import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';

interface CartActionsProps {
  productId: number;
  initialQuantity: number;
}

export default function CartActions({ productId, initialQuantity }: CartActionsProps) {
  const updateQuantity = useCheckoutStore((state) => state.updateQuantity);
  const removeItem = useCheckoutStore((state) => state.removeItem);
  const cartItems = useCheckoutStore((state) => state.cartItems);

  const liveItem = cartItems.find((item) => item.product_id === productId);
  const quantity = liveItem?.quantity ?? initialQuantity;

  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => removeItem(productId), 300);
  };

  return (
    <div className={`flex items-center gap-2 transition-opacity duration-300 ${isRemoving ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex items-center rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-white">
        <button
          onClick={() => updateQuantity(productId, -1)}
          className="rounded-l-xl p-2.5 text-gray-500 transition-colors hover:bg-green-100 hover:text-green-700"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-9 text-center text-sm font-semibold text-gray-800">{quantity}</span>
        <button
          onClick={() => updateQuantity(productId, 1)}
          className="rounded-r-xl p-2.5 text-gray-500 transition-colors hover:bg-green-100 hover:text-green-700"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={handleRemove}
        className="rounded-xl p-2 text-gray-300 transition-all hover:bg-red-50 hover:text-red-500"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
