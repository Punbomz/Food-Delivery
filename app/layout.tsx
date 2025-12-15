import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from './component/navbar'
import { Footer } from './component/footer'

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
    <html lang="en" data-theme="light">
      <Navbar />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="mt-15 mb-15">
          {children}
        </div>
      </body>
      <Footer />
    </html>
  );
}
