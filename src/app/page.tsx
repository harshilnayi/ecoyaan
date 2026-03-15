import Image from "next/image";
import { Leaf, ShieldCheck, Truck } from "lucide-react";
import { CartItem } from "@/store/checkoutStore";
import CartInitializer from "@/components/CartInitializer";
import { CheckoutProgress } from "@/components/CheckoutProgress";
import { EcoImpact } from "@/components/EcoImpact";
import CartActions from "@/components/CartActions";
import CartSummary from "@/components/CartSummary";

async function getCartData() {
  return {
    cartItems: [
      {
        product_id: 101,
        product_name: "Bamboo Toothbrush (Pack of 4)",
        product_price: 299,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=800",
      },
      {
        product_id: 102,
        product_name: "Reusable Cotton Produce Bags",
        product_price: 450,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
      },
    ],
    shipping_fee: 50,
    discount_applied: 0,
  };
}

export default async function CartPage() {
  const data = await getCartData();
  const subtotal = data.cartItems.reduce((acc, item) => acc + item.product_price * item.quantity, 0);
  const itemCount = data.cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="container mx-auto flex-grow max-w-6xl px-4 py-6 lg:py-10">
      <CartInitializer items={data.cartItems as CartItem[]} fee={data.shipping_fee} discount={data.discount_applied} />

      <CheckoutProgress currentStep={1} />

      <section className="surface-card relative overflow-hidden p-5 md:p-7 animate-fadeInUp">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-green-100/50 to-transparent" />
        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-green-700">Checkout Review</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-green-950 md:text-4xl">Your Cart</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 md:text-base">
            {itemCount} {itemCount === 1 ? "item is" : "items are"} ready for checkout. Review quantities and continue when ready.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <span className="badge-pill">
              <Leaf className="h-3.5 w-3.5" />
              low impact essentials
            </span>
            <span className="badge-pill">
              <ShieldCheck className="h-3.5 w-3.5" />
              secure checkout
            </span>
            <span className="badge-pill">
              <Truck className="h-3.5 w-3.5" />
              fast dispatch
            </span>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="space-y-4 lg:w-2/3">
          {data.cartItems.map((item, index) => (
            <div
              key={item.product_id}
              className="glass-card-hover animate-fadeInUp rounded-2xl p-4 sm:p-5"
              style={{ animationDelay: `${index * 100 + 200}ms` }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl ring-1 ring-green-100 sm:h-32 sm:w-32">
                  <Image
                    src={item.image}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 112px, 128px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-green-700">Eco Pick #{index + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900">{item.product_name}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700">Eco certified</span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">Plastic free</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-green-700">Rs {item.product_price}</span>
                      <span className="text-sm text-gray-500">per unit</span>
                    </div>
                    <CartActions productId={item.product_id} initialQuantity={item.quantity} />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="animate-fadeInUp delay-400">
            <EcoImpact subtotal={subtotal} />
          </div>
        </div>

        <div className="animate-slideInRight delay-300 lg:w-1/3">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
