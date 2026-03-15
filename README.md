# Ecoyaan Checkout Flow

Frontend checkout assignment built with Next.js and TypeScript.

Live app: [https://ecoyaan-checkout-eosin.vercel.app](https://ecoyaan-checkout-eosin.vercel.app)

## What this project includes

- Multi-step flow: Cart -> Shipping -> Payment -> Success
- Responsive UI for mobile and desktop
- Sticky bottom action bar for checkout steps
- Multiple shipping addresses (add, select, edit, delete)
- Persisted shipping draft and selected address after refresh
- Cart state and checkout state powered by Zustand persist
- Form validation with React Hook Form + Zod
- Promo code support (`ECO10`, `GREEN20`, `EARTH15`, `NATURE25`)
- Eco impact summary widget
- Mock cart API at `src/app/api/cart/route.ts`

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Zustand
- React Hook Form
- Zod
- Lucide React

## Project structure

```text
src/
  app/
    api/cart/route.ts
    checkout/
      page.tsx
      payment/page.tsx
      success/page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    CartActions.tsx
    CartInitializer.tsx
    CartSummary.tsx
    CheckoutProgress.tsx
    CouponInput.tsx
    EcoImpact.tsx
    Footer.tsx
    Header.tsx
    StickyCheckoutActions.tsx
  store/
    checkoutStore.ts
```

## Local development

```bash
git clone https://github.com/harshilnayi/ecoyaan.git
cd ecoyaan/ecoyaan-checkout
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run build
```
