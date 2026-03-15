import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecoyaan - Sustainable Checkout",
  description: "A premium eco-friendly shopping experience. Shop sustainable products with a smooth, modern checkout flow.",
  keywords: ["ecoyaan", "sustainable", "eco-friendly", "checkout", "green shopping"],
  openGraph: {
    title: "Ecoyaan - Sustainable Checkout",
    description: "Shop sustainable products with a smooth, modern checkout flow.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}>
        <Header />
        <main className="flex flex-grow flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
