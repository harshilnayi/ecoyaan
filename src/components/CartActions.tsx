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

  // Get the live quantity from the store, fallback to initial
  const liveItem = cartItems.find((item) => item.product_id === productId);
  const quantity = liveItem?.quantity ?? initialQuantity;

  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => removeItem(productId), 300);
  };

  return (
    <div className={`flex items-center gap-2 transition-opacity duration-300 ${isRemoving ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
        <button
          onClick={() => updateQuantity(productId, -1)}
          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-l-xl transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-semibold text-gray-800 text-sm">{quantity}</span>
        <button
          onClick={() => updateQuantity(productId, 1)}
          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-r-xl transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={handleRemove}
        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
