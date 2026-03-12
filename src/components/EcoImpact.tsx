'use client';

import { useEffect, useState } from 'react';
import { Leaf, TreePine, Droplets } from 'lucide-react';

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

  // Impact calculations based on order value
  const treesPlanted = Math.max(1, Math.round(subtotal / 300));
  const co2Saved = Math.round(subtotal * 0.02 * 10) / 10; // kg
  const plasticAvoided = Math.round(subtotal * 0.005 * 10) / 10; // kg

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
      label: 'CO₂ offset',
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
      <div className="flex items-center gap-4 text-sm animate-fadeInUp">
        {impacts.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <item.icon className={`w-4 h-4 ${item.color}`} />
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
    <div className="glass-card rounded-2xl p-5 animate-fadeInUp">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <Leaf className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <h3 className="font-bold text-green-900 text-sm">Your Eco Impact</h3>
          <p className="text-xs text-gray-500">Every purchase makes a difference 🌍</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {impacts.map((item, i) => (
          <div
            key={i}
            className={`${item.bg} rounded-xl p-3 text-center animate-fadeInUp`}
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <item.icon className={`w-5 h-5 mx-auto mb-1.5 ${item.color}`} />
            <div className={`text-xl font-bold ${item.color}`}>
              <AnimatedCounter target={item.value} duration={1500 + i * 300} />
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
              {item.unit} {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
