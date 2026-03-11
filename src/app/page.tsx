import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { CartItem } from "@/store/checkoutStore";
import CartInitializer from "@/components/CartInitializer";

async function getCartData() {
  // Mock data as requested in the assignment
  const data = {
    cartItems: [
      {
        product_id: 101,
        product_name: "Bamboo Toothbrush (Pack of 4)",
        product_price: 299,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3",
      },
      {
        product_id: 102,
        product_name: "Reusable Cotton Produce Bags",
        product_price: 450,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000&ixlib=rb-4.0.3",
      }
    ],
    shipping_fee: 50,
    discount_applied: 0
  };

  return data;
}

export default async function CartPage() {
  const data = await getCartData();
  
  const subtotal = data.cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
  const grandTotal = subtotal + data.shipping_fee - data.discount_applied;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl flex-grow animate-in fade-in duration-500">
      <CartInitializer items={data.cartItems as CartItem[]} fee={data.shipping_fee} discount={data.discount_applied} />

      <h1 className="text-3xl font-bold text-green-900 mb-8">Review Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-4">
          {data.cartItems.map((item) => (
            <div key={item.product_id} className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-transform hover:-translate-y-1 duration-300">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0 shadow-sm border border-green-50">
                <Image 
                  src={item.image} 
                  alt={item.product_name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between h-full py-1 text-center sm:text-left w-full">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{item.product_name}</h3>
                  <p className="text-gray-500 text-sm mt-1">Quantity: {item.quantity}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-green-700 text-lg">₹{item.product_price}</span>
                  <button className="text-red-400 hover:text-red-500 p-2 transition-colors rounded-full hover:bg-red-50" aria-label="Remove item">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-1/3">
          <div className="glass-card p-6 rounded-2xl sticky top-24">
            <h2 className="text-xl font-bold text-green-900 mb-6 border-b border-green-100 pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
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
              
              <div className="border-t border-green-100 pt-4 mt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-800">Grand Total</span>
                  <span className="font-bold text-green-700 text-2xl">₹{grandTotal}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">Inclusive of all taxes</p>
              </div>
            </div>

            <Link 
              href="/checkout"
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-green-200"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
              <span className="font-medium">🌱 100% Eco-friendly Packaging</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
