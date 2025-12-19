"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type History = {
  shopHistoryID: number;
  shopLogin: string;
  shopLogout: string | null;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<History[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    fetch("/api/history/shop")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
      });
  }, []);

  // กรองข้อมูลตามวันที่เลือก
  const filteredHistory = selectedDate
    ? history.filter((item) => {
        const loginDate = new Date(item.shopLogin)
          .toISOString()
          .split("T")[0];
        return loginDate === selectedDate;
      })
    : history;

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 py-10">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-md p-6">

        {/* หัวข้อ */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-lg font-bold bg-green-200 px-4 py-1 rounded-md">
            ประวัติการใช้งาน
          </h1>
        </div>

        {/* ปฏิทินเลือกวัน */}
        <div className="text-center mb-6">
          <label className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full cursor-pointer">
            เลือกวันที่:
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent outline-none text-sm"
            />
          </label>
        </div>

        {/* ไม่มีข้อมูล */}
        {filteredHistory.length === 0 ? (
          <p className="text-center text-gray-500">
            ไม่มีข้อมูลการเข้าใช้งานในวันที่เลือก
          </p>
        ) : (
          <div className="space-y-6">
            {filteredHistory.map((item) => (
              <div key={item.shopHistoryID}>
                {/* วันที่ */}
                <p className="text-sm text-gray-700 mb-2">
                  {new Date(item.shopLogin).toLocaleDateString("th-TH", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {/* เข้า */}
                <div className="bg-gray-200 border rounded px-3 py-2 mb-2 text-sm">
                  เข้าใช้งานเวลา{" "}
                  {new Date(item.shopLogin).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                {/* ออก */}
                <div className="bg-gray-200 border rounded px-3 py-2 text-sm">
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
      </div>
    </div>
  );
}
