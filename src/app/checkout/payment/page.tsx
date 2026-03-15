'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store/checkoutStore';
import { CheckCircle, ShieldCheck, CreditCard, Smartphone, Banknote, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckoutProgress } from '@/components/CheckoutProgress';
import { StickyCheckoutActions } from '@/components/StickyCheckoutActions';

type PaymentMethod = 'upi' | 'card' | 'cod';

export default function PaymentPage() {
  const router = useRouter();
  const cartItems = useCheckoutStore((state) => state.cartItems);
  const shippingFee = useCheckoutStore((state) => state.shippingFee);
  const discountApplied = useCheckoutStore((state) => state.discountApplied);
  const couponDiscount = useCheckoutStore((state) => state.couponDiscount);
  const isHydrated = useCheckoutStore((state) => state.isHydrated);
  const shippingAddresses = useCheckoutStore((state) => state.shippingAddresses);
  const selectedShippingAddressId = useCheckoutStore((state) => state.selectedShippingAddressId);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedShippingAddress = useMemo(
    () => shippingAddresses.find((address) => address.id === selectedShippingAddressId) ?? null,
    [shippingAddresses, selectedShippingAddressId]
  );

  useEffect(() => {
    if (isHydrated && (!selectedShippingAddress || cartItems.length === 0)) {
      router.push('/checkout');
    }
  }, [isHydrated, selectedShippingAddress, cartItems, router]);

  if (!isHydrated) {
    return (
      <div className="container mx-auto flex flex-grow items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <p className="text-gray-500 text-sm">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!selectedShippingAddress || cartItems.length === 0) {
    return null;
  }

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
  const couponAmount = couponDiscount > 0 ? Math.round(subtotal * couponDiscount / 100) : 0;
  const grandTotal = subtotal + shippingFee - discountApplied - couponAmount;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      router.push('/checkout/success');
    }, 2500);
  };

  const paymentMethods = [
    { id: 'upi' as const, label: 'UPI', sublabel: 'GPay, PhonePe, Paytm', icon: Smartphone },
    { id: 'card' as const, label: 'Card', sublabel: 'Visa, Mastercard', icon: CreditCard },
    { id: 'cod' as const, label: 'COD', sublabel: 'Cash on Delivery', icon: Banknote },
  ];

  return (
    <>
      <div className="container relative mx-auto max-w-5xl flex-grow px-4 py-6 pb-32 lg:py-10 lg:pb-36">
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fadeInUp">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-green-900">Processing Payment</p>
                <p className="mt-1 text-sm text-gray-500">Please wait while we secure your order...</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>256-bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        )}

        <CheckoutProgress currentStep={3} />

        <div className="mb-8 border-b border-green-100 pb-6 animate-fadeInUp">
          <h1 className="text-2xl font-bold text-green-900 md:text-3xl">Payment & Confirmation</h1>
          <p className="mt-0.5 text-sm text-gray-500">Review your order and complete the purchase</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="space-y-5 lg:w-2/3">
            <div className="glass-card animate-fadeInUp rounded-2xl p-5 md:p-6">
              <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-green-900">
                <CheckCircle className="h-4 w-4 text-green-500" />
              Delivering To
              </h2>
              <div className="space-y-0.5 rounded-xl bg-green-50/80 p-4 text-sm text-gray-700">
                <p className="text-base font-semibold text-gray-900">{selectedShippingAddress.fullName}</p>
                <p>{selectedShippingAddress.addressLine}</p>
                <p>{selectedShippingAddress.city}, {selectedShippingAddress.state} - {selectedShippingAddress.pinCode}</p>
                <p className="text-gray-500">{selectedShippingAddress.email} | +91 {selectedShippingAddress.phoneNumber}</p>
              </div>
              <Link href="/checkout" className="mt-3 inline-flex text-xs font-semibold text-green-700 hover:text-green-800">
                Change address
              </Link>
            </div>

            <div className="glass-card animate-fadeInUp rounded-2xl p-5 md:p-6 delay-200">
              <h2 className="mb-3 text-base font-bold text-green-900">Order Items</h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="flex items-center gap-3 rounded-xl border border-green-50 bg-white/60 p-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <Image src={item.image} alt={item.product_name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-gray-800">{item.product_name}</h4>
                      <p className="text-xs text-gray-400">Qty: {item.quantity} x Rs {item.product_price}</p>
                    </div>
                    <div className="text-sm font-bold text-green-700">
                      Rs {item.product_price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card animate-fadeInUp rounded-2xl p-5 md:p-6 delay-300">
              <h2 className="mb-3 text-base font-bold text-green-900">Payment Method</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`
                      rounded-xl border-2 p-4 text-center transition-all duration-300
                      ${selectedMethod === method.id
                        ? 'border-green-500 bg-green-50 shadow-md shadow-green-100'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50/30'
                      }
                    `}
                  >
                    <method.icon className={`mx-auto mb-2 h-6 w-6 ${selectedMethod === method.id ? 'text-green-600' : 'text-gray-400'}`} />
                    <p className={`text-sm font-semibold ${selectedMethod === method.id ? 'text-green-700' : 'text-gray-700'}`}>{method.label}</p>
                    <p className="mt-0.5 text-[10px] text-gray-400">{method.sublabel}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="animate-slideInRight delay-300 lg:w-1/3">
            <div className="glass-card sticky top-24 rounded-2xl p-5">
              <h2 className="mb-5 border-b border-green-100 pb-3 text-base font-bold text-green-900">Final Summary</h2>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">Rs {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-800">Rs {shippingFee}</span>
                </div>
                {couponAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-Rs {couponAmount}</span>
                  </div>
                )}

                <div className="mt-3 border-t border-green-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-800">Amount to Pay</span>
                    <span className="text-2xl font-bold text-green-700">Rs {grandTotal}</span>
                  </div>
                  {couponAmount > 0 && (
                    <p className="mt-1 text-right text-xs font-medium text-green-600">
                      You saved Rs {couponAmount}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Payments are simulated for this assignment. No real transaction will be made.
              </p>
            </div>
          </div>
        </div>
      </div>

      <StickyCheckoutActions
        backHref="/checkout"
        backLabel="Back to Shipping"
        primaryLabel={isProcessing ? 'Processing...' : `Pay Rs ${grandTotal}`}
        primaryDisabled={isProcessing}
        primaryLoading={isProcessing}
        onPrimaryClick={handlePayment}
      />
    </>
  );
}
