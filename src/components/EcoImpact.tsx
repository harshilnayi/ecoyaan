'use client';

import { useEffect, useState } from 'react';
import { Droplets, Leaf, TreePine } from 'lucide-react';

interface EcoImpactProps {
  subtotal: number;
  variant?: 'card' | 'inline';
}

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start * 10) / 10);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count % 1 === 0 ? count : count.toFixed(1)}</span>;
}

export function EcoImpact({ subtotal, variant = 'card' }: EcoImpactProps) {
  const [isVisible, setIsVisible] = useState(false);

  const treesPlanted = Math.max(1, Math.round(subtotal / 300));
  const co2Saved = Math.round(subtotal * 0.02 * 10) / 10;
  const plasticAvoided = Math.round(subtotal * 0.005 * 10) / 10;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const impacts = [
    {
      icon: TreePine,
      value: treesPlanted,
      unit: treesPlanted === 1 ? 'tree' : 'trees',
      label: 'planted',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Leaf,
      value: co2Saved,
      unit: 'kg',
      label: 'CO2 offset',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Droplets,
      value: plasticAvoided,
      unit: 'kg',
      label: 'plastic saved',
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ];

  if (variant === 'inline') {
    return (
      <div className="animate-fadeInUp flex items-center gap-4 text-sm">
        {impacts.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <span className={`font-bold ${item.color}`}>
              <AnimatedCounter target={item.value} />
            </span>
            <span className="text-gray-500">{item.unit}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card animate-fadeInUp rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
          <Leaf className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-green-900">Your Eco Impact</h3>
          <p className="text-xs text-gray-500">Each order supports measurable sustainability goals.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {impacts.map((item, index) => (
          <div
            key={item.label}
            className={`${item.bg} animate-fadeInUp rounded-xl border border-green-100/70 p-3 text-center`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <item.icon className={`mx-auto mb-1.5 h-5 w-5 ${item.color}`} />
            <div className={`text-xl font-bold ${item.color}`}>
              <AnimatedCounter target={item.value} duration={1500 + index * 300} />
            </div>
            <div className="mt-0.5 text-[10px] leading-tight text-gray-500">
              {item.unit} {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
