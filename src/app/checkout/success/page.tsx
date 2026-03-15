'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Check, Copy, Package, PartyPopper, Share2 } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';
import { EcoImpact } from '@/components/EcoImpact';

interface ConfettiPieceData {
  id: number;
  delay: number;
  left: number;
  color: string;
  duration: number;
  rotation: number;
}

function createConfettiPieces() {
  const colors = ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#fbbf24', '#f59e0b', '#34d399', '#10b981'];
  return Array.from({ length: 40 }, (_, index) => ({
    id: index,
    delay: Math.random() * 0.5,
    left: Math.random() * 100,
    color: colors[index % colors.length],
    duration: 2 + Math.random(),
    rotation: Math.random() * 360,
  }));
}

function ConfettiPiece({ piece }: { piece: ConfettiPieceData }) {
  return (
    <div
      className="pointer-events-none fixed z-50 h-2.5 w-2.5 rounded-sm"
      style={{
        left: `${piece.left}%`,
        top: '-10px',
        backgroundColor: piece.color,
        animation: `confettiDrop ${piece.duration}s ease-in ${piece.delay}s forwards`,
        transform: `rotate(${piece.rotation}deg)`,
      }}
    />
  );
}

function getDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 4);
  return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function SuccessPage() {
  const generateOrderId = useCheckoutStore((state) => state.generateOrderId);
  const clearCart = useCheckoutStore((state) => state.clearCart);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [confettiPieces] = useState(createConfettiPieces);

  useEffect(() => {
    const orderTimer = setTimeout(() => {
      const generatedId = generateOrderId();
      setOrderId(generatedId);
    }, 0);
    const revealTimer = setTimeout(() => setShowContent(true), 400);

    const clearTimer = setTimeout(() => clearCart(), 2000);
    return () => {
      clearTimeout(orderTimer);
      clearTimeout(revealTimer);
      clearTimeout(clearTimer);
    };
  }, [generateOrderId, clearCart]);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container relative mx-auto flex flex-grow items-center justify-center overflow-hidden px-4 py-12">
      {confettiPieces.map((piece) => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}

      <div className={`w-full max-w-xl space-y-6 transition-all duration-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="glass-card rounded-3xl p-8 text-center md:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-200 animate-bounceIn">
            <PartyPopper className="h-10 w-10" />
          </div>

          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-green-900 md:text-4xl">Order Successful</h1>
          <p className="mb-6 text-base text-gray-500">
            Thanks for choosing sustainable products. Your order is confirmed and being prepared for dispatch.
          </p>

          {orderId && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 animate-fadeInUp delay-200">
              <p className="mb-1 text-xs text-gray-500">Order ID</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-lg font-bold tracking-wider text-green-800">{orderId}</code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-green-100 hover:text-green-600"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="mb-6 grid grid-cols-2 gap-3 animate-fadeInUp delay-300">
            <div className="rounded-xl border border-green-50 bg-white/60 p-3">
              <Package className="mx-auto mb-1.5 h-5 w-5 text-green-500" />
              <p className="text-[10px] text-gray-400">Status</p>
              <p className="text-sm font-semibold text-gray-800">Confirmed</p>
            </div>
            <div className="rounded-xl border border-green-50 bg-white/60 p-3">
              <Calendar className="mx-auto mb-1.5 h-5 w-5 text-green-500" />
              <p className="text-[10px] text-gray-400">Expected By</p>
              <p className="text-sm font-semibold text-gray-800">{getDeliveryDate()}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-50 px-6 py-3 text-sm font-semibold text-green-700 transition-all hover:bg-green-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Ecoyaan Order',
                    text: `I placed an eco-friendly order on Ecoyaan. Order ID: ${orderId}`,
                  });
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        <div className="animate-fadeInUp delay-500">
          <EcoImpact subtotal={800} variant="card" />
        </div>
      </div>
    </div>
  );
}
