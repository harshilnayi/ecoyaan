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
  addressLine: string;
  pinCode: string;
  city: string;
  state: string;
}

export interface CheckoutState {
  cartItems: CartItem[];
  shippingFee: number;
  discountApplied: number;
  shippingAddress: ShippingAddress | null;
  couponCode: string;
  couponDiscount: number;
  isHydrated: boolean;
  orderId: string | null;

  // Actions
  setCartData: (items: CartItem[], fee: number, discount: number) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  updateQuantity: (productId: number, delta: number) => void;
  removeItem: (productId: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setHydrated: () => void;
  generateOrderId: () => string;
  clearCart: () => void;
}

const VALID_COUPONS: Record<string, number> = {
  'ECO10': 10,
  'GREEN20': 20,
  'EARTH15': 15,
  'NATURE25': 25,
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      shippingFee: 0,
      discountApplied: 0,
      shippingAddress: null,
      couponCode: '',
      couponDiscount: 0,
      isHydrated: false,
      orderId: null,

      setCartData: (items, fee, discount) =>
        set({ cartItems: items, shippingFee: fee, discountApplied: discount }),

      setShippingAddress: (address) => set({ shippingAddress: address }),

      updateQuantity: (productId, delta) => {
        const { cartItems } = get();
        const updated = cartItems
          .map((item) =>
            item.product_id === productId
              ? { ...item, quantity: Math.max(0, item.quantity + delta) }
              : item
          )
          .filter((item) => item.quantity > 0);
        set({ cartItems: updated });
      },

      removeItem: (productId) => {
        const { cartItems } = get();
        set({ cartItems: cartItems.filter((item) => item.product_id !== productId) });
      },

      applyCoupon: (code) => {
        const upperCode = code.toUpperCase().trim();
        if (VALID_COUPONS[upperCode]) {
          set({ couponCode: upperCode, couponDiscount: VALID_COUPONS[upperCode] });
          return { success: true, message: `Coupon ${upperCode} applied! ${VALID_COUPONS[upperCode]}% off` };
        }
        return { success: false, message: 'Invalid coupon code. Try ECO10 or GREEN20!' };
      },

      removeCoupon: () => set({ couponCode: '', couponDiscount: 0 }),

      setHydrated: () => set({ isHydrated: true }),

      generateOrderId: () => {
        const id = `ECO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        set({ orderId: id });
        return id;
      },

      clearCart: () =>
        set({
          cartItems: [],
          shippingFee: 0,
          discountApplied: 0,
          shippingAddress: null,
          couponCode: '',
          couponDiscount: 0,
          orderId: null,
        }),
    }),
    {
      name: 'ecoyaan-checkout-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
