"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ShopProfile = {
  shopName: string;
  shopFname: string;
  shopLname: string;
  shopEmail: string;
  shopPhone: string;
  shopLocation: string;
  shopOpenTime: string;
  shopCloseTime: string;
  isOpen: Boolean;
  shopPic?: string | null;
  shopQR?: string | null;
};

export default function ShopProfilePage() {
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/shop")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setProfile(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-6">
      <div className="w-full max-w-xl">

        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-10 shadow-md">

          {/* Title */}
          <h1 className="text-2xl font-Inter text-black text-center mb-6">
            {profile.shopName}
          </h1>

          {/* Shop Image + QR */}
          <div className="flex flex-col items-center gap-6 mb-8">

            {/* Shop Image */}
            <div className="w-40 h-40 rounded-xl overflow-hidden border bg-base-100 flex items-center justify-center">
              {profile.shopPic ? (
                <img
                  src={profile.shopPic}
                  alt="Shop Image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs opacity-50">ไม่มีรูปร้าน</span>
              )}
            </div>

            {/* QR Code */}
            <div className="text-center">
              <p className="text-sm opacity-70 mb-2">QR รับเงิน</p>
              <div className="w-40 h-40 rounded-xl overflow-hidden border bg-base-100 flex items-center justify-center">
                {profile.shopQR ? (
                  <img
                    src={profile.shopQR}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs opacity-50">ไม่มีรูป QR รับเงิน</span>
                )}
              </div>
            </div>

          </div>

          {/* Info */}
          <div className="space-y-4 w-xs mx-auto text-sm">

            <div>
              <label className="label opacity-70">ชื่อเจ้าของร้าน</label>
              <div className="input input-bordered w-full bg-base-100 cursor-default">
                {profile.shopFname} {profile.shopLname}
              </div>
            </div>

            <div>
              <label className="label opacity-70">ชื่อร้าน</label>
              <div className="input input-bordered w-full bg-base-100 cursor-default">
                {profile.shopName} 
              </div>
            </div>

            <div>
              <label className="label opacity-70">เบอร์โทรร้าน</label>
              <div className="input input-bordered w-full bg-base-100 cursor-default">
                {profile.shopPhone}
              </div>
            </div>

            <div>
              <label className="label opacity-70">E-mail</label>
              <div className="input input-bordered w-full bg-base-100 cursor-default">
                {profile.shopEmail}
              </div>
            </div>

            <div>
              <label className="label opacity-70">สถานที่ตั้ง</label>
              <div className="input input-bordered w-full bg-base-100 cursor-default">
                {profile.shopLocation}
              </div>
            </div>

            <div>
              <label className="label opacity-70">เวลาเปิดทำการ</label>
              <div className="input input-bordered w-full bg-base-100 cursor-default">
                เปิด {profile.shopOpenTime} – {profile.shopCloseTime}
              </div>
            </div>

            {/* Shop Status */}
            <div className="flex items-center justify-between mt-4">
              <span className="opacity-70">สถานะร้าน</span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium ${
                    profile.isOpen ? "text-success" : "text-error"
                  }`}
                >
                  {profile.isOpen ? "เปิดร้าน" : "ปิดร้าน"}
                </span>
                <input
                  type="checkbox"
                  checked={profile.isOpen}
                  readOnly
                  className="toggle toggle-success"
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-between text-sm p-5 w-xs mx-auto">
            <Link
              href="/shop/history"
              className="underline text-black hover:text-gray-600">
              ประวัติการใช้งาน
            </Link>

            <Link
              href="/editProfile/shop"
              className="underline text-black hover:text-gray-600">
              แก้ไขข้อมูล
            </Link>
          </div>

        </fieldset>

      </div>
    </div>
  );
}
