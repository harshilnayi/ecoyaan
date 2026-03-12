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
    <div className="w-full max-w-lg mx-auto mb-8 md:mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0" />
        {/* Progress Line Active */}
        <div
          className="absolute top-5 left-[10%] h-0.5 bg-green-500 z-0 transition-all duration-700 ease-out"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 80}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                  ${isCompleted
                    ? 'bg-green-500 text-white shadow-md shadow-green-200'
                    : isActive
                      ? 'bg-green-600 text-white shadow-lg shadow-green-200 animate-progressPulse'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
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
                className={`
                  mt-2 text-xs font-semibold tracking-wide transition-colors duration-300
                  ${isCompleted || isActive ? 'text-green-700' : 'text-gray-400'}
                `}
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
