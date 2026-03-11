# Ecoyaan Checkout Flow

Welcome to the **Ecoyaan Checkout Flow** project! This is a simplified, responsive checkout experience built as a frontend engineering assignment for Ecoyaan. It is a 2-page flow (Cart -> Shipping -> Payment/Success) that showcases modern tooling, clean architecture, and a premium "eco-friendly" UI/UX.

## Live Demo
> **[https://ecoyaan-checkout-eosin.vercel.app](https://ecoyaan-checkout-eosin.vercel.app)**

## Tech Stack
This project leverages a modern React ecosystem to ensure fast load times, excellent developer experience, and solid typed architectures:

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 
- **Styling:** Tailwind CSS (Customized with eco-friendly utility classes and CSS variables)
- **State Management:** Zustand (Persisted client-side state for cart and shipping info)
- **Form Handling:** React Hook Form + Zod (For robust validation)
- **Icons:** Lucide-React

## Features

- **Store Data Fetching:** Demonstrates fetching mock cart data asynchronously via SSR in the root `page.tsx`. A custom `CartInitializer` client component cleanly synchronizes this server data into the global Zustand store.
- **Form Validation:** The Shipping Address screen (`/checkout`) implements strict real-time validation (e.g., 10-digit phone numbers, required fields, and valid emails).
- **State Persistence:** Shipping information and cart updates are persisted across the navigation flow, so users don't lose data if they refresh midway.
- **Responsive & Premium UI:** Thoughtfully designed with "glassmorphism", subtle micro-transitions (`hover:-translate-y-1`), and a nature-inspired color palette to match Ecoyaan's brand.

## Local Development

If you'd like to run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ecoyaan.git
   cd ecoyaan
   ```

2. **Install dependencies:**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View the app:**
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Architectural Notes
To ensure the code is humanized, readable, and modular, I avoided complex over-engineering. 
- **Zustand** was selected over Redux or Context API because it avoids provider wrappers and boilerplate, resulting in much cleaner component trees.
- I utilized **Tailwind configuration in `globals.css`** to create a single source of truth for the brand colors `(--color-green-*)`, keeping the component classes semantic.
- The mock API is located in `app/api/cart/route.ts` to simulate a real-world asynchronous backend call over simple static JSON imports.

If you have any questions about the code or architecture, feel free to reach out. Thank you for the opportunity! 🌱
