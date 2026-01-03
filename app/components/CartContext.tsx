"use client";
import { createContext, useContext, useEffect, useState } from "react";

type CartContextType = {
  cart: any | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/getdata/customer/cart", {
        credentials: "include",
      });

      if (!res.ok) {
        setCart(null);
        return;
      }

      const data = await res.json();
      console.log("FETCH CART SUCCESS:", data);
      setCart(data.cart);
    } catch (err) {
      console.error("FETCH CART ERROR:", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshCart: fetchCart,
        clearCart: () => setCart(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
