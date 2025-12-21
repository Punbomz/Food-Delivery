"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "../../components/sidebar"
import Skeleton from "@/app/components/Skeleton";

type History = {
  shopHistoryID: number;
  shopLogin: string;
  shopLogout: string | null;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<History[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    fetch("/api/history/shop")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
      });
    setLoadingPage(false);
  }, []);

  useEffect(() => {
    setMaxPage(Math.ceil(filteredHistory.length/10));
  }, [history]);

  const filteredHistory = selectedDate
    ? history.filter((item) => {
        const loginDate = new Date(item.shopLogin)
          .toISOString()
          .split("T")[0];
        return loginDate === selectedDate;
      })
    : history;

  return (
    <>
      <div className="p-15">
      <div className="flex gap-10 justify-center text-2xl">
      {/* Side Bar */}
          < Sidebar />
          
      {/* Content */}
      <div className="flex-3/4 shadow-lg rounded-box p-20 bg-white justify-center">

        { loadingPage ? (
          <Skeleton />
        ) : (
          <>
            <div className="flex w-sm lg:w-lg items-center justify-center gap-2 mx-auto mb-4 bg-green-200 rounded-md p-4">
              <div className="btn btn-ghost" onClick={ () => page > 1 ? setPage(page-1) : setPage(1)}>
                <svg width="32" height="35" viewBox="0 0 32 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1240_785)">
                  <path d="M5.58692 14.6934C5.20072 14.9309 4.87559 15.2788 4.6441 15.7021C4.4126 16.1254 4.28286 16.6094 4.26786 17.1055C4.25286 17.6016 4.35313 18.0926 4.55863 18.5291C4.76413 18.9656 5.06765 19.3325 5.4388 19.5929L22.5883 31.4498C22.9605 31.7098 23.3872 31.8536 23.8256 31.867C24.2641 31.8804 24.6987 31.7628 25.0861 31.5261C25.4734 31.2893 25.7996 30.9418 26.0322 30.5183C26.2647 30.0948 26.3952 29.6103 26.4107 29.1134L27.0956 6.45713C27.1102 5.96024 27.0092 5.46874 26.8027 5.03198C26.5962 4.59523 26.2915 4.22859 25.9192 3.96889C25.5469 3.70919 25.1201 3.56556 24.6817 3.55243C24.2432 3.5393 23.8086 3.65714 23.4214 3.8941L5.58692 14.6934Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_1240_785">
                  <rect width="34" height="30" fill="white" transform="translate(0 33.9845) rotate(-88.2683)"/>
                  </clipPath>
                  </defs>
                </svg>
              </div>
              <h1 className="text-sm lg:text-lg font-bold px-4 py-1">
                ประวัติการใช้งาน
              </h1>
              <div className="btn btn-ghost" onClick={ () => page < maxPage ? setPage(page+1) : setPage(page)}>
                <svg width="31" height="35" viewBox="0 0 31 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1240_787)">
                  <path d="M25.1572 19.7221C25.5387 19.4772 25.8571 19.1232 26.0803 18.6955C26.3036 18.2677 26.424 17.7814 26.4294 17.285C26.4348 16.7887 26.3251 16.2998 26.1112 15.8673C25.8973 15.4348 25.5867 15.0739 25.2106 14.8208L7.83528 3.29724C7.45815 3.04456 7.02873 2.90895 6.59014 2.90404C6.15154 2.89913 5.7192 3.02508 5.33655 3.26926C4.95389 3.51343 4.63437 3.86723 4.41009 4.29513C4.1858 4.72302 4.06464 5.20996 4.05877 5.70703L3.81156 28.3723C3.80659 28.8694 3.9171 29.3589 4.132 29.7916C4.3469 30.2243 4.65862 30.5849 5.03586 30.8374C5.4131 31.0899 5.84259 31.2252 6.28119 31.2299C6.71979 31.2345 7.15206 31.1083 7.53461 30.8639L25.1572 19.7221Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_1240_787">
                  <rect width="34" height="30" fill="white" transform="translate(30.369 0.32719) rotate(90.6249)"/>
                  </clipPath>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="text-center mb-6">
              <label className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-200 p-3 rounded cursor-pointer">
                เลือกวันที่:
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent outline-none text-sm"
                />
              </label>
            </div>

            <div className="text-right">
              <p className="text-sm mb-2 w-sm lg:w-lg mx-auto">หน้าที่ {page} จาก { maxPage }</p>
            </div>

            {filteredHistory.length === 0 ? (
              <p className="text-center text-gray-500">
                ไม่มีข้อมูลการเข้าใช้งานในวันที่เลือก
              </p>
            ) : (
              <div className="space-y-6">
                {filteredHistory
                  .slice((page - 1) * 10, page * 10)
                  .map((item) => (
                    <div key={item.shopHistoryID}>
                      <p className="text-sm mb-2 w-sm lg:w-lg mx-auto">
                        {new Date(item.shopLogin).toLocaleDateString("th-TH", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>

                      <div className="bg-base-300 border rounded px-3 py-2 mb-2 w-sm lg:w-lg mx-auto text-sm">
                        เข้าใช้งานเวลา{" "}
                        {new Date(item.shopLogin).toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      <div className="bg-base-300 border rounded px-3 py-2 w-sm lg:w-lg mx-auto text-sm">
                        {item.shopLogout
                          ? `ออกจากระบบเวลา ${new Date(
                              item.shopLogout
                            ).toLocaleTimeString("th-TH", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "ยังไม่ออกจากระบบ"}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

      </div>
      </div>
    </div>
    </>
  );
}
