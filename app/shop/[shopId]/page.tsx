"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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
  shopDetail: string;
  shopPic?: string | null;
  shopOpen: boolean;
  categories: Category[];
};

export default function ShopMenuPage() {
  const { shopId } = useParams<{ shopId: string }>();
  const router = useRouter();

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!shopId) return;

    setLoading(true);
    setError(false);

    fetch(`/api/shop/${shopId}/menu`)
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
  }, [shopId]);

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
    <div className="mx-auto bg-base-200 min-h-screen">
      {/* Header ร้าน */}
      <div className="bg-base-100 p-5 mt-5 lg:mt-20 shadow-sm">
        {shop.shopPic && (
          <img
            src={shop.shopPic}
            alt={shop.shopName}
            className="w-full h-40 lg:h-120 object-cover rounded-xl mb-3"
          />
        )}

        <h1 className="text-2xl font-semibold">{shop.shopName}</h1>
        { shop.shopDetail && (
          <h1 className="text-xl">{shop.shopDetail}</h1>
        )}

        <span
          className={`inline-block mt-5 px-3 py-1 rounded-full text-sm text-white
            ${shop.shopOpen ? "bg-success" : "bg-error"}`}
        >
          {shop.shopOpen ? "เปิดอยู่" : "ปิดร้าน"}
        </span>
      </div>

      <div className="flex justify-center">
      {/* เมนู แยกหมวด */}
        <div className="w-3xl p-4 space-y-6 bg-base-300 shadow-lg rounded-box m-5">
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
                    router.push(`/shop/${shopId}/food/${food.foodID}`)
                  }
                  className={`flex gap-4 p-4 bg-base-100 rounded-xl shadow-sm transition justify-between items-center
                    ${
                      shop.shopOpen
                        ? "cursor-pointer active:scale-[0.98]"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                >
                  <div className="flex gap-3 items-center">
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
                        {food.foodPrice.toFixed(2)} บาท
                      </p>
                    </div>
                  </div>
                  <i className='far text-xl'>&#xf0fe;</i>  
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
