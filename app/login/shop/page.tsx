"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function shopLogin() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/login/shop", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("เข้าสู่ระบบสำเร็จ!");
      window.location.href = "/shop/profile";
    } else {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง!");
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

        {/* Login Card */}
        <div className="flex w-full max-w-xl items-center">
          <form className="bg-[#DAFFE4] w-full max-w-[540px] rounded-xl p-10 shadow-sm"
            onSubmit={handleLogin}>
            <fieldset>
            
            <h1 className="text-2xl font-Inter text-black mb-6 text-center">
              เข้าสู่ระบบ
            </h1>

            {/* Username */}
            <label className="block text-sm text-black mb-1">
              Email
            </label>
            <input
              type="email"
              name="Email"
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

            {/* Password */}
            <label className="block text-sm text-black mb-1">
              Password
            </label>
            <input
              type="password"
              name="Pass"
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
            />

            <fieldset className="fieldset w-64 mb-6">
              <label className="label">
                <input name="Remember" type="checkbox" defaultChecked className="checkbox" />
                Remember me
              </label>
            </fieldset>

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
                value="เข้าสู่ระบบ"
              />
            )}
            
            {/* Footer Links */}
            <div className="h-[6px] bg-[#D8D8D8] my-6 -mx-10"></div>
            <div className="flex justify-between text-sm">
              <Link href="/register/shop" className="underline text-black hover:text-gray-600">
                สมัครสมาชิก
              </Link>
              <Link href="#" className="underline text-black hover:text-gray-600">
                ลืมรหัสผ่าน
              </Link>
            </div>

            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
