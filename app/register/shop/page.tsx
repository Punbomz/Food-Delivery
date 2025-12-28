"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AlertModal from "@/app/components/AlertModal";
import { useAlertModal } from "@/app/hooks/useAlertModal";

export default function shopRegister() {
  const router = useRouter();
  const { isOpen, message, navigateTo, showAlert, closeAlert } = useAlertModal();

  const [pass, setPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [passLengthValid, setPassLengthValid] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

  useEffect(() => {
    return () => {
      if (qrPreview) URL.revokeObjectURL(qrPreview);
    };
  }, [qrPreview]);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const pass = formData.get("Pass") as string;
    const passConfirm = formData.get("PassConfirm") as string;

    if (pass !== passConfirm) {
      showAlert("รหัสผ่านไม่ตรงกัน!");
      return;
    }

    const res = await fetch("/api/register/shop", {
      method: "POST",
      body: formData,
    });

    if (res.status === 409) {
      const data = await res.json();
      showAlert(data.message);
    } else if (res.ok) {
      showAlert("สมัครสมาชิกสำเร็จ!", "/login/shop");
    } else {
      showAlert("เกิดข้อผิดพลาดในการสมัครสมาชิก! กรุณาลองใหม่อีกครั้ง");
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

          {/* Register Card */}
          <div className="flex w-full max-w-xl items-center justify-center">
            <form className="justify-center" onSubmit={handleRegister}>
              <fieldset className="fieldset bg-base-200 border-base-300 rounded-box md:w-2xl sm:w-2xl border p-10 shadow-md">
              
              <h1 className="text-2xl font-Inter text-black mx-auto text-center">
                สมัครสมาชิกร้านค้า
              </h1>

              {/* Profile & QR Code */}
              <div className="block lg:flex lg:gap-5 justify-between">
                <div className="flex-1/2 text-center mt-3">
                  {profilePreview && (
                    <div className="avatar m-3">
                      <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                        <img src={profilePreview} alt="profile"/>
                      </div>
                    </div>
                  )}
                  <label className="block text-sm text-black mb-1">
                    รูปโปรไฟล์
                  </label>
                  <div>  
                    <input name="Pic" type="file" accept="image/*" className="file-input w-xs"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setProfilePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1/2 text-center mt-3">
                  {qrPreview && (
                    <div className="avatar m-3">
                      <div className="w-24 rounded">
                        <img src={qrPreview} alt="QR Code" />
                      </div>
                    </div>
                  )}
                  <label className="block text-sm text-black mb-1">
                    คิวอาร์โค้ดรับเงิน <p className="text-red-500 inline">*</p>
                  </label>
                  <div>  
                    <input name="QR" type="file" accept="image/*" className="file-input w-xs" required
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setQrPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="block lg:flex lg:gap-5 justify-between">
                <div className="flex-1/2">
                  {/*  Name */}
                  <label className="block text-sm text-black mb-1 mt-5">
                    ชื่อร้าน <p className="text-red-500 inline">*</p>
                  </label>
                  <div>
                    <input name="Name" type="text" className="input w-full" placeholder="ระบุชื่อร้าน" required />
                  </div>
                </div>

                <div className="flex-1/2">
                  {/* Location */}
                  <label className="block text-sm text-black mb-1 mt-5">
                    สถานที่ตั้ง <p className="text-red-500 inline">*</p>
                  </label>
                  <select
                    name="Location"
                    className="w-full select"
                    required
                    defaultValue={"ตึก 80"}
                  >
                    <option value="ตึก 80">ตึก 80</option>
                    <option value="บพิตรพิมุข">บพิตรพิมุข</option>
                  </select>
                </div>
              </div>

              <div className="block lg:flex lg:gap-5 justify-between">
                <div className="flex-1/2">
                  {/* First Name */}
                  <label className="block text-sm text-black mb-1 mt-5">
                    ชื่อ <p className="text-red-500 inline">*</p>
                  </label>
                  <input name="Fname" type="text" className="input w-full" placeholder="ระบุชื่อ" required />
                </div>

                <div className="flex-1/2">
                  {/* Last Name */}
                  <label className="block text-sm text-black mb-1 mt-5">
                    นามสกุล <p className="text-red-500 inline">*</p>
                  </label>
                  <input name="Lname" type="text" className="input w-full" placeholder="ระบุนามสกุล" required />
                </div>

                <div className="flex-1/3">
                  {/* Gender */}
                  <label className="block text-sm text-black mb-1 mt-5">
                    เพศ <p className="text-red-500 inline">*</p>
                  </label>
                  <select
                    name="Gender" className="w-full select hidden lg:block"
                    required
                    defaultValue={"Male"}
                  >
                    <option value="Male">ชาย</option>
                    <option value="Female">หญิง</option>
                  </select>

                  <div className="flex lg:hidden gap-5">
                    <label className="mr-4">
                      <input type="radio" className="radio" name="Gender" value="Male" defaultChecked /> ชาย
                    </label>
                    <label>
                      <input type="radio" className="radio" name="Gender" value="Female " /> หญิง
                    </label>
                  </div>
                </div>
              </div>

              <div className="block lg:flex lg:gap-5 justify-between">
                <div className="lg:w-1/2">
                  {/* Email */}
                  <label className="block text-sm text-black mb-1 mt-5">
                    Email <p className="text-red-500 inline">*</p>
                  </label>
                  <input name="Email" type="email" className="input w-full" placeholder="ระบุอีเมล" required />
                </div>

                <div className="lg:w-1/2">
                  {/* Tel */}
                  <label className="block text-sm text-black mb-1 mt-5">
                    เบอร์โทร <p className="text-red-500 inline">*</p>
                  </label>
                  <input name="Phone" type="tel" className="input w-full" placeholder="ระบุเบอร์โทรศัพท์ (ไม่มี - )" required pattern="[0-9]{10}"/>
                </div>
              </div>

              {/* Password */}
              <label className="block text-sm text-black mb-1 mt-5">
                รหัสผ่าน <p className="text-red-500 inline">*</p>
              </label>
              <input name="Pass" type="password" className="input w-full" placeholder="ระบุรหัสผ่าน" required minLength={8}
                onChange={(e) => {
                  setPass(e.target.value);
                  setPassLengthValid(e.target.value.length >= 8);
                }}
                value={pass}/>
              {!passLengthValid && (<div className="text-red-500 text-sm mb-3">รหัสผ่านต้องมีจำนวนขั้นต่ำ 8 ตัวอักษร</div>)}

              {/* Confirm Password */}
              <label className="block text-sm text-black mb-1 mt-5">
                ยืนยันรหัสผ่าน <p className="text-red-500 inline">*</p>
              </label>
              <input name="PassConfirm" type="password" className="input w-full" placeholder="ยืนยันรหัสผ่าน" required minLength={8}
                onChange={(e) => setPassConfirm(e.target.value)}
                value={passConfirm}/>
                {pass !== passConfirm && (<div className="text-red-500 text-sm mb-3">รหัสผ่านไม่ตรงกัน</div>)}

              {/* Register Button */}
              <div className="flex justify-center items-center w-xs mx-auto mt-5">
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
                  value="ยืนยันการสมัคร"
                />
              )}
              </div>
              
              {/* Footer Links */}
              <div className="flex justify-center gap-5 text-sm p-5 w-xs mx-auto">
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
    </>
  );
}
