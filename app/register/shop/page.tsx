"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function shopRegister() {
  const router = useRouter();

  const [pass, setPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [passLengthValid, setPassLengthValid] = useState(true);
  const [isLoading, setLoading] = useState(false);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const pass = formData.get("Pass") as string;
    const passConfirm = formData.get("PassConfirm") as string;

    if (pass !== passConfirm) {
      alert("รหัสผ่านไม่ตรงกัน!");
      return;
    }

    const res = await fetch("/api/register/shop", {
      method: "POST",
      body: formData,
    });

    if (res.status === 409) {
      const data = await res.json();
      alert(data.message);
      return;
    }

    if (res.ok) {
      alert("สมัครสมาชิกสำเร็จ!");
      router.replace("/shop/login");
    } else {
      alert("เกิดข้อผิดพลาดในการสมัครสมาชิก! กรุณาลองใหม่อีกครั้ง");
    }
    setLoading(false);
  }

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
            onSubmit={handleRegister}
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
              name="Pic"
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
                {/*  Name */}
                <label className="block text-sm text-black mb-1">
                  ชื่อร้าน <p className="text-red-500 inline">*</p>
                </label>
                <input
                name ="Name"
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
                  name="Location"
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
                  defaultValue={"ตึก 80"}
                >
                  <option value="ตึก 80">ตึก 80</option>
                  <option value="บพิตรพิมุข">บพิตรพิมุข</option>
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
                  name="Fname"
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
                  name="Lname"
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
                  name="Gender"
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
                    <input type="radio" name="Gender" value="Male" defaultChecked /> ชาย
                  </label>
                  <br />
                  <label>
                    <input type="radio" name="Gender" value="Female " /> หญิง
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
                  name="Email"
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
                  name = "Phone"
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
              name="Pass"
              type="password"
              className="
                w-full
                h-[46px]
                bg-[#D9D9D9]
                border-0
                rounded-none
                mb-3
                px-3
                text-base
                font-Inter
                focus:outline-none
              "
              required
              minLength={8}
              onChange={(e) => {
                setPass(e.target.value);
                setPassLengthValid(e.target.value.length >= 8);
              }}
              value={pass}
            />
            {!passLengthValid && (<div className="text-red-500 text-sm mb-3">รหัสผ่านต้องมีจำนวนขั้นต่ำ 8 ตัวอักษร</div>)}

            {/* Confirm Password */}
            <label className="block text-sm text-black mb-1">
              ยืนยันรหัสผ่าน <p className="text-red-500 inline">*</p>
            </label>
            <input
              name="PassConfirm"
              type="password"
              className="
                w-full
                h-[46px]
                bg-[#D9D9D9]
                border-0
                rounded-none
                mb-3
                px-3
                text-base
                font-Inter
                focus:outline-none
              "
              required
              minLength={8}
              onChange={(e) => setPassConfirm(e.target.value)}
              value={passConfirm}
              />
              {pass !== passConfirm && (<div className="text-red-500 text-sm mb-3">รหัสผ่านไม่ตรงกัน</div>)}

            {/* Register Button */}
            { isLoading ? (
              <button
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
              >
              <span className="loading loading-spinner loading-sm"></span>
              </button>
            ) : (
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
            )}
            
            {/* Footer Links */}
            <div className="h-[6px] bg-[#D8D8D8] my-6 -mx-10"></div>
            <div className="flex justify-between text-sm">
              <p>มีบัญชีแล้ว?</p>
              <Link href="/login/shop" className="underline text-black hover:text-gray-600">
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
