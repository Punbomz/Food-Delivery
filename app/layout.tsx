import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from './components/navbar'
import "@fortawesome/fontawesome-free/css/all.min.css";
import Cart from "@/app/components/Cart";
import { CartProvider } from "@/app/components/CartContext";
import ContentWrapper from "@/app/components/ContentWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RMUTK",
  description: "RMUTK Food Delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="caramellatte">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <div className="mt-15">
          <CartProvider>
            <ContentWrapper>{children}</ContentWrapper>
            <Cart />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
