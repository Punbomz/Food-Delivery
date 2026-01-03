"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AlertModal from "@/app/components/AlertModal";
import { useAlertModal } from "@/app/hooks/useAlertModal";
import ConfirmModal from '@/app/components/ConfirmModal';
import { useConfirmModal } from "@/app/hooks/useConfirmModal";

export default function CartItemRow({
  item,
  onChange,
}: {
  item: any;
  onChange: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const updateQty = async (qty: number) => {
    if (qty < 1) return;
    setLoading(true);
    try {
      await fetch(`/api/customer/cart/item/${item.cartItemID}`, {
        credentials: "include",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      });
      onChange();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      showAlert("อัพเดทจำนวนไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async () => {
    showConfirm("ยืนยันการลบรายการสินค้านี้จากตะกร้า", async () => {
      setLoading(true);
      try {
        await fetch(`/api/customer/cart/item/${item.cartItemID}`, {
          credentials: "include",
          method: "DELETE",
        });
        onChange();
      } catch (error) {
        console.error("Failed to delete item:", error);
        showAlert("ลบรายการไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    });
  };

  const editItem = () => {
    const searchParams = new URLSearchParams({
      edit: item.cartItemID,
      quantity: String(item.cartItemQuantity),
      note: item.cartItemNote || "",
      selectedOptions: JSON.stringify(item.options.map((opt: any) => opt.option.opID)),
    });

    router.push(`/shop/${item.food.shopID}/food/${item.food.foodID}?${searchParams.toString()}`);
  };

  const groupedOptions = item.options.reduce((acc: any, op: any) => {
    const groupName = op.option.optionGroup.ogName;
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push({
      name: op.option.opName,
      price: op.optionPriceSnapshot
    });
    return acc;
  }, {});

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

      <div className="shadow-lg border rounded-lg p-3 bg-base-200">
        <div className="flex gap-3">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-3 items-center">
              {item.food.foodPic && (
                <img 
                  src={item.food.foodPic} 
                  alt={item.food.foodName} 
                  className="w-20 h-20 object-cover rounded" 
                />
              )}
              <p className="font-medium">{item.food.foodName}</p>
            </div>

            <div className="flex justify-end">
              <div className="text-right ml-4">
                <p className="font-semibold text-lg">
                  ฿
                  {(item.foodPriceSnapshot +
                    item.options.reduce(
                      (s: number, o: any) => s + o.optionPriceSnapshot,
                      0
                    )) *
                    item.cartItemQuantity}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 mt-3 pl-1">
          <div className="flex flex-col">
            {/* แสดง options แบบจัดกลุ่ม */}
            {Object.entries(groupedOptions).map(([groupName, options]: [string, any]) => (
              <div key={groupName} className="mt-1">
                <p className="text-xs font-medium text-gray-600">{groupName}</p>
                {options.map((opt: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs text-gray-500 ml-2">
                    <span>• {opt.name}</span>
                    {opt.price > 0 && <span>+{opt.price} บาท</span>}
                  </div>
                ))}
              </div>
            ))}

            {item.cartItemNote && (
              <p className="text-xs text-gray-400 mt-1">
                หมายเหตุ: {item.cartItemNote}
              </p>
            )}
          </div>
        </div>
        

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <button
              className="btn btn-sm"
              disabled={loading}
              onClick={() => updateQty(item.cartItemQuantity - 1)}
            >
              −
            </button>
            <span>{item.cartItemQuantity}</span>
            <button
              className="btn btn-sm"
              disabled={loading}
              onClick={() => updateQty(item.cartItemQuantity + 1)}
            >
              +
            </button>
          </div>

          <div className="flex gap-2">
            <button
              className="text-blue-500 text-sm hover:cursor-pointer"
              onClick={editItem}
              disabled={loading}
            >
              แก้ไข
            </button>
            <button
              className="text-red-500 text-sm hover:cursor-pointer"
              onClick={removeItem}
              disabled={loading}
            >
              ลบ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}