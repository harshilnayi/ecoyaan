import { Heart, Leaf, Recycle, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-green-100/70 bg-gradient-to-b from-green-50/60 to-green-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-green-700">
            <Leaf className="h-4 w-4" />
            <span className="text-sm font-semibold">Ecoyaan</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <Recycle className="h-3.5 w-3.5 text-green-600" />
              100% eco packaging
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
              secure payments
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-green-600" />
              carbon neutral
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Made with</span>
            <Heart className="h-3 w-3 fill-red-400 text-red-400" />
            <span>for the planet</span>
          </div>
        </div>

        <div className="mt-4 border-t border-green-100/70 pt-4 text-center">
          <p className="text-xs text-gray-500">
            (c) {new Date().getFullYear()} Ecoyaan. All rights reserved. Sustainable living made simple.
          </p>
        </div>
      </div>
    </footer>
  );
}
