"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Option = { opID: number; opName: string; opPrice: number };
type OptionGroup = { ogID: number; ogName: string; ogMultiple: boolean; ogForce: boolean; option: Option[] };
type Food = { foodID: number; foodName: string; foodDetails: string; foodPrice: number; foodPic: string | null; optionGroups?: OptionGroup[] };

export default function FoodDetailPage({ params }: { params: { shopId: string; foodId: string } }) {
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Option selections
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number[]>>({});
  const [note, setNote] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/shop/${params.shopId}/food/${params.foodId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Food not found");
        return res.json();
      })
      .then(setFood)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.shopId, params.foodId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner"></span></div>;
  if (error || !food) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">ไม่พบอาหารนี้</div>;

  const handleOptionChange = (ogID: number, opID: number, multiple: boolean) => {
    setSelectedOptions((prev) => {
      const current = prev[ogID] || [];
      if (multiple) {
        // toggle
        return { ...prev, [ogID]: current.includes(opID) ? current.filter((x) => x !== opID) : [...current, opID] };
      } else {
        // single choice
        return { ...prev, [ogID]: [opID] };
      }
    });
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", { foodID: food.foodID, selectedOptions, note });
    alert("เพิ่มลงตะกร้าแล้ว! (Console ดูข้อมูล)");
    router.back(); // กลับไปหน้าเมนู
  };

  return (
    <div className="max-w-md mx-auto bg-base-200 min-h-screen p-4 space-y-4">
      {/* รูปอาหาร */}
      {food.foodPic && <img src={food.foodPic} alt={food.foodName} className="w-full h-64 object-cover rounded-xl" />}

      {/* ชื่อและราคา */}
      <div>
        <h1 className="text-xl font-semibold">{food.foodName}</h1>
        <p className="text-sm text-gray-500">{food.foodDetails}</p>
        <p className="text-lg font-bold text-primary mt-1">{food.foodPrice} บาท</p>
      </div>

      {/* OptionGroups */}
      {food.optionGroups?.map((og) => (
        <div key={og.ogID} className="bg-base-100 p-3 rounded-xl space-y-2 shadow-sm">
          <h2 className="font-medium">{og.ogName} {og.ogForce && <span className="text-red-500">*</span>}</h2>
          <div className="flex flex-col gap-2">
            {og.option.map((op) => {
              const checked = selectedOptions[og.ogID]?.includes(op.opID) || false;
              return (
                <label key={op.opID} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type={og.ogMultiple ? "checkbox" : "radio"}
                    name={`og-${og.ogID}`}
                    checked={checked}
                    onChange={() => handleOptionChange(og.ogID, op.opID, og.ogMultiple)}
                  />
                  <span>{op.opName} {op.opPrice > 0 && `( +${op.opPrice} บาท )`}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* หมายเหตุ */}
      <div className="bg-base-100 p-3 rounded-xl shadow-sm">
        <label className="block mb-1 font-medium">หมายเหตุ</label>
        <textarea
          className="w-full p-2 border rounded-lg resize-none"
          placeholder="เช่น ลดหวาน, ใส่พริกเพิ่ม"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      {/* ปุ่มเพิ่มตะกร้า */}
      <button
        className="w-full py-3 bg-primary text-white font-semibold rounded-xl shadow-md hover:bg-primary/90 transition"
        onClick={handleAddToCart}
      >
        เพิ่มลงตะกร้า
      </button>
    </div>
  );
}
