"use client";
import { useCart } from "./CartContext";

export default function ContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cart, loading } = useCart();

  const hasCart =
    !loading && cart && cart.items && cart.items.length > 0;

  return (
    <main
      className={`transition-all duration-200 ${
        hasCart ? "pb-20" : "pb-0"
      }`}
    >
      {children}
    </main>
  );
}
