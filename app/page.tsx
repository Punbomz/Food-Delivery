"use client";

import { useState, useRef, useEffect } from "react";
import Skeleton2 from "./components/Skeleton2";
import AlertModal from "@/app/components/AlertModal";
import { useAlertModal } from "@/app/hooks/useAlertModal";

interface Shop {
  shopID: number;
  shopPic: string;
  shopName: string;
  shopDetail: string;
  shopLocation: string;
  shopOpen: boolean;
  shopOpenTime: string;
  shopCloseTime: string;
  [key: string]: any;
}

export default function TestPage() {
  const [cafeterias, setCafeterias] = useState("");
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const { isOpen, message, navigateTo, showAlert, closeAlert } = useAlertModal();

  const [shop, setShop] = useState<Shop | null>(null);

  useEffect(() => {
    getData();
  }, [])
  
  useEffect(() => {
    // Reset scroll position when cafeterias change
    if (scrollRef1.current) {
      scrollRef1.current.scrollLeft = 0;
    }
    if (scrollRef2.current) {
      scrollRef2.current.scrollLeft = 0;
    }
  }, [cafeterias]);

  const scrollLeft1 = () => {
    scrollRef1.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight1 = () => {
    scrollRef1.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const scrollLeft2 = () => {
    scrollRef2.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight2 = () => {
    scrollRef2.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const getData = async () => {
    try {
      const res = await fetch("/api/getdata/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setShop(data);
        setLoadingPage(false);
      }
    } catch(error) {
      showAlert("Fetch user data failed");
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

      { loadingPage ? (
        <Skeleton2 />
      ) : (
        <>
          <div className="p-10">
            { /* Desktop */ }
            <div className="hidden lg:block justify-center items-center">

              <div className="justify-between items-center mt-5">
                <h1 className="text-3xl font-bold text-center">ร้านอาหาร ตึก 80</h1>
                <div className="flex items-center justify-center">

                  <button className="btn btn-circle btn-ghost" onClick={scrollLeft1}>❮</button>
                  
                  {/* Scrollable Container */}
                  <div
                    ref={scrollRef1}
                    className="flex gap-10 overflow-x-auto overflow-y-hidden m-5 p-5 scrollbar-hide"
                  >
                    
                    {/* Card */}
                    <div className="card bg-[#EAEAEA] w-64 flex-shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
                      <figure>
                        <img
                          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                          alt="เมนู" 
                          className="w-full h-48 object-cover"
                        />
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title">ร้านข้าวมันไก่</h2>
                        <p>คำแนะนำร้าน</p>
                        <div className="justify-center">
                          <div className="bg-[#DAFFE4] rounded-full p-2 mt-2 text-center font-bold">
                            สั่งเลย!
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  
                  <button className="btn btn-circle btn-ghost" onClick={scrollRight1}>❯</button>

                </div>
              </div>

              <div className="justify-between items-center mt-5">
                <h1 className="text-3xl font-bold text-center">ร้านอาหาร บพิตรพิมุข</h1>
                <div className="flex items-center justify-center">

                  <button className="btn btn-circle btn-ghost" onClick={scrollLeft1}>❮</button>
                  
                  {/* Scrollable Container */}
                  <div
                    ref={scrollRef1}
                    className="flex gap-10 overflow-x-auto overflow-y-hidden m-5 p-5 scrollbar-hide"
                  >
                    
                    {/* Card */}
                    <div className="card bg-[#EAEAEA] w-64 flex-shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
                      <figure>
                        <img
                          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                          alt="เมนู" 
                          className="w-full h-48 object-cover"
                        />
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title">ร้านข้าวมันไก่</h2>
                        <p>คำแนะนำร้าน</p>
                        <div className="justify-center">
                          <div className="bg-[#DAFFE4] rounded-full p-2 mt-2 text-center font-bold">
                            เริ่มต้น 35
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  
                  <button className="btn btn-circle btn-ghost" onClick={scrollRight1}>❯</button>

                </div>
              </div>

            </div>

            { /* Mobile */ }
              <div className="flex flex-col lg:hidden justify-center items-center">
                {cafeterias === "" &&
                  <div className="justify-center text-center">
                    <div className="bg-green-500 rounded-box p-5 text-white mx-auto">
                      <h1 className="text-2xl font-bold m-3">🥗 วันนี้กินอะไรดี</h1>
                      <h2 className="m-3">🍜 เลือกร้านอาหารที่อยากสั่งได้เลย!</h2>
                    </div>
                    
                    <div className="card bg-base-100 w-96 shadow-lg justify-center items-center mx-auto mt-5 hover:scale-105 transition-transform duration-300">
                      <figure className="px-10 pt-10">
                        <img
                          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                          alt="Shoes"
                          className="rounded-xl" />
                      </figure>
                      <div className="card-body items-center text-center">
                        <h2 className="card-title">โรงอาหาร ตึก 80</h2>
                        <div>
                          <p>ตึก 80 ชั้น 1</p>
                          <p>เวลาเปิด-ปิด: 07.00-14.00</p>
                          <p>เบอร์โทร: 099-999-999</p>
                        </div>
                        <div className="card-actions">
                          <button className="btn btn-success text-white w-40"
                          onClick={() => setCafeterias("ตึก 80")}
                          >เลือก</button>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-base-100 w-96 shadow-lg justify-center items-center mx-auto mt-5 hover:scale-105 transition-transform duration-300">
                      <figure className="px-10 pt-10">
                        <img
                          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                          alt="Shoes"
                          className="rounded-xl" />
                      </figure>
                      <div className="card-body items-center text-center">
                        <h2 className="card-title">โรงอาหาร บพิตรพิมุข</h2>
                        <div>
                          <p>ตึก 7 ชั้น 1</p>
                          <p>เวลาเปิด-ปิด: 07.00-14.00</p>
                          <p>เบอร์โทร: 099-999-999</p>
                        </div>
                        <div className="card-actions">
                          <button className="btn btn-success text-white w-40"
                          onClick={() => setCafeterias("บพิตรพิมุข")}
                          >เลือก</button>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                { cafeterias === "ตึก 80" &&
                  <div className="justify-center text-center">
                    
                    <div className="bg-base-500 border-2 border-green-600 rounded-box p-5">
                      <div className="flex justify-start">
                        <button className="btn btn-ghost" onClick={() => setCafeterias("")}>❮ กลับ</button>
                      </div>
                      <div className="z-0">
                        <h1 className="text-2xl font-bold m-3 text-green-500">โรงอาหาร ตึก 80</h1>
                        <h2 className="m-3 text-green-800">เลือกร้านอาหารที่คุณต้องการ</h2>
                      </div>
                    </div>
          
                    {/* Scrollable Container */}
                    <div className="flex flex-col items-center p-5 space-y-5">
                      
                      {/* Card */}
                      <div className="card bg-[#EAEAEA] w-70 flex-shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
                        <figure>
                          <img
                            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                            alt="เมนู" 
                            className="w-full h-48 object-cover"
                          />
                        </figure>
                        <div className="card-body">
                          <h2 className="card-title">ร้านข้าวมันไก่</h2>
                          <p>คำแนะนำร้าน</p>
                          <div className="justify-center">
                            <div className="bg-[#DAFFE4] rounded-full p-2 mt-2 text-center font-bold hover:scale-115 transition-transform duration-300">
                              สั่งเลย!
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                }
                
                { cafeterias === "บพิตรพิมุข" &&
                  <div className="justify-center text-center">
                    
                    <div className="bg-base-500 border-2 border-green-600 rounded-box p-5">
                      <div className="flex justify-start">
                        <button className="btn btn-ghost" onClick={() => setCafeterias("")}>❮ กลับ</button>
                      </div>
                      <h1 className="text-2xl font-bold m-3 text-green-500">โรงอาหาร บพิตรพิมุข</h1>
                      <h2 className="m-3 text-green-800">เลือกร้านอาหารที่คุณต้องการ</h2>
                    </div>
          
                    {/* Scrollable Container */}
                    <div className="flex flex-col items-center p-5 space-y-5">
                      
                      {/* Card */}
                      <div className="card bg-[#EAEAEA] w-70 flex-shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
                        <figure>
                          <img
                            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                            alt="เมนู" 
                            className="w-full h-48 object-cover"
                          />
                        </figure>
                        <div className="card-body">
                          <h2 className="card-title">ร้านข้าวมันไก่</h2>
                          <p>คำแนะนำร้าน</p>
                          <div className="justify-center">
                            <div className="bg-[#DAFFE4] rounded-full p-2 mt-2 text-center font-bold hover:scale-115 transition-transform duration-300">
                              สั่งเลย!
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                }
              </div>

          </div>
        </>
      )}
    </>
  );
}
