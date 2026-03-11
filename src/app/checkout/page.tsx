'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useCheckoutStore, ShippingAddress } from '@/store/checkoutStore';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Validation Schema
const schema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  pinCode: z.string().min(6, 'PIN Code must be at least 6 digits'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
});

export default function ShippingPage() {
  const router = useRouter();
  const setShippingAddress = useCheckoutStore((state) => state.setShippingAddress);
  const savedAddress = useCheckoutStore((state) => state.shippingAddress);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ShippingAddress>({
    resolver: zodResolver(schema),
    defaultValues: savedAddress || {
      fullName: '',
      email: '',
      phoneNumber: '',
      pinCode: '',
      city: '',
      state: '',
    }
  });

  const onSubmit = (data: ShippingAddress) => {
    setShippingAddress(data);
    router.push('/checkout/payment');
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-3xl flex-grow animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b border-green-100 pb-6 mb-8">
        <Link href="/" className="text-gray-400 hover:text-green-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-green-900">Shipping Details</h1>
      </div>

      <div className="glass-card p-6 md:p-8 rounded-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input 
                {...register('fullName')}
                className={`w-full p-3 rounded-xl border ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-100'} focus:ring-4 outline-none transition-all`}
                placeholder="Aarav Sharma"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                {...register('email')}
                type="email"
                className={`w-full p-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-100'} focus:ring-4 outline-none transition-all`}
                placeholder="aarav@eco.com"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input 
                {...register('phoneNumber')}
                type="tel"
                maxLength={10}
                className={`w-full p-3 rounded-xl border ${errors.phoneNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-100'} focus:ring-4 outline-none transition-all`}
                placeholder="9876543210"
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">PIN Code</label>
              <input 
                {...register('pinCode')}
                maxLength={6}
                className={`w-full p-3 rounded-xl border ${errors.pinCode ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-100'} focus:ring-4 outline-none transition-all`}
                placeholder="110001"
              />
              {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City</label>
              <input 
                {...register('city')}
                className={`w-full p-3 rounded-xl border ${errors.city ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-100'} focus:ring-4 outline-none transition-all`}
                placeholder="New Delhi"
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">State</label>
              <input 
                {...register('state')}
                className={`w-full p-3 rounded-xl border ${errors.state ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-100'} focus:ring-4 outline-none transition-all`}
                placeholder="Delhi"
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
            </div>
          </div>

          <div className="pt-6 border-t border-green-100 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-green-200 disabled:opacity-70 disabled:hover:scale-100"
            >
              Continue to Payment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
