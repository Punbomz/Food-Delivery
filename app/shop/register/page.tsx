"use client";

import Link from "next/link";

export default function shopRegister() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Logo */}
      <div className="py-10 flex justify-center">
        <img
          src="/rmutk-logo.png"
          className="h-14 w-auto"
          alt="RMUTK Logo"
        />
      </div>

      {/* Gray Middle Section */}
      <div className="bg-[#E5E5E5] flex p-10 justify-center">

        {/* Register Card */}
        <div className="flex w-full max-w-3xl items-center">
          <form className="bg-[#DAFFE4] w-full rounded-xl p-10 shadow-sm"
            method="post"
            action="/api/shop/register"
          >
          <fieldset>
            
            <h1 className="text-2xl font-Inter text-black mb-6 text-center">
              สมัครสมาชิกร้านค้า
            </h1>

            {/* Profile */}
            <label className="block text-sm text-black mb-1">
              รูปโปรไฟล์
            </label>
            <input
              type="file"
              className="
                w-full
                h-[46px]
                bg-[#D9D9D9]
                border-0
                rounded-none
                mb-6
                px-3
                text-base
                font-Inter
                focus:outline-none
              "
              accept="image/*"
            />

            <div className="block lg:flex lg:gap-5 justify-between">
              <div className="lg:w-1/2">
                {/* Shop Name */}
                <label className="block text-sm text-black mb-1">
                  ชื่อร้าน <p className="text-red-500 inline">*</p>
                </label>
                <input
                  type="text"
                  className="
                    w-full
                    h-[46px]
                    bg-[#D9D9D9]
                    border-0
                    rounded-none
                    mb-5
                    px-3
                    text-base
                    font-Inter
                    focus:outline-none
                  "
                  required
                />
              </div>

              <div className="lg:w-1/2">
                {/* Location */}
                <label className="block text-sm text-black mb-1">
                  สถานที่ตั้ง <p className="text-red-500 inline">*</p>
                </label>
                <select
                  className="
                    w-full
                    h-[46px]
                    bg-[#D9D9D9]
                    border-0
                    rounded-none
                    mb-5
                    px-3
                    text-base
                    font-Inter
                    focus:outline-none
                  "
                  required
                  defaultValue={"1"}
                >
                  <option value="1">ตึก 80</option>
                  <option value="2">บพิตรพิมุข</option>
                </select>
              </div>
            </div>

            <div className="block lg:flex lg:gap-5 justify-between">
              <div className="lg:w-1/2">
                {/* First Name */}
                <label className="block text-sm text-black mb-1">
                  ชื่อ <p className="text-red-500 inline">*</p>
                </label>
                <input
                  type="text"
                  className="
                    w-full
                    h-[46px]
                    bg-[#D9D9D9]
                    border-0
                    rounded-none
                    mb-5
                    px-3
                    text-base
                    font-Inter
                    focus:outline-none
                  "
                  required
                />
              </div>

              <div className="lg:w-1/2">
                {/* Last Name */}
                <label className="block text-sm text-black mb-1">
                  นามสกุล <p className="text-red-500 inline">*</p>
                </label>
                <input
                  type="text"
                  className="
                    w-full
                    h-[46px]
                    bg-[#D9D9D9]
                    border-0
                    rounded-none
                    mb-5
                    px-3
                    text-base
                    font-Inter
                    focus:outline-none
                  "
                  required
                />
              </div>

              <div className="lg:w-1/3">
                {/* Gender */}
                <label className="block text-sm text-black mb-1">
                  เพศ <p className="text-red-500 inline">*</p>
                </label>
                <select
                  className="
                    hidden lg:block
                    w-full
                    h-[46px]
                    bg-[#D9D9D9]
                    border-0
                    rounded-none
                    mb-5
                    px-3
                    text-base
                    font-Inter
                    focus:outline-none
                  "
                  required
                  defaultValue={"Male"}
                >
                  <option value="Male">ชาย</option>
                  <option value="Female">หญิง</option>
                </select>

                <div className="lg:hidden mb-5">
                  <label className="mr-4">
                    <input type="radio" name="gender" value="Male" defaultChecked /> ชาย
                  </label>
                  <br />
                  <label>
                    <input type="radio" name="gender" value="Female " /> หญิง
                  </label>
                </div>
              </div>
            </div>

            <div className="block lg:flex lg:gap-5 justify-between">
              <div className="lg:w-1/2">
                {/* Email */}
                <label className="block text-sm text-black mb-1">
                  Email <p className="text-red-500 inline">*</p>
                </label>
                <input
                  type="email"
                  className="
                    w-full
                    h-[46px]
                    bg-[#D9D9D9]
                    border-0
                    rounded-none
                    mb-5
                    px-3
                    text-base
                    font-Inter
                    focus:outline-none
                  "
                  required
                />
              </div>

              <div className="lg:w-1/2">
                {/* Tel */}
                <label className="block text-sm text-black mb-1">
                  เบอร์โทร <p className="text-red-500 inline">*</p>
                </label>
                <input
                  type="tel"
                  className="
                    w-full
                    h-[46px]
                    bg-[#D9D9D9]
                    border-0
                    rounded-none
                    mb-5
                    px-3
                    text-base
                    font-Inter
                    focus:outline-none
                  "
                  required
                  pattern="[0-9]{10}"
                />
              </div>
            </div>

            {/* Password */}
            <label className="block text-sm text-black mb-1">
              รหัสผ่าน <p className="text-red-500 inline">*</p>
            </label>
            <input
              type="password"
              className="
                w-full
                h-[46px]
                bg-[#D9D9D9]
                border-0
                rounded-none
                mb-6
                px-3
                text-base
                font-Inter
                focus:outline-none
              "
              required
            />

            {/* Confirm Password */}
            <label className="block text-sm text-black mb-1">
              ยืนยันรหัสผ่าน <p className="text-red-500 inline">*</p>
            </label>
            <input
              type="password"
              className="
                w-full
                h-[46px]
                bg-[#D9D9D9]
                border-0
                rounded-none
                mb-6
                px-3
                text-base
                font-Inter
                focus:outline-none
              "
              required
            />

            {/* Register Button */}
            <input
              type="submit"
              className="
                w-3/5
                h-[44px]
                bg-[#1EC067]
                text-black
                rounded-full
                text-base
                font-Inter
                mx-auto
                block
                mb-6
                hover:bg-[#19a95b]
                active:scale-95
                transition
              "
              value="ยืนยันการสมัคร"
            />
            
            {/* Footer Links */}
            <div className="h-[6px] bg-[#D8D8D8] my-6 -mx-10"></div>
            <div className="flex justify-between text-sm">
              <p>มีบัญชีแล้ว?</p>
              <Link href="/shop/login" className="underline text-black hover:text-gray-600">
                เข้าสู่ระบบ
              </Link>
            </div>

            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
