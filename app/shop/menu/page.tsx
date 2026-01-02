"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sidebar  } from "../../components/sidebar";
import AddFoodSelect from "@/app/components/AddFoodSelectModal";
import AddGenre from "@/app/components/AddGenreModal";
import AddFood from "@/app/components/AddFoodModal";
import Skeleton from "@/app/components/Skeleton";
import AlertModal from "@/app/components/AlertModal";
import { useAlertModal } from "@/app/hooks/useAlertModal";
import ConfirmModal from '@/app/components/ConfirmModal';
import { useConfirmModal } from "@/app/hooks/useConfirmModal";
import AddOption from "@/app/components/AddOptionModal";

interface Food {
    foodID: number;
    foodName: string;
    foodDetails: string;
    foodPrice: number;
    foodPic: string;
    foodGenreID: number;
    foodStatus: boolean;
    foodOptions: string[];
    [key: string]: any;
}

interface Genre {
  fGenreID: number;
  fGenreName: string;
  [key: string]: any;
}

interface OptionData {
  ogID: number;
  ogName: string;
  ogFood: number;
  ogItem: any;
}

interface Option {
  opID:  number;
  ogID: number;
  opName: string;
  opPrice: number;
}

interface Status {
  foodID: number;
  status: boolean;
}

export default function shopMenu() {
  const [shopID, setID] = useState<number | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [genre, setGenre] = useState<Genre[]>([]);
  const [status, setStatus] = useState<Status[]>([]);
  const [isUpdating, setUpdate] = useState(false);
  const [openToggle, setOpenToggle] = useState<Record<number, boolean>>({});
  const [openToggle2, setOpenToggle2] = useState<Record<number, boolean>>({});
  const [loadingPage, setLoadingPage] = useState(true);
  const [menuSelect, setMenu] = useState(1);
  const [selectId, setSelectId] = useState<number | null>(null);
  const [selectFood, setSelectFood] = useState<number | null>(null);
  const [optionData, setOptionData] = useState<OptionData[]>([]);

  const selectRef = useRef<HTMLDialogElement>(null) as React.RefObject<HTMLDialogElement>;
  const genreRef = useRef<HTMLDialogElement>(null) as React.RefObject<HTMLDialogElement>;
  const foodRef = useRef<HTMLDialogElement>(null) as React.RefObject<HTMLDialogElement>;

  const optionRef = useRef<HTMLDialogElement>(null) as React.RefObject<HTMLDialogElement>;

  const [selectedType, setSelectedType] = useState<number>(1);

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

  useEffect(() => {
      checkAuth();
      selectRef.current?.close();
      genreRef.current?.close();
      foodRef.current?.close();
      optionRef.current?.close();
  }, []);

  useEffect(() => {
    if (!shopID) return;
    getData();
  }, [shopID]);

  useEffect(() => {
    checkAuth();
    setUpdate(false);
  }, [status]);

  useEffect(() => {
    setOpenToggle(prev => {
      const next = { ...prev };
      genre.forEach(g => {
        if (next[g.fGenreID] === undefined) {
          next[g.fGenreID] = false;
        }
      });
      return next;
    });
  }, [genre]);

  useEffect(() => {
    setStatus(
      foods.map(food => ({
        foodID: food.foodID,
        status: food.foodStatus,
      }))
    );
    setLoadingPage(false);
  }, [foods]);

  useEffect(() => {
    setOpenToggle2(prev => {
      const next = { ...prev };
      optionData.forEach(o => {
        if (next[o.ogID] === undefined) {
          next[o.ogID] = false;
        }
      });
      return next;
    });
  }, [optionData]);

  useEffect(() => {
    if (selectId !== null) {
      optionRef.current?.showModal();
    }
  }, [selectId]);

  useEffect(() => {
    if (selectFood !== null) {
      foodRef.current?.showModal();
    }
  }, [selectFood]);

  const checkAuth = async () => {
      try {
          const res = await fetch("/api/auth/check", {
              credentials: "include",
          });

          if (res.ok) {
              const data = await res.json();
              setID(data.user.id);
          }
      } catch (error) {
          console.error("Auth check failed:", error);
      }
  };

  const getData = async () => {
    // Foods
    try {
      const res = await fetch("/api/getdata/shop/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: shopID,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGenre(data.fgenre)
        setFoods(data.food);
      }
    } catch(error) {
      console.error("Fetch food data failed:", error);
    }

    // Options
    try {
      const res = await fetch("/api/getdata/shop/food/option", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: shopID,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOptionData(data);
      }
    } catch(error) {
      console.error("Fetch options data failed:", error);
    }
  }

  const toggleStatus = async (foodID: number) => {
    setUpdate(true);
    setStatus(prev =>
      prev.map(s =>
        s.foodID === foodID
          ? { ...s, status: !s.status }
          : s
      )
    );

    try {
      await fetch("/api/shop/menu/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: foodID, status: status.find(s => s.foodID === foodID)?.status ?? false }),
      });
    } catch {
      setStatus(prev =>
        prev.map(s =>
          s.foodID === foodID
            ? { ...s, status: !s.status }
            : s
        )
      );
    }
    setUpdate(false);
  };

  const deleteGenre = async (genreID: number, genreName: string) => {
    showConfirm(
      "ยืนยันการลบ \"" + genreName + "\" ?\nรายการอาหารทั้งหมดในหมวดหมู่จะถูกลบ!",
      async () => {
          try {
            const res = await fetch("/api/shop/menu/genre/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: genreID,
            }),
          });

            if(res.ok) {
              getData();
              showAlert("ลบหมวดหมู่สำเร็จ!");
            } else {
              showAlert("เกิดข้อผิดพลาดในการลบหมวดหมู่!");
            }
          } catch (error) {
            showAlert("เกิดข้อผิดพลาดในการลบหมวดหมู่!");
          }
      },
    );
  }

  const deleteOption = async (optionID: number) => {
    try {
      const res = await fetch("/api/shop/menu/option/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: optionID,
        }),
      });

      if(res.ok) {
        getData();
        showAlert("ลบตัวเลือกเสริมสำเร็จ!");
      }
    } catch (error) {
      showAlert("เกิดข้อผิดพลาดในการลบตัวเลือกเสริม!");
    }
  }

  const deleteFood = async (foodID: number) => {
    try {
      const res = await fetch("/api/shop/menu/food/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: foodID,
        }),
      });

      if(res.ok) {
        getData();
        showAlert("ลบรายการอาหารสำเร็จ!");
      }
    } catch (error) {
      showAlert("เกิดข้อผิดพลาดในการลบรายการอาหาร!");
    }
  }

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

      <AddFoodSelect
        modalRef={selectRef}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        onConfirm={() => {
          selectRef.current?.close();

          if (selectedType === 1) {
            genreRef.current?.showModal();
          } else if(selectedType === 2) {
            if(genre.length > 0) {
              foodRef.current?.showModal();
            } else {
              showAlert("กรุณาเพิ่มหมวดหมู่อาหาร!");
              setSelectedType(1);
            }
          }
        }}
      />

      <AddGenre modalRef={genreRef}
        onSuccess={() => {
        genreRef.current?.close();
        getData();
      }} />

      <AddFood modalRef={foodRef}
          id={selectFood}
          onSuccess={() => {
            foodRef.current?.close();
            if(selectFood === null) {
              showAlert("เพิ่มรายการอาหารสำเร็จ!");
            } else {
              showAlert("บันทึกรายการอาหารสำเร็จ!");
            }
            setSelectFood(null);
            getData();
          }}
          onClose={() => {
            setSelectFood(null);
          }}
          onRequestDelete={(id) => {
            showConfirm(
              "ยืนยันการลบรายการอาหาร?",
              async () => {
                await deleteFood(id);
              },
              () => {
                foodRef.current?.showModal();
              },
              {
                title: "ยืนยันการลบ",
                confirmText: "ลบ",
                cancelText: "ยกเลิก",
              }
            );
          }}
      />

      <AddOption modalRef={optionRef}
          id={selectId}
          onSuccess={() => {
            setSelectId(null);
            optionRef.current?.close();
            getData();
          }}
          onClose={() => {
            setSelectId(null);
          }}
          onRequestDelete={(id) => {
            showConfirm(
              "ยืนยันการลบตัวเลือกเสริม?",
              async () => {
                await deleteOption(id);
              },
              () => {
                optionRef.current?.showModal();
              },
              {
                title: "ยืนยันการลบ",
                confirmText: "ลบ",
                cancelText: "ยกเลิก",
              }
            );
          }}
      />

      <div className="fixed bottom-10 right-10 
                      w-12 h-12
                      rounded-full 
                      bg-accent 
                      flex items-center justify-center
                      text-2xl text-white cursor-pointer lg:hidden"
           onClick={() => 
           menuSelect===1 ? selectRef.current?.showModal() : optionRef.current?.showModal()}>
        +
      </div>
    
      <div className="p-10">
      <div className="flex gap-10 justify-center text-2xl">
      {/* Side Bar */}
          < Sidebar />
          
      {/* Content */}
          <div className="flex-3/4 shadow-lg rounded-box p-5 lg:p-10 bg-white justify-center">
          { loadingPage ? (
            <Skeleton />
          ) : (
            <>
              <div className="justify-between mb-5 items-center hidden lg:flex">
                <div className="text-md lg:text-2xl">{ menuSelect === 1 ? ("รายการอาหาร") : ("ตัวเลือกเสริม")}</div>
                <div className="flex gap-3">
                  { menuSelect === 1 ? (
                    <>  
                      <button className="btn btn-soft btn-accent rounded-full"
                        onClick={() => {
                          selectRef.current?.showModal();
                        }}>
                        + เพิ่มรายการอาหาร
                      </button>
                      <button className="btn btn-soft btn-success rounded-full"
                        onClick={() => setMenu(2)}>
                        ตัวเลือกเสริม
                      </button>
                    </>
                  ) : (
                    <>  
                      <button className="btn btn-soft btn-success rounded-full"
                        onClick={() => {
                          optionRef.current?.showModal();
                        }}>
                        + เพิ่มตัวเลือกเสริม
                      </button>
                      <button className="btn btn-soft btn-accent rounded-full"
                      onClick={() => setMenu(1)}>
                        รายการอาหาร
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-5 justify-center items-center flex-col lg:hidden">
                <div className="text-md lg:text-2xl text-center mb-5">{ menuSelect === 1 ? ("รายการอาหาร") : ("ตัวเลือกเสริม")}</div>
                <div role="tablist" className="tabs tabs-border justify-between">
                  <a role="tab" className={`tab ${ menuSelect === 1 && ("tab-active")}`} onClick={() => setMenu(1)}>รายการอาหาร</a>
                  <a role="tab" className={`tab ${ menuSelect === 2 && ("tab-active")}`} onClick={() => setMenu(2)}>ตัวเลือกเสริม</a>
                </div>
              </div>

              <div className="h-1 w-full bg-[#D9D9D9] hidden lg:block"></div>

              {/* Menu */}
              <div className="mt-5">

                { menuSelect === 1 ? (
                  genre.length === 0 ? (
                    <div className="text-xl text-center mt-5">ยังไม่มีรายการอาหาร</div>
                  ) : (
                    genre.map((genre: Genre, index: number) => (
                      <div key={genre.fGenreID}>
                        <label className="w-full rounded-box items-center bg-accent-content flex justify-between p-3 text-black mb-5 hover:cursor-pointer">
                          <h1 className="text-sm lg:text-lg">{genre.fGenreName}</h1>
                          <div className="flex gap-3 items-center">
                            <button
                              className={`transition-transform ${
                                openToggle[genre.fGenreID] ? "rotate-180" : ""
                              }`}
                              onClick={() =>
                                setOpenToggle(prev => ({
                                  ...prev,
                                  [genre.fGenreID]: !prev[genre.fGenreID],
                                }))
                              }
                            >
                              <svg width="26" height="31" viewBox="0 0 26 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.5 11.625L13 19.375L19.5 11.625" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button>
                              <i className="far hover:cursor-pointer" onClick={() => deleteGenre(genre.fGenreID, genre.fGenreName)}>&#xf2ed;</i>
                            </button>
                          </div>
                        </label>
                        {openToggle[genre.fGenreID] && (
                          foods.filter((food: Food) => food.foodGenreID === genre.fGenreID).length === 0 ? (
                            <div className="w-full rounded-box items-center bg-[#EDEDEDF0] flex justify-center p-10 text-black mb-5">
                              <h1 className="text-sm lg:text-lg">ยังไม่มีรายการอาหาร</h1>
                            </div>
                          ) : (
                            foods.filter((food: Food) => food.foodGenreID === genre.fGenreID).map((food: Food) => (
                              <div className="w-full rounded-box items-center bg-[#EDEDEDF0] flex justify-between p-3 text-black mb-5" key={food.foodID}>
                                <div className="flex items-center gap-3">
                                  {food.foodPic !== "" && (
                                    <div className="avatar">
                                      <div className="w-15 lg:w-30 rounded">
                                        <img src={food.foodPic} alt="Food" />
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex-col items-center">
                                    <h1 className="text-sm lg:text-lg truncate">{food.foodName}</h1>
                                    <button type="button" className="btn btn-warning btn-sm lg:btn-md rounded-full mt-2" onClick={() => setSelectFood(food.foodID)}>แก้ไขข้อมูล</button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-end">
                                  <input
                                    type="checkbox"
                                    onChange={() => toggleStatus(food.foodID)}
                                    checked={
                                      status.find(s => s.foodID === food.foodID)?.status ?? false
                                    }
                                    className="toggle toggle-lg border-brown-600 bg-brown-500 checked:border-green-500 checked:bg-green-400 checked:text-green-800 mr-2"
                                    disabled = {isUpdating}
                                  />
                                </div>
                              </div>
                            ))
                          )
                        )}
                      </div>
                    ))
                  )
                ) : (
                  optionData.length === 0 ? (
                    <div className="text-xl text-center mt-5">ยังไม่มีตัวเลือกเสริม</div>
                  ) : (
                    optionData.map((option: OptionData, index: number) => (
                      <div key={option.ogID}>
                        <label className="w-full rounded-box items-center bg-accent-content flex justify-between p-3 text-black mb-5 hover:cursor-pointer">
                          <div>
                            <h1 className="text-sm lg:text-lg">{option.ogName}</h1>
                            <p className="text-sm">ใช้กับ {option.ogFood} รายการ</p>
                          </div>
                          <div className="flex gap-3 items-center">
                            <button
                              className={`transition-transform ${
                                openToggle2[option.ogID] ? "rotate-180" : ""
                              }`}
                              onClick={() =>
                                setOpenToggle2(prev => ({
                                  ...prev,
                                  [option.ogID]: !prev[option.ogID],
                                }))
                              }
                            >
                              <svg width="26" height="31" viewBox="0 0 26 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.5 11.625L13 19.375L19.5 11.625" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="hover:cursor-pointer"
                                onClick={() => setSelectId(option.ogID)}>
                                    <path d="M10 2.50019H4.16667C3.72464 2.50019 3.30072 2.67578 2.98816 2.98834C2.67559 3.3009 2.5 3.72483 2.5 4.16686V15.8335C2.5 16.2756 2.67559 16.6995 2.98816 17.012C3.30072 17.3246 3.72464 17.5002 4.16667 17.5002H15.8333C16.2754 17.5002 16.6993 17.3246 17.0118 17.012C17.3244 16.6995 17.5 16.2756 17.5 15.8335V10.0002M15.3125 2.18769C15.644 1.85617 16.0937 1.66992 16.5625 1.66992C17.0313 1.66992 17.481 1.85617 17.8125 2.18769C18.144 2.51921 18.3303 2.96885 18.3303 3.43769C18.3303 3.90653 18.144 4.35617 17.8125 4.68769L10.3017 12.1994C10.1038 12.3971 9.85934 12.5418 9.59083 12.6202L7.19667 13.3202C7.12496 13.3411 7.04895 13.3424 6.97659 13.3238C6.90423 13.3053 6.83819 13.2676 6.78537 13.2148C6.73256 13.162 6.69491 13.096 6.67637 13.0236C6.65783 12.9512 6.65909 12.8752 6.68 12.8035L7.38 10.4094C7.45877 10.1411 7.60378 9.8969 7.80167 9.69936L15.3125 2.18769Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                          </div>
                        </label>
                        {openToggle2[option.ogID] && (
                          option.ogItem.length === 0 ? (
                            <div className="w-full rounded-box items-center bg-[#EDEDEDF0] flex justify-center p-10 text-black mb-5">
                              <h1 className="text-sm lg:text-lg">ยังไม่มีรายการอาหาร</h1>
                            </div>
                          ) : (
                            option.ogItem.map((op: Option) => (
                              <div className="w-full rounded-box items-center bg-[#EDEDEDF0] flex justify-between p-3 text-black mb-5" key={op.opID}>
                                <h1 className="text-sm lg:text-lg">{op.opName}</h1>
                                <div className="flex items-center gap-2 text-lg">
                                  ฿ {op.opPrice.toFixed(2)}
                                </div>
                              </div>
                            ))
                          )
                        )}
                      </div>
                    ))
                  )
                )}
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </>
);
}