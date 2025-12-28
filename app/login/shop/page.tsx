"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AlertModal from "@/app/components/AlertModal";
import { useAlertModal } from "@/app/hooks/useAlertModal";

export default function shopLogin() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const { isOpen, message, navigateTo, showAlert, closeAlert } = useAlertModal();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/login/shop", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      showAlert("เข้าสู่ระบบสำเร็จ!", "/shop");
    } else {
      showAlert("อีเมลหรือรหัสผ่านไม่ถูกต้อง!");
    }
    setLoading(false);
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        message={message}
        navigateTo={navigateTo}
        onClose={closeAlert}
      />

      <div className="min-h-screen flex flex-col align-middle p-30">

        {/* Logo */}
        <div className="w-full h-25 flex justify-center">
          <img
            src="/RMUTK_Logo.png"
            className="h-20 w-auto max-w-full"
            alt="RMUTK Logo"
          />
        </div>

        {/* Gray Middle Section */}
        <div className="w-full flex p-10 justify-center">

          {/* Login Card */}
          <div className="flex w-full max-w-xl items-center justify-center">
            <form className="justify-center" onSubmit={handleLogin}>
              <fieldset className="fieldset bg-base-200 border-base-300 rounded-box md:w-xl sm:w-2xl border p-10 shadow-md">
              
              <h1 className="text-2xl font-Inter text-black mx-auto text-center">
                เข้าสู่ระบบร้านค้า
              </h1>

              <div className="space-y-2 w-xs mx-auto">
                <label className="label">Email</label>
                <div>
                  <input name="Email" type="email" className="input w-full" placeholder="Email" required />
                </div>

                <label className="label">Password</label>
                <div>
                  <input name="Pass" type="password" className="input  w-full" placeholder="Password" required/>
                </div>

                <label className="label">
                  <input name="Remember" type="checkbox" defaultChecked className="checkbox" />
                  Remember me
                </label>
              </div>

              <div className="flex justify-center items-center w-xs mx-auto">
                { isLoading ? (
                  <button
                  type="button"
                    className="
                      btn
                      btn-success
                      rounded-full
                      text-base
                      font-Inter
                      block
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
                      btn
                      btn-success
                      rounded-full
                      text-base
                      font-Inter
                      block
                      hover:bg-[#19a95b]
                      active:scale-95
                      transition
                    "
                    value="เข้าสู่ระบบ"
                  />
                )}
              </div>
              
              {/* Footer Links */}
              <div className="flex justify-between text-sm p-5 w-xs mx-auto">
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
    </>
  );
}
