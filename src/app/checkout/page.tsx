'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useCheckoutStore, ShippingAddress } from '@/store/checkoutStore';
import { ArrowRight, ArrowLeft, User, Mail, Phone, MapPin, Hash, Building, Map } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckoutProgress } from '@/components/CheckoutProgress';

const schema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  addressLine: z.string().min(5, 'Address is required (min 5 characters)'),
  pinCode: z.string().regex(/^[0-9]{6}$/, 'PIN Code must be exactly 6 digits'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
});

export default function ShippingPage() {
  const router = useRouter();
  const setShippingAddress = useCheckoutStore((state) => state.setShippingAddress);
  const savedAddress = useCheckoutStore((state) => state.shippingAddress);
  const cartItems = useCheckoutStore((state) => state.cartItems);
  const shippingFee = useCheckoutStore((state) => state.shippingFee);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ShippingAddress>({
    resolver: zodResolver(schema),
    defaultValues: savedAddress || {
      fullName: '',
      email: '',
      phoneNumber: '',
      addressLine: '',
      pinCode: '',
      city: '',
      state: '',
    }
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
  const grandTotal = subtotal + shippingFee;

  const onSubmit = (data: ShippingAddress) => {
    setShippingAddress(data);
    router.push('/checkout/payment');
  };

  const fields = [
    { name: 'fullName' as const, label: 'Full Name', icon: User, placeholder: 'Aarav Sharma', type: 'text', colSpan: 'md:col-span-2' },
    { name: 'email' as const, label: 'Email Address', icon: Mail, placeholder: 'aarav@eco.com', type: 'email', colSpan: '' },
    { name: 'phoneNumber' as const, label: 'Phone Number', icon: Phone, placeholder: '9876543210', type: 'tel', colSpan: '', maxLength: 10 },
    { name: 'addressLine' as const, label: 'Address', icon: MapPin, placeholder: '123, MG Road, Koramangala', type: 'text', colSpan: 'md:col-span-2' },
    { name: 'pinCode' as const, label: 'PIN Code', icon: Hash, placeholder: '560001', type: 'text', colSpan: '', maxLength: 6 },
    { name: 'city' as const, label: 'City', icon: Building, placeholder: 'Bangalore', type: 'text', colSpan: '' },
    { name: 'state' as const, label: 'State', icon: Map, placeholder: 'Karnataka', type: 'text', colSpan: 'md:col-span-2' },
  ];

  return (
    <div className="container mx-auto px-4 py-6 lg:py-10 max-w-5xl flex-grow">
      <CheckoutProgress currentStep={2} />

      <div className="flex items-center gap-4 border-b border-green-100 pb-6 mb-8 animate-fadeInUp">
        <Link href="/" className="text-gray-400 hover:text-green-600 transition-colors p-2 rounded-xl hover:bg-green-50">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-900">Shipping Details</h1>
          <p className="text-sm text-gray-500 mt-0.5">Where should we deliver your eco-goodies?</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Form */}
        <div className="lg:w-2/3 animate-fadeInUp delay-100">
          <div className="glass-card p-5 md:p-8 rounded-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

              <div className="pt-5 border-t border-green-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Link
                  href="/"
                  className="px-6 py-3 text-sm text-gray-500 hover:text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-center"
                >
                  Back to Cart
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  Continue to Payment
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Mini Order Summary */}
        <div className="lg:w-1/3 animate-slideInRight delay-200">
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
                  <span className="text-sm font-bold text-green-700">₹{item.product_price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-green-100 mt-4 pt-4 flex justify-between">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-bold text-green-700 text-lg">₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
