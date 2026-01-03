"use client";
import { useEffect, useState } from "react";
import CartItemRow from "@/app/components/CartItemRow";
import CartSummary from "@/app/components/CartSummary";
import AlertModal from "@/app/components/AlertModal";
import { useAlertModal } from "@/app/hooks/useAlertModal";
import ConfirmModal from '@/app/components/ConfirmModal';
import { useConfirmModal } from "@/app/hooks/useConfirmModal";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { isOpen, message, navigateTo, showAlert, closeAlert } = useAlertModal();

  const { 
      isOpen: isConfirmOpen, 
      message: confirmMessage,
      title: confirmTitle,
      confirmText,
      cancelText,
      showConfirm, 
      handleConfirm, 
      handleCancel 
  } = useConfirmModal();

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/getdata/customer/cart", {
        credentials: "include",
      });
      const data = await res.json();
      setCart(data.cart);
    } catch (err) {
      console.error(err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <div className="p-10 text-center">กำลังโหลด...</div>;
  if (!cart || cart.items.length === 0)
    return <div className="p-10 text-center">ไม่มีสินค้าในตะกร้า</div>;

  return (
    <>
    <AlertModal
        isOpen={isOpen}
        message={message}
        navigateTo={navigateTo}
        onClose={closeAlert}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <div className="max-w-2xl mx-auto p-10 pb-40">
        <h1 className="text-xl font-bold mb-4">
          ตะกร้าร้าน {cart.shop.shopName}
        </h1>

        <div className="space-y-4">
          {cart.items.map((item: any) => (
            <CartItemRow
              key={item.cartItemID}
              item={item}
              onChange={fetchCart}
            />
          ))}
        </div>

        <CartSummary cart={cart} />
      </div>
    </>
  );
}
