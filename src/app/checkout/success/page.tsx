import Link from 'next/link';
import { PartyPopper, ArrowLeft } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
      <div className="glass-card max-w-md w-full p-8 md:p-12 text-center rounded-3xl animate-in zoom-in-95 duration-700">
        <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <PartyPopper className="w-10 h-10" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-green-900 mb-4 tracking-tight">Order Successful!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Thank you for choosing a sustainable lifestyle. Your eco-friendly products are on their way!
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 font-semibold py-3 px-8 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
