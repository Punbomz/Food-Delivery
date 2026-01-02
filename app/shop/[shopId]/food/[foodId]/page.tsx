"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AlertModal from "@/app/components/AlertModal";
import { useAlertModal } from "@/app/hooks/useAlertModal";

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
  options: Option[];
};

type Food = {
  foodID: number;
  foodName: string;
  foodDetails: string | null;
  foodPrice: number;
  foodPic: string | null;
  optionGroups: OptionGroup[];
};


export default function FoodDetailPage() {
  const { shopId, foodId } = useParams<{
    shopId: string;
    foodId: string;
  }>();

  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [forceError, setForceError] = useState<number | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<Record<number, number[]>>({});
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState(1);

  const router = useRouter();

  const { isOpen, message, navigateTo, showAlert, closeAlert } = useAlertModal();

  useEffect(() => {
    if (!shopId || !foodId) return;

    setLoading(true);
    setError(false);

    fetch(`/api/shop/${shopId}/food/${foodId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Food not found");
        return res.json();
      })
      .then((data: Food) => {
        console.log(data);
        setFood(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [shopId, foodId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        ไม่พบอาหารนี้
      </div>
    );
  }

  const handleOptionChange = (ogID: number, opID: number, multiple: boolean) => {
    setSelectedOptions((prev) => {
      const current = prev[ogID] || [];
      return {
        ...prev,
        [ogID]: multiple
          ? current.includes(opID)
            ? current.filter((x) => x !== opID)
            : [...current, opID]
          : [opID],
      };
    });

    if (forceError === ogID) {
      setForceError(null);
    }
  };

  const getSelectedOptionIDs = (): number[] => {
    return Object.values(selectedOptions).flat();
  };

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!food) return;

    if (!validateRequiredOptions()) {
      return;
    }

    const payload = {
      shopID: Number(shopId),
      foodID: food.foodID,
      quantity: amount,
      note: note || null,
      optionIDs: getSelectedOptionIDs(),
    };

    try {
      const res = await fetch("/api/customer/cart/add", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Add to cart failed");
      }

      await res.json();

      showAlert("เพิ่มลงตะกร้าแล้ว!", "back");
    } catch (err) {
      console.error(err);
      showAlert("เกิดข้อผิดพลาด! กรุณาลองใหม่");
    }
  };

  const validateRequiredOptions = () => {
    if (!food) return false;

    for (const og of food.optionGroups) {
      if (og.ogForce) {
        const selected = selectedOptions[og.ogID] || [];
        if (selected.length === 0) {
          setForceError(og.ogID);
          return false;
        }
      }
    }

    setForceError(null);
    return true;
  };

  const calculateTotalPrice = () => {
    if (!food) return 0;

    let optionTotal = 0;

    for (const og of food.optionGroups) {
      const selected = selectedOptions[og.ogID] || [];
      for (const opID of selected) {
        const option = og.options.find((o) => o.opID === opID);
        if (option) optionTotal += option.opPrice;
      }
    }

    return (food.foodPrice + optionTotal) * amount;
  };

  const isOrderValid = () => {
  if (!food) return false;

  return food.optionGroups.every((og) => {
      if (!og.ogForce) return true;
      const selected = selectedOptions[og.ogID] || [];
      return selected.length > 0;
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
      <div className="mx-auto bg-base-200 min-h-screen">
        <div className="bg-base-100 min-h-screen p-5 mt-5 lg:mt-20 shadow-sm">

          <div className="block lg:hidden">
            {food.foodPic && (
              <img
                src={food.foodPic}
                alt={food.foodName}
                className="w-full h-40 lg:h-120 object-cover rounded-xl mb-3"
              />
            )}

            <div>
              <h1 className="text-xl font-semibold">{food.foodName}</h1>
              <p className="text-sm text-gray-500">{food.foodDetails}</p>
              <p className="text-lg font-bold text-primary mt-1">
                ราคา {food.foodPrice.toFixed(2)} บาท
              </p>
            </div>

            <form className="flex flex-col justify-center" onSubmit={handleAddToCart}>
              {food.optionGroups?.map((og) => (
                <div
                  key={og.ogID}
                  className="bg-base-100 p-3 rounded-xl space-y-2 mt-5 shadow-md"
                >
                  <h2 className="font-medium">
                    {og.ogName}
                    {og.ogForce && <span className="text-red-500"> *</span>}
                  </h2>

                  {og.options.map((op) => {
                    const checked =
                      selectedOptions[og.ogID]?.includes(op.opID) || false;

                    return (
                      <label
                        key={op.opID}
                        className="flex items-center gap-2 cursor-pointer justify-between"
                      >
                        <div className="flex gap-2">
                          <input
                            type={og.ogMultiple ? "checkbox" : "radio"}
                            className={og.ogMultiple ? "checkbox" : "radio"}
                            name={`og-${og.ogID}`}
                            checked={checked}
                            onChange={() =>
                              handleOptionChange(og.ogID, op.opID, og.ogMultiple)
                            }
                          />
                          <span>
                            {op.opName}
                          </span>
                        </div>
                        <span>
                          {op.opPrice > 0 &&
                            ` +${op.opPrice.toFixed(2)} บาท`}
                        </span>
                      </label>
                    );
                  })}
                  {forceError === og.ogID && (
                    <p className="text-sm text-red-500">
                      กรุณาเลือกอย่างน้อย 1 รายการ
                    </p>
                  )}
                </div>
              ))}

              <fieldset className="fieldset mt-5">
                <legend className="fieldset-legend text-sm lg:text-lg">หมายเหตุ</legend>
                <textarea name="Note" className="textarea h-24 w-full p-2 border rounded-lg" placeholder="เช่น ลดหวาน, ใส่พริกเพิ่ม" rows={3} value={note} onChange={(e) => setNote(e.target.value)}></textarea>
              </fieldset>

              <div className="flex flex-col justify-center mt-3">
                <div className="text-center">เลือกจำนวน</div>
                <div className="flex gap-3 justify-center items-center mx-auto mt-2">
                  <div className="flex items-center p-3 hover:cursor-pointer btn text-xl rounded-full" onClick={() => 
                    { if(amount-1 > 0) {
                      setAmount(amount-1);
                    } else {
                      setAmount(1);
                    }}}>-</div>
                  <div className="border border-2 rounded-full w-25 p-1 text-center text-xl">{amount}</div>
                  <div className="flex items-center p-3 hover:cursor-pointer btn text-xl rounded-full" onClick={() =>  setAmount(amount+1)}>+</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isOrderValid()}
                className={`w-50 py-3 font-semibold mt-5 mx-auto rounded-full
                  ${
                    isOrderValid()
                      ? "bg-success text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                สั่งซื้อ • {calculateTotalPrice().toFixed(2)} บาท
              </button>

            </form>
          </div>

          <div className="hidden lg:block">
            <div className="flex justify-center gap-30">
                  <div>
                    <div className="mb-2">
                      <h1 className="text-xl font-semibold">{food.foodName}</h1>
                      <p className="text-sm text-gray-500">{food.foodDetails}</p>
                      <p className="text-lg font-bold text-primary mt-1">
                        ราคา {food.foodPrice.toFixed(2)} บาท
                      </p>
                    </div>

                    {food.foodPic && (
                      <img
                        src={food.foodPic}
                        alt={food.foodName}
                        className="h-50 w-auto lg:h-120 object-cover rounded-xl mb-3"
                      />
                    )}

                  </div>

                  <div>
                    <div className="flex flex-col justify-center mt-3">
                      <div className="text-center">เลือกจำนวน</div>
                      <div className="flex gap-3 justify-center items-center mx-auto mt-2">
                        <div className="flex items-center p-3 hover:cursor-pointer btn text-xl rounded-full" onClick={() => 
                          { if(amount-1 > 0) {
                            setAmount(amount-1);
                          } else {
                            setAmount(1);
                          }}}>-</div>
                        <div className="border border-2 rounded-full w-25 p-1 text-center text-xl">{amount}</div>
                        <div className="flex items-center p-3 hover:cursor-pointer btn text-xl rounded-full" onClick={() =>  setAmount(amount+1)}>+</div>
                      </div>
                    </div>

                    <form className="flex flex-col w-100 justify-center" onSubmit={handleAddToCart}>
                      {food.optionGroups?.map((og) => (
                        <div
                          key={og.ogID}
                          className="bg-base-100 p-3 rounded-xl space-y-2 mt-5 shadow-md"
                        >
                          <h2 className="font-medium">
                            {og.ogName}
                            {og.ogForce && <span className="text-red-500"> *</span>}
                          </h2>

                          {og.options.map((op) => {
                            const checked =
                              selectedOptions[og.ogID]?.includes(op.opID) || false;

                            return (
                              <label
                                key={op.opID}
                                className="flex items-center gap-2 cursor-pointer justify-between"
                              >
                                <div className="flex gap-2">
                                  <input
                                    type={og.ogMultiple ? "checkbox" : "radio"}
                                    className={og.ogMultiple ? "checkbox" : "radio"}
                                    name={`og-${og.ogID}`}
                                    checked={checked}
                                    onChange={() =>
                                      handleOptionChange(og.ogID, op.opID, og.ogMultiple)
                                    }
                                  />
                                  <span>
                                    {op.opName}
                                  </span>
                                </div>
                                <span>
                                  {op.opPrice > 0 &&
                                    ` +${op.opPrice.toFixed(2)} บาท`}
                                </span>
                              </label>
                            );
                          })}
                          {forceError === og.ogID && (
                            <p className="text-sm text-red-500">
                              กรุณาเลือกอย่างน้อย 1 รายการ
                            </p>
                          )}
                        </div>
                      ))}

                      <fieldset className="fieldset mt-5">
                        <legend className="fieldset-legend text-sm lg:text-lg">หมายเหตุ</legend>
                        <textarea name="Note" className="textarea h-25 w-full p-2 border rounded-lg" placeholder="เช่น ลดหวาน, ใส่พริกเพิ่ม" rows={3} value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                      </fieldset>

                      <button
                        type="submit"
                        disabled={!isOrderValid()}
                        className={`w-50 py-3 font-semibold mt-5 mx-auto rounded-full
                          ${
                            isOrderValid()
                              ? "bg-success text-white hover:cursor-pointer"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }
                        `}
                      >
                        สั่งซื้อ • {calculateTotalPrice().toFixed(2)} บาท
                      </button>
                    </form>

                  </div>

            </div>


          </div>
        </div>
      </div>
    </>
  );
}
