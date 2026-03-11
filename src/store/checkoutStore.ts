import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phoneNumber: string;
  pinCode: string;
  city: string;
  state: string;
}

export interface CheckoutState {
  cartItems: CartItem[];
  shippingFee: number;
  discountApplied: number;
  shippingAddress: ShippingAddress | null;
  setCartData: (items: CartItem[], fee: number, discount: number) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  clearCart: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      cartItems: [],
      shippingFee: 0,
      discountApplied: 0,
      shippingAddress: null,
      setCartData: (items, fee, discount) =>
        set({ cartItems: items, shippingFee: fee, discountApplied: discount }),
      setShippingAddress: (address) => set({ shippingAddress: address }),
      clearCart: () =>
        set({
          cartItems: [],
          shippingFee: 0,
          discountApplied: 0,
          shippingAddress: null,
        }),
    }),
    {
      name: 'ecoyaan-checkout-storage',
    }
  )
);
