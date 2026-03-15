import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddressInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  addressLine: string;
  pinCode: string;
  city: string;
  state: string;
}

export interface ShippingAddress extends ShippingAddressInput {
  id: string;
}

export interface CheckoutState {
  cartItems: CartItem[];
  shippingFee: number;
  discountApplied: number;
  shippingAddresses: ShippingAddress[];
  selectedShippingAddressId: string | null;
  shippingDraft: ShippingAddressInput;
  couponCode: string;
  couponDiscount: number;
  isHydrated: boolean;
  orderId: string | null;

  // Actions
  setCartData: (items: CartItem[], fee: number, discount: number) => void;
  upsertShippingAddress: (address: ShippingAddressInput, addressId?: string) => string;
  selectShippingAddress: (addressId: string) => void;
  clearSelectedShippingAddress: () => void;
  removeShippingAddress: (addressId: string) => void;
  setShippingDraft: (address: Partial<ShippingAddressInput>) => void;
  clearShippingDraft: () => void;
  getSelectedShippingAddress: () => ShippingAddress | null;
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

const EMPTY_SHIPPING_DRAFT: ShippingAddressInput = {
  fullName: '',
  email: '',
  phoneNumber: '',
  addressLine: '',
  pinCode: '',
  city: '',
  state: '',
};

function createAddressId() {
  return `addr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeAddress(address: ShippingAddressInput): ShippingAddressInput {
  return {
    fullName: address.fullName.trim(),
    email: address.email.trim(),
    phoneNumber: address.phoneNumber.trim(),
    addressLine: address.addressLine.trim(),
    pinCode: address.pinCode.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
  };
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      shippingFee: 0,
      discountApplied: 0,
      shippingAddresses: [],
      selectedShippingAddressId: null,
      shippingDraft: EMPTY_SHIPPING_DRAFT,
      couponCode: '',
      couponDiscount: 0,
      isHydrated: false,
      orderId: null,

      setCartData: (items, fee, discount) =>
        set({ cartItems: items, shippingFee: fee, discountApplied: discount }),

      upsertShippingAddress: (address, addressId) => {
        const normalizedAddress = normalizeAddress(address);
        const id = addressId ?? createAddressId();

        set((state) => {
          const existingIndex = state.shippingAddresses.findIndex((item) => item.id === id);

          if (existingIndex >= 0) {
            const updatedAddresses = [...state.shippingAddresses];
            updatedAddresses[existingIndex] = { id, ...normalizedAddress };
            return {
              shippingAddresses: updatedAddresses,
              selectedShippingAddressId: id,
              shippingDraft: normalizedAddress,
            };
          }

          return {
            shippingAddresses: [{ id, ...normalizedAddress }, ...state.shippingAddresses],
            selectedShippingAddressId: id,
            shippingDraft: normalizedAddress,
          };
        });

        return id;
      },

      selectShippingAddress: (addressId) => {
        const selectedAddress = get().shippingAddresses.find((address) => address.id === addressId);
        if (!selectedAddress) {
          return;
        }

        set({
          selectedShippingAddressId: addressId,
          shippingDraft: {
            fullName: selectedAddress.fullName,
            email: selectedAddress.email,
            phoneNumber: selectedAddress.phoneNumber,
            addressLine: selectedAddress.addressLine,
            pinCode: selectedAddress.pinCode,
            city: selectedAddress.city,
            state: selectedAddress.state,
          },
        });
      },

      clearSelectedShippingAddress: () => set({ selectedShippingAddressId: null }),

      removeShippingAddress: (addressId) => {
        const currentState = get();
        const remainingAddresses = currentState.shippingAddresses.filter((address) => address.id !== addressId);

        if (currentState.selectedShippingAddressId !== addressId) {
          set({ shippingAddresses: remainingAddresses });
          return;
        }

        const fallbackAddress = remainingAddresses[0] ?? null;
        set({
          shippingAddresses: remainingAddresses,
          selectedShippingAddressId: fallbackAddress?.id ?? null,
          shippingDraft: fallbackAddress
            ? {
                fullName: fallbackAddress.fullName,
                email: fallbackAddress.email,
                phoneNumber: fallbackAddress.phoneNumber,
                addressLine: fallbackAddress.addressLine,
                pinCode: fallbackAddress.pinCode,
                city: fallbackAddress.city,
                state: fallbackAddress.state,
              }
            : EMPTY_SHIPPING_DRAFT,
        });
      },

      setShippingDraft: (address) => {
        set((state) => ({
          shippingDraft: {
            ...state.shippingDraft,
            ...address,
          },
        }));
      },

      clearShippingDraft: () => set({ shippingDraft: EMPTY_SHIPPING_DRAFT }),

      getSelectedShippingAddress: () => {
        const { shippingAddresses, selectedShippingAddressId } = get();
        if (!selectedShippingAddressId) {
          return null;
        }

        return shippingAddresses.find((address) => address.id === selectedShippingAddressId) ?? null;
      },

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
          couponCode: '',
          couponDiscount: 0,
          orderId: null,
        }),
    }),
    {
      name: 'ecoyaan-checkout-storage',
      version: 2,
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<
          CheckoutState & { shippingAddress?: ShippingAddressInput | null }
        >;

        if (version < 2 && state?.shippingAddress) {
          const migratedId = createAddressId();
          const migratedAddress = normalizeAddress(state.shippingAddress);

          return {
            ...state,
            shippingAddresses: [{ id: migratedId, ...migratedAddress }],
            selectedShippingAddressId: migratedId,
            shippingDraft: migratedAddress,
          };
        }

        return {
          ...state,
          shippingAddresses: state?.shippingAddresses ?? [],
          selectedShippingAddressId: state?.selectedShippingAddressId ?? null,
          shippingDraft: state?.shippingDraft ?? EMPTY_SHIPPING_DRAFT,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
