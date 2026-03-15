'use client';

import { CheckCircle, ShoppingCart, Truck, CreditCard } from 'lucide-react';

interface CheckoutProgressProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { id: 1, label: 'Cart', icon: ShoppingCart },
  { id: 2, label: 'Shipping', icon: Truck },
  { id: 3, label: 'Payment', icon: CreditCard },
];

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="mx-auto mb-8 w-full max-w-lg md:mb-12">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-[10%] right-[10%] top-5 z-0 h-0.5 bg-gray-200" />
        <div
          className="absolute left-[10%] top-5 z-0 h-0.5 bg-green-500 transition-all duration-700 ease-out"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 80}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500
                  ${isCompleted
                    ? 'border-green-500 bg-green-500 text-white shadow-md shadow-green-200'
                    : isActive
                      ? 'animate-progressPulse border-green-600 bg-green-600 text-white shadow-lg shadow-green-200'
                      : 'border-gray-200 bg-white text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
                <span
                className={`mt-2 text-xs font-semibold tracking-wide transition-colors duration-300 ${
                  isCompleted || isActive ? 'text-green-700' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
