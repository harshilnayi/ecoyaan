'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useCheckoutStore, ShippingAddress, ShippingAddressInput } from '@/store/checkoutStore';
import { ArrowLeft, Building, CheckCircle2, Hash, Mail, Map, MapPin, Pencil, Phone, Plus, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckoutProgress } from '@/components/CheckoutProgress';
import { StickyCheckoutActions } from '@/components/StickyCheckoutActions';

const schema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  addressLine: z.string().min(5, 'Address is required (min 5 characters)'),
  pinCode: z.string().regex(/^[0-9]{6}$/, 'PIN Code must be exactly 6 digits'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
});

const EMPTY_ADDRESS: ShippingAddressInput = {
  fullName: '',
  email: '',
  phoneNumber: '',
  addressLine: '',
  pinCode: '',
  city: '',
  state: '',
};

function hasDraftValue(address: ShippingAddressInput) {
  return Object.values(address).some((value) => value.trim().length > 0);
}

function toInputAddress(address: ShippingAddress | null): ShippingAddressInput {
  if (!address) {
    return EMPTY_ADDRESS;
  }

  return {
    fullName: address.fullName,
    email: address.email,
    phoneNumber: address.phoneNumber,
    addressLine: address.addressLine,
    pinCode: address.pinCode,
    city: address.city,
    state: address.state,
  };
}

export default function ShippingPage() {
  const router = useRouter();
  const isHydrated = useCheckoutStore((state) => state.isHydrated);
  const shippingAddresses = useCheckoutStore((state) => state.shippingAddresses);
  const selectedShippingAddressId = useCheckoutStore((state) => state.selectedShippingAddressId);
  const shippingDraft = useCheckoutStore((state) => state.shippingDraft);
  const upsertShippingAddress = useCheckoutStore((state) => state.upsertShippingAddress);
  const selectShippingAddress = useCheckoutStore((state) => state.selectShippingAddress);
  const clearSelectedShippingAddress = useCheckoutStore((state) => state.clearSelectedShippingAddress);
  const removeShippingAddress = useCheckoutStore((state) => state.removeShippingAddress);
  const setShippingDraft = useCheckoutStore((state) => state.setShippingDraft);
  const clearShippingDraft = useCheckoutStore((state) => state.clearShippingDraft);
  const cartItems = useCheckoutStore((state) => state.cartItems);
  const shippingFee = useCheckoutStore((state) => state.shippingFee);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const hasInitializedForm = useRef(false);

  const selectedAddress = useMemo(
    () => shippingAddresses.find((address) => address.id === selectedShippingAddressId) ?? null,
    [shippingAddresses, selectedShippingAddressId]
  );
  const effectiveEditingAddressId = editingAddressId ?? selectedShippingAddressId;

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<ShippingAddressInput>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_ADDRESS,
  });
  const watchedAddress = useWatch({ control });

  useEffect(() => {
    if (!isHydrated || hasInitializedForm.current) {
      return;
    }

    if (hasDraftValue(shippingDraft)) {
      reset(shippingDraft);
      hasInitializedForm.current = true;
      return;
    }

    if (selectedAddress) {
      reset(toInputAddress(selectedAddress));
      hasInitializedForm.current = true;
      return;
    }

    reset(EMPTY_ADDRESS);
    hasInitializedForm.current = true;
  }, [isHydrated, selectedAddress, shippingDraft, reset]);

  useEffect(() => {
    if (!isHydrated || !hasInitializedForm.current || !watchedAddress) {
      return;
    }

    const mergedAddress: ShippingAddressInput = {
      fullName: watchedAddress.fullName ?? '',
      email: watchedAddress.email ?? '',
      phoneNumber: watchedAddress.phoneNumber ?? '',
      addressLine: watchedAddress.addressLine ?? '',
      pinCode: watchedAddress.pinCode ?? '',
      city: watchedAddress.city ?? '',
      state: watchedAddress.state ?? '',
    };

    const isDraftUnchanged = (
      Object.keys(mergedAddress) as Array<keyof ShippingAddressInput>
    ).every((key) => mergedAddress[key] === shippingDraft[key]);

    if (!isDraftUnchanged) {
      setShippingDraft(mergedAddress);
    }
  }, [isHydrated, watchedAddress, shippingDraft, setShippingDraft]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
  const grandTotal = subtotal + shippingFee;

  const onSubmit = (data: ShippingAddressInput) => {
    upsertShippingAddress(data, effectiveEditingAddressId ?? undefined);
    router.push('/checkout/payment');
  };

  const handleSelectAddress = (address: ShippingAddress) => {
    selectShippingAddress(address.id);
    reset(toInputAddress(address));
    setEditingAddressId(address.id);
  };

  const handleDeleteAddress = (addressId: string) => {
    const remainingAddresses = shippingAddresses.filter((address) => address.id !== addressId);
    const deletedSelectedAddress = selectedShippingAddressId === addressId;

    removeShippingAddress(addressId);

    if (deletedSelectedAddress && remainingAddresses.length > 0) {
      const fallbackAddress = remainingAddresses[0];
      reset(toInputAddress(fallbackAddress));
      setEditingAddressId(fallbackAddress.id);
      return;
    }

    if (remainingAddresses.length === 0) {
      reset(EMPTY_ADDRESS);
      clearShippingDraft();
      setEditingAddressId(null);
    }
  };

  const handleAddNew = () => {
    clearSelectedShippingAddress();
    setEditingAddressId(null);
    clearShippingDraft();
    reset(EMPTY_ADDRESS);
  };

  const fields = [
    { name: 'fullName' as const, label: 'Full Name', icon: User, placeholder: 'Aarav Sharma', type: 'text', colSpan: 'md:col-span-2', autoComplete: 'name' },
    { name: 'email' as const, label: 'Email Address', icon: Mail, placeholder: 'aarav@eco.com', type: 'email', colSpan: '', autoComplete: 'email' },
    { name: 'phoneNumber' as const, label: 'Phone Number', icon: Phone, placeholder: '9876543210', type: 'tel', colSpan: '', maxLength: 10, inputMode: 'numeric' as const, autoComplete: 'tel' },
    { name: 'addressLine' as const, label: 'Address', icon: MapPin, placeholder: '123, MG Road, Koramangala', type: 'text', colSpan: 'md:col-span-2', autoComplete: 'street-address' },
    { name: 'pinCode' as const, label: 'PIN Code', icon: Hash, placeholder: '560001', type: 'text', colSpan: '', maxLength: 6, inputMode: 'numeric' as const, autoComplete: 'postal-code' },
    { name: 'city' as const, label: 'City', icon: Building, placeholder: 'Bangalore', type: 'text', colSpan: '', autoComplete: 'address-level2' },
    { name: 'state' as const, label: 'State', icon: Map, placeholder: 'Karnataka', type: 'text', colSpan: 'md:col-span-2', autoComplete: 'address-level1' },
  ];

  if (!isHydrated) {
    return (
      <div className="container mx-auto flex flex-grow items-center justify-center px-4 py-16">
        <p className="text-sm text-gray-500">Restoring your checkout details...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto max-w-5xl flex-grow px-4 py-6 pb-32 lg:py-10 lg:pb-36">
      <CheckoutProgress currentStep={2} />

      <div className="mb-8 flex items-center gap-4 border-b border-green-100 pb-6 animate-fadeInUp">
        <Link href="/" className="text-gray-400 hover:text-green-600 transition-colors p-2 rounded-xl hover:bg-green-50">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-900">Shipping Details</h1>
          <p className="text-sm text-gray-500 mt-0.5">Where should we deliver your eco-goodies?</p>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="space-y-5 lg:w-2/3">
          <div className="glass-card animate-fadeInUp rounded-2xl p-5 md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-green-900">Saved Addresses</h2>
                <p className="text-xs text-gray-500">Select, edit, or add multiple delivery addresses.</p>
              </div>
              <button
                type="button"
                onClick={handleAddNew}
                className="inline-flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition-colors hover:bg-green-100"
              >
                <Plus className="h-3.5 w-3.5" />
                Add New
              </button>
            </div>

            {shippingAddresses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-green-200 bg-green-50/70 px-4 py-5 text-sm text-gray-600">
                No saved addresses yet. Fill the form below and continue to save your first one.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {shippingAddresses.map((address) => {
                  const isSelected = selectedShippingAddressId === address.id;
                  return (
                    <div
                      key={address.id}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-sm shadow-green-100'
                          : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">{address.fullName}</p>
                          <p className="text-xs text-gray-500">{address.phoneNumber}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />}
                      </div>
                      <p className="mt-2 text-xs text-gray-600">{address.addressLine}</p>
                      <p className="text-xs text-gray-500">{address.city}, {address.state} {address.pinCode}</p>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectAddress(address)}
                          className="rounded-lg border border-green-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-green-700"
                        >
                          Use this
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectAddress(address)}
                          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white hover:text-green-700"
                          aria-label="Edit address"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete address"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="glass-card animate-fadeInUp rounded-2xl p-5 md:p-8">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-green-900">
                {effectiveEditingAddressId ? 'Edit Address Details' : 'Add Delivery Address'}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Your form is auto-saved, so reloading the page keeps your progress.
              </p>
            </div>

            <form id="shipping-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.name} className={`space-y-1.5 ${field.colSpan}`}>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <field.icon className="w-3.5 h-3.5 text-gray-400" />
                      {field.label}
                    </label>
                    <input
                      {...register(field.name)}
                      type={field.type}
                      maxLength={field.maxLength}
                      inputMode={field.inputMode}
                      autoComplete={field.autoComplete}
                      className={`w-full p-3 rounded-xl border text-sm ${
                        errors[field.name]
                          ? 'border-red-400 focus:ring-red-100 bg-red-50/30'
                          : 'border-gray-200 focus:border-green-500 focus:ring-green-100 bg-white'
                      } focus:ring-4 outline-none transition-all`}
                      placeholder={field.placeholder}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs font-medium animate-fadeInUp">
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </form>
          </div>
        </div>

        <div className="animate-slideInRight delay-200 lg:w-1/3">
          <div className="glass-card p-5 rounded-2xl sticky top-24">
            <h3 className="font-bold text-green-900 mb-4 text-sm">Order Summary</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.product_id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.product_name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.product_name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-green-700">Rs {item.product_price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-green-100 mt-4 pt-4 flex justify-between">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-bold text-green-700 text-lg">Rs {grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
      </div>

      <StickyCheckoutActions
        backHref="/"
        backLabel="Back to Cart"
        primaryLabel={isSubmitting ? 'Saving Address...' : 'Next Step: Payment'}
        primaryFormId="shipping-form"
        primaryButtonType="submit"
        primaryDisabled={isSubmitting}
        primaryLoading={isSubmitting}
      />
    </>
  );
}
