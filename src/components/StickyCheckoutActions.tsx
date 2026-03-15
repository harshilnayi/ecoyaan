'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface StickyCheckoutActionsProps {
  backHref: string;
  backLabel: string;
  primaryLabel: string;
  primaryFormId?: string;
  primaryButtonType?: 'button' | 'submit';
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  onPrimaryClick?: () => void;
}

export function StickyCheckoutActions({
  backHref,
  backLabel,
  primaryLabel,
  primaryFormId,
  primaryButtonType = 'button',
  primaryDisabled = false,
  primaryLoading = false,
  onPrimaryClick,
}: StickyCheckoutActionsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-green-100/80 bg-white/95 backdrop-blur-xl">
      <div className="container mx-auto max-w-5xl px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={backHref}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-green-200 hover:bg-green-50 sm:w-48"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>

          <button
            type={primaryButtonType}
            form={primaryFormId}
            onClick={onPrimaryClick}
            disabled={primaryDisabled || primaryLoading}
            className="btn-primary h-12 w-full sm:flex-1"
          >
            {primaryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
