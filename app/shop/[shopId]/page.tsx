"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Option = {
  opID: number;
  opName: string;
  opPrice: number;
};

type OptionGroup = {
  ogID: number;
  ogName: string;
  ogMultiple: boolean;
  ogForce: boolean;
  option: Option[];
};

type Food = {
  foodID: number;
  foodName: string;
  foodDetails: string;
  foodPrice: number;
  foodPic: string | null;
  optionGroups?: OptionGroup[];
};

type Category = {
  categoryName: string;
  foods: Food[];
};

type Shop = {
  shopName: string;
  shopPic?: string | null;
  shopOpen: boolean;
  categories: Category[];
};

export default function ShopMenuPage({
  params,
}: {
  params: { shopId: string };
}) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`/api/shop/${params.shopId}/menu`)
      .then((res) => {
        if (!res.ok) throw new Error("Shop not found");
        return res.json();
      })
      .then((data: Shop) => {
        setShop(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.shopId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        ไม่พบข้อมูลร้าน
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-base-200 min-h-screen">
      {/* Header ร้าน */}
      <div className="bg-base-100 p-4 shadow-sm">
        {shop.shopPic && (
          <img
            src={shop.shopPic}
            alt={shop.shopName}
            className="w-full h-48 object-cover rounded-xl mb-3"
          />
        )}

        <h1 className="text-xl font-semibold">{shop.shopName}</h1>

        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-sm text-white
            ${shop.shopOpen ? "bg-success" : "bg-error"}`}
        >
          {shop.shopOpen ? "เปิดอยู่" : "ปิดร้าน"}
        </span>
      </div>

      {/* เมนู แยกหมวด */}
      <div className="p-4 space-y-6">
        {shop.categories.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            ยังไม่มีเมนูในร้านนี้
          </p>
        )}

        {shop.categories.map((cat) => (
          <div key={cat.categoryName} className="space-y-3">
            <h2 className="text-lg font-semibold">{cat.categoryName}</h2>

            {cat.foods.length === 0 && (
              <p className="text-sm text-gray-500">ยังไม่มีเมนูในหมวดนี้</p>
            )}

            {cat.foods.map((food) => (
              <div
                key={food.foodID}
                onClick={() =>
                  shop.shopOpen &&
                  router.push(`/shop/${params.shopId}/food/${food.foodID}`)
                }
                className={`flex gap-4 p-4 bg-base-100 rounded-xl shadow-sm transition
                  ${
                    shop.shopOpen
                      ? "cursor-pointer active:scale-[0.98]"
                      : "opacity-50 cursor-not-allowed"
                  }`}
              >
                <img
                  src={food.foodPic || "/no-food.png"}
                  alt={food.foodName}
                  className="w-20 h-20 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium">{food.foodName}</p>

                  <p className="text-xs text-gray-500 line-clamp-2">
                    {food.foodDetails}
                  </p>

                  <p className="text-sm font-semibold text-primary mt-1">
                    {food.foodPrice} บาท
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
