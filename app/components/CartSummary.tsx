"use client";

import AlertModal from "@/app/components/AlertModal";
import { useAlertModal } from "@/app/hooks/useAlertModal";
import ConfirmModal from '@/app/components/ConfirmModal';
import { useConfirmModal } from "@/app/hooks/useConfirmModal";
import { useState } from "react";

export default function CartSummary({ cart }: { cart: any }) {
  const [loading, setLoading] = useState(false);
  
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

  const total = cart.items.reduce((sum: number, item: any) => {
    const optionTotal = item.options.reduce(
      (s: number, o: any) => s + o.optionPriceSnapshot,
      0
    );
    return (
      sum +
      (item.foodPriceSnapshot + optionTotal) * item.cartItemQuantity
    );
  }, 0);

  const confirmOrder = async () => {
    showConfirm("ยืนยันการสั่งซื้อ?", async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/customer/order/add", {
          credentials: "include",
          method: "POST",
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to create order");
        }

        const data = await res.json();
        showAlert("สั่งซื้อสำเร็จ", `/customer/orders/payment/${data.orderID}`);
      } catch(error) {
        console.error("Failed to confirm order:", error);
        showAlert("การสั่งซื้อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    });
  };

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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg rounded-t-lg">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">ยอดรวม</p>
            <p className="text-xl font-bold">฿{total.toFixed(2)}</p>
          </div>

          <button
            className="btn btn-success p-5"
            onClick={confirmOrder}
            disabled={loading}
          >
            {loading ? "กำลังดำเนินการ..." : "ยืนยันการสั่งซื้อ"}
          </button>
        </div>
      </div>
    </>
  );
}