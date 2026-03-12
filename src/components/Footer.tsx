import { Leaf, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-green-100/60 mt-auto bg-gradient-to-b from-green-50/50 to-green-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-green-700">
            <Leaf className="w-4 h-4" />
            <span className="font-semibold text-sm">Ecoyaan</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-400">
            <span>🌱 100% Eco-Packaging</span>
            <span>🔒 Secure Payments</span>
            <span>♻️ Carbon Neutral</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            <span>for the planet</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-green-100/60 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Ecoyaan. All rights reserved. Sustainable living, made simple.
          </p>
        </div>
      </div>
    </footer>
  );
}
