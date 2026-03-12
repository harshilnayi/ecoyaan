'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { PartyPopper, ArrowLeft, Package, Calendar, Share2, Copy, Check } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';
import { EcoImpact } from '@/components/EcoImpact';

function ConfettiPiece({ delay, left, color }: { delay: number; left: number; color: string }) {
  return (
    <div
      className="fixed w-2.5 h-2.5 rounded-sm z-50 pointer-events-none"
      style={{
        left: `${left}%`,
        top: '-10px',
        backgroundColor: color,
        animation: `confettiDrop ${2 + Math.random()}s ease-in ${delay}s forwards`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  );
}

function getDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function SuccessPage() {
  const generateOrderId = useCheckoutStore((state) => state.generateOrderId);
  const clearCart = useCheckoutStore((state) => state.clearCart);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Generate confetti data once
  const confettiPieces = useMemo(() => {
    const colors = ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#fbbf24', '#f59e0b', '#34d399', '#10b981'];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: Math.random() * 0.5,
      left: Math.random() * 100,
      color: colors[i % colors.length],
    }));
  }, []);

  useEffect(() => {
    const id = generateOrderId();
    setOrderId(id);
    setTimeout(() => setShowContent(true), 400);

    // Clear cart after a delay so the eco impact can still use the data briefly
    const timer = setTimeout(() => clearCart(), 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex-grow flex items-center justify-center relative overflow-hidden">
      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <ConfettiPiece key={piece.id} delay={piece.delay} left={piece.left} color={piece.color} />
      ))}

      <div className={`max-w-lg w-full space-y-6 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Success Card */}
        <div className="glass-card p-8 md:p-10 text-center rounded-3xl">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200 animate-bounceIn">
            <PartyPopper className="w-10 h-10" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-3 tracking-tight">
            Order Successful! 🎉
          </h1>
          <p className="text-gray-500 text-base mb-6">
            Thank you for choosing a sustainable lifestyle. Your eco-friendly products are on their way!
          </p>

          {/* Order ID */}
          {orderId && (
            <div className="bg-green-50 rounded-xl p-4 mb-6 animate-fadeInUp delay-200">
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <div className="flex items-center justify-center gap-2">
                <code className="font-mono font-bold text-green-800 text-lg tracking-wider">{orderId}</code>
                <button onClick={handleCopy} className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Delivery Timeline */}
          <div className="grid grid-cols-2 gap-3 mb-6 animate-fadeInUp delay-300">
            <div className="bg-white/60 rounded-xl p-3 border border-green-50">
              <Package className="w-5 h-5 text-green-500 mx-auto mb-1.5" />
              <p className="text-[10px] text-gray-400">Status</p>
              <p className="text-sm font-semibold text-gray-800">Confirmed</p>
            </div>
            <div className="bg-white/60 rounded-xl p-3 border border-green-50">
              <Calendar className="w-5 h-5 text-green-500 mx-auto mb-1.5" />
              <p className="text-[10px] text-gray-400">Expected By</p>
              <p className="text-sm font-semibold text-gray-800">{getDeliveryDate()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 font-semibold py-3 px-6 rounded-xl transition-all text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Ecoyaan Order', text: `I just placed an eco-friendly order on Ecoyaan! 🌱 Order ID: ${orderId}` });
                }
              }}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-600 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl border border-gray-200 transition-all text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Eco Impact */}
        <div className="animate-fadeInUp delay-500">
          <EcoImpact subtotal={800} variant="card" />
        </div>
      </div>
    </div>
  );
}
