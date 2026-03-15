import { NextResponse } from 'next/server';

export async function GET() {
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

  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(data);
}
