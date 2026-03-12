# 🌱 Ecoyaan Checkout Flow

A polished, responsive checkout experience built as a frontend engineering assignment for **Ecoyaan**. This project demonstrates proficiency with React, Next.js SSR, state management, form validation, and premium UI/UX design — going well beyond the MVP requirements.

## 🚀 Live Demo
> **[https://ecoyaan-checkout-eosin.vercel.app](https://ecoyaan-checkout-eosin.vercel.app)**

## 📸 Flow Overview
**Cart** → **Shipping** → **Payment** → **Success**

A 4-screen checkout flow with animated step progress indicator, eco-impact tracking, coupon codes, payment method selection, and confetti-powered success celebration.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Framework with SSR data fetching |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling with custom design system |
| **Zustand** (persisted) | Global state with localStorage persistence |
| **React Hook Form + Zod** | Form handling with schema validation |
| **Lucide React** | Icon library |
| **Inter** (Google Fonts) | Professional e-commerce typography |

---

## ✨ Features

### Core Requirements ✅
- **SSR Data Fetching** — Cart data fetched server-side in the root `page.tsx` and synced to client-side Zustand store via `CartInitializer`
- **Mock API Route** — `app/api/cart/route.ts` simulates an async backend endpoint
- **Form Validation** — Strict validation with Zod schemas (10-digit phone, valid email, 6-digit PIN, required fields)
- **State Persistence** — Zustand `persist` middleware ensures data survives page refreshes across all checkout steps
- **Responsive Design** — Mobile-first layout with sidebar order summary on desktop

### Beyond Requirements 🌟
- **Eco-Impact Calculator** — Dynamic widget showing trees planted, CO₂ offset, and plastic saved based on order value
- **Coupon Code System** — Full promo code input with validation (try: `ECO10`, `GREEN20`, `EARTH15`, `NATURE25`)
- **Interactive Quantity Controls** — +/− buttons to adjust item quantities with real-time total updates
- **Payment Method Selection** — UPI, Card, COD selection UI (simulated)
- **Estimated Delivery Date** — 3-5 business day delivery estimate
- **Payment Processing Animation** — Full-screen overlay with spinner and SSL encryption badge
- **Confetti Success Animation** — CSS-based confetti with generated order ID and copy button
- **Step Progress Indicator** — Animated 3-step progress bar across all checkout pages
- **Trust Signals** — Secure payment, free returns, and eco-packaging badges
- **Loading Skeleton** — Shimmer animation matching cart layout during SSR load
- **Premium Glassmorphism** — Custom `glass-card` utility with blur, borders, and shadow effects
- **Social Share** — Web Share API integration on success page
- **Hydration-Safe Navigation** — `isHydrated` guard prevents Zustand state race conditions

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/cart/route.ts        # Mock API endpoint (SSR data source)
│   ├── checkout/
│   │   ├── page.tsx             # Shipping form (client-side, validated)
│   │   ├── payment/page.tsx     # Payment + order confirmation
│   │   └── success/page.tsx     # Order success with confetti
│   ├── globals.css              # Design system (animations, utilities)
│   ├── layout.tsx               # Root layout (Inter font, SEO, Header/Footer)
│   ├── loading.tsx              # Loading skeleton for Suspense
│   └── page.tsx                 # Cart page (SSR)
├── components/
│   ├── CartActions.tsx           # Quantity controls (+/−/remove)
│   ├── CartInitializer.tsx       # SSR → Client state bridge
│   ├── CheckoutProgress.tsx      # 3-step progress indicator
│   ├── CouponInput.tsx           # Promo code input with validation
│   ├── EcoImpact.tsx             # Environmental impact calculator
│   ├── Footer.tsx                # Footer with trust badges
│   ├── Header.tsx                # Sticky header with cart badge
│   └── LoadingSkeleton.tsx       # Shimmer loading skeleton
├── lib/utils.ts                  # Utility functions (cn)
└── store/checkoutStore.ts        # Zustand store (cart, shipping, coupons)
```

### Key Decisions
- **Zustand over Redux/Context**: Zero boilerplate, no provider wrappers, persisted state out of the box
- **`isHydrated` pattern**: Prevents redirect race conditions on client-side pages that depend on persisted state
- **CSS-only animations**: Custom `@keyframes` for confetti, shimmer, and transitions — no extra animation library needed
- **Data-driven forms**: Shipping fields rendered from a config array for maintainability

---

## 🖥️ Local Development

```bash
# Clone the repository
git clone https://github.com/harshilnayi/ecoyaan.git
cd ecoyaan/ecoyaan-checkout

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

---

## 📄 License
Built with 💚 for Ecoyaan by [Harshil Nayi](https://github.com/harshilnayi).
