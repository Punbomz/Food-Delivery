"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar  } from "../../components/sidebar";

interface User {
    shopID: number;
    shopFname: string;
    shopLname: string;
    shopGender: string;
    shopEmail: string;
    shopPhone: string;
    shopName: string;
    shopLocation: string;
    shopPic: string;
    shopQR: string;
    shopOpenTime: string;
    shopCloseTime: string;
    shopOpen: boolean;
    [key: string]: any;
}

export default function shopMenu() {
  const [shopID, setID] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setEdit] = useState(false);
  const [status, setStatus] = useState(false);
  const [isUpdating, setUpdate] = useState(false);

  useEffect(() => {
      checkAuth();
  }, []);

  useEffect(() => {
    if (!shopID) return;
    getData();
  }, [shopID]);

  useEffect(() => {
    checkAuth();
    setUpdate(false);
  }, [status]);

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
    try {
      const res = await fetch("/api/getdata/shop/profile", {
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
        setUser(data.user);
        setStatus(data.user.shopOpen);
      }
    } catch(error) {
      console.error("Fetch user data failed:", error);
    }
  }

  const toggleStatus = async () => {
    setUpdate(true);
    try {
      const res = await fetch("/api/shop/toggleStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: shopID,
          status: !status,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setStatus(!status);
      }
    } catch(error) {
      alert("ดำเนินการล้มเหลว! โปรดลองอีกครั้ง");
    }
    return;
  }

  const handleEdit = async () => {

  }

  return (
    <>
    
      <div className="p-15">
      <div className="flex gap-10 justify-center text-2xl">
      {/* Side Bar */}
          < Sidebar />
          
      {/* Content */}
          <div className="flex-3/4 shadow-lg rounded-box p-20 bg-white justify-center">
          {/* Profile */}
          <form>
            <div className="lg:flex">
              <div className="flex-1/3 justify-center">
                <div className="mt-2 flex items-center justify-center">
                  <div className="justify-center text-center">
                    <div className="avatar">
                      <div className="w-50 rounded">
                        <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
                      </div>
                    </div>
                    { isEditing && (
                      <div className="mt-2 flex items-center justify-center">
                        <input type="file" className="file-input" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-center">
                  <input
                    type="checkbox"
                    onChange={toggleStatus}
                    checked = {status}
                    className="toggle toggle-lg border-brown-600 bg-brown-500 checked:border-green-500 checked:bg-green-400 checked:text-green-800"
                    disabled = {isUpdating}
                  />
                  <span className="text-center ml-5 text-sm lg:text-xl">ร้านกำลัง{status ? ("เปิด") : ("ปิด")}</span>
                </div>

                <div className="mt-10 flex items-center justify-center">
                  <div className="avatar">
                    <div className="w-50 rounded">
                      <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-center">
                  <input type="file" className="file-input" />
                </div>
                <div className="mt-10 items-center justify-center">
                  <Link href="shop/changepass" className="mt-2 flex items-center justify-center underline text-lg">แก้ไขรหัสผ่าน</Link>
                  <Link href="shop/history" className="mt-2 flex items-center justify-center underline text-lg">ประวัติการใช้งาน</Link>
                </div>
                <div className="mt-10 flex items-center justify-center gap-3">
                  <i className='far'>&#xf017;</i>
                  <span className="text-sm lg:text-xl">เปิดตั้งแต่</span>
                  <input value={user?.shopOpenTime || ""} type="time" className="input w-20 text-center" required disabled={!isEditing} />
                  <span className="text-sm lg:text-xl"> - </span>
                  <input value={user?.shopCloseTime || ""} type="time" className="input w-20 text-center" required disabled={!isEditing} />
                </div>
              </div>

              <div className="flex-2/3">
                <div className="mt-2 flex items-center justify-center">
                  <fieldset className="fieldset w-full">
                    <div className="space-y-2 w-xs mx-auto">
                      <legend className="fieldset-legend">ชื่อ - นามสกุล</legend>
                      <div>
                        <input value={user?.shopFname + " " + user?.shopLname || ""} type="text" className="input w-full" placeholder="ระบุชื่อ - นามสกุล" required disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="space-y-2 w-xs mx-auto">
                      <legend className="fieldset-legend">ชื่อร้าน</legend>
                      <div>
                        <input value={user?.shopName || ""} type="text" className="input w-full" placeholder="ระบุชื่อร้าน" required disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="space-y-2 w-xs mx-auto">
                      <legend className="fieldset-legend">เบอร์โทร</legend>
                      <div>
                        <input value={user?.shopPhone || ""} type="tel" className="input w-full" placeholder="ระบุเบอร์โทร" required disabled={!isEditing} pattern="[0-9]{10}" />
                      </div>
                    </div>
                    <div className="space-y-2 w-xs mx-auto">
                      <legend className="fieldset-legend">อีเมล</legend>
                      <div>
                        <input value={user?.shopEmail || ""} type="email" className="input w-full" placeholder="ระบุอีเมล" required disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="space-y-2 w-xs mx-auto">
                      <legend className="fieldset-legend">สถานที่</legend>
                      <div>
                        <select className="input w-full" required disabled={!isEditing} defaultValue={user?.shopLocation || "ตึก 80"}>
                          <option value="ตึก 80">ตึก 80</option>
                          <option value="บพิตรพิมุข">บพิตรพิมุข</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2 w-xs mx-auto text-center flex justify-center gap-10 mt-5">
                      {!isEditing ? (
                        <button onClick={() => setEdit(true)} className="btn btn-accent">แก้ไขข้อมูล</button>
                      ) : (
                        <>
                          <button type="button" onClick={handleEdit} className="btn btn-green">บันทึก</button>
                          <button type="button" onClick={() => setEdit(false)} className="btn btn-error">ยกเลิก</button>
                        </>
                      )}
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
    </>
);
}