"use client";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "./CartContext";

export default function Cart() {
  const { cart, loading } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const notShow = pathname === "/customer/cart" || pathname.startsWith("/customer/orders/payment/") || pathname.startsWith("/customer/orders/");

  if (loading || !cart || cart.items.length === 0 || notShow) return null;

  const totalPrice = cart.items.reduce((sum: number, item: any) => {
    const optionTotal = item.options.reduce(
      (s: number, o: any) => s + o.optionPriceSnapshot,
      0
    );

    return (
      sum +
      (item.foodPriceSnapshot + optionTotal) *
        item.cartItemQuantity
    );
  }, 0);

  return (
    !notShow && (
      <div
        className="
          fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]
          w-[95%] max-w-md bg-white rounded-2xl shadow-xl p-4 border
        "
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <i className="fas fa-shopping-cart text-xl" />
            <span>• {cart.items.length} รายการ</span>
          </div>

          <button
            onClick={() => router.push("/customer/cart")}
            className="btn btn-success text-white"
          >
            ชำระเงิน • {totalPrice.toFixed(2)} บาท
          </button>
        </div>
      </div>
    )
  );
}
