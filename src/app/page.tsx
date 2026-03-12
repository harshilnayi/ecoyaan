import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Shield, Truck, Package, Calendar } from "lucide-react";
import { CartItem } from "@/store/checkoutStore";
import CartInitializer from "@/components/CartInitializer";
import { CheckoutProgress } from "@/components/CheckoutProgress";
import { EcoImpact } from "@/components/EcoImpact";
import CartActions from "@/components/CartActions";
import CouponInput from "@/components/CouponInput";

async function getCartData() {
  const data = {
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
      }
    ],
    shipping_fee: 50,
    discount_applied: 0
  };

  return data;
}

function getEstimatedDelivery() {
  const today = new Date();
  const minDays = 3;
  const maxDays = 5;
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${minDate.toLocaleDateString('en-IN', options)} - ${maxDate.toLocaleDateString('en-IN', options)}`;
}

export default async function CartPage() {
  const data = await getCartData();

  const subtotal = data.cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
  const grandTotal = subtotal + data.shipping_fee - data.discount_applied;

  return (
    <div className="container mx-auto px-4 py-6 lg:py-10 max-w-6xl flex-grow">
      <CartInitializer items={data.cartItems as CartItem[]} fee={data.shipping_fee} discount={data.discount_applied} />

      <CheckoutProgress currentStep={1} />

      <h1 className="text-3xl font-bold text-green-900 mb-2 animate-fadeInUp">
        Your Cart
      </h1>
      <p className="text-gray-500 mb-8 animate-fadeInUp delay-100">
        {data.cartItems.length} {data.cartItems.length === 1 ? 'item' : 'items'} in your eco-friendly cart
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3 space-y-4">
          {data.cartItems.map((item, index) => (
            <div
              key={item.product_id}
              className="glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 animate-fadeInUp"
              style={{ animationDelay: `${index * 100 + 200}ms` }}
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 shadow-sm">
                <Image
                  src={item.image}
                  alt={item.product_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 112px, 128px"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between h-full py-1 text-center sm:text-left w-full">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{item.product_name}</h3>
                  <p className="text-gray-400 text-sm mt-1">Eco-certified • Plastic-free</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="font-bold text-green-700 text-xl">₹{item.product_price}</span>
                    <span className="text-gray-400 text-sm ml-1">per unit</span>
                  </div>
                  <CartActions productId={item.product_id} initialQuantity={item.quantity} />
                </div>
              </div>
            </div>
          ))}

          {/* Eco Impact Card */}
          <div className="animate-fadeInUp delay-400">
            <EcoImpact subtotal={subtotal} />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 animate-slideInRight delay-300">
          <div className="glass-card p-6 rounded-2xl sticky top-24 space-y-5">
            <h2 className="text-xl font-bold text-green-900 border-b border-green-100 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({data.cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span className="font-semibold text-gray-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-gray-800">₹{data.shipping_fee}</span>
              </div>
              {data.discount_applied > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{data.discount_applied}</span>
                </div>
              )}
            </div>

            {/* Coupon Input */}
            <CouponInput />

            <div className="border-t border-green-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800 text-lg">Grand Total</span>
                <span className="font-bold text-green-700 text-2xl">₹{grandTotal}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 text-right">Inclusive of all taxes</p>
            </div>

            <Link
              href="/checkout"
              className="btn-primary w-full"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Delivery Estimate */}
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-green-50 rounded-xl p-3">
              <Calendar className="w-4 h-4 text-green-600 shrink-0" />
              <span>Estimated delivery: <strong className="text-green-700">{getEstimatedDelivery()}</strong></span>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                { icon: Shield, label: 'Secure\nPayment' },
                { icon: Truck, label: 'Free\nReturns' },
                { icon: Package, label: 'Eco\nPackaging' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5 py-2">
                  <item.icon className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] text-gray-400 leading-tight whitespace-pre-line">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
