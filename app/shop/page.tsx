"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "../components/sidebar"
import { useRouter } from "next/navigation";
import AlertModal from "../components/AlertModal";
import { useAlertModal } from "../hooks/useAlertModal";
import ConfirmModal from '../components/ConfirmModal';
import { useConfirmModal } from "../hooks/useConfirmModal";

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

export default function shopProfile() {
  const router = useRouter();
  const { isOpen, message, navigateTo, showAlert, closeAlert } = useAlertModal();

  const { 
        isOpen: isConfirmOpen, 
        message: confirmMessage,
        title: confirmTitle,
        confirmText,
        cancelText,
        showConfirm, 
        handleConfirm, 
        handleCancel 
    } = useConfirmModal();
  
  const [shopID, setID] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setEdit] = useState(false);
  const [status, setStatus] = useState(false);
  const [isUpdating, setUpdate] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);

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
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const [openHour, openMin] = data.user.shopOpenTime.split(':').map(Number);
        const openTime = openHour * 60 + openMin;
        
        const [closeHour, closeMin] = data.user.shopCloseTime.split(':').map(Number);
        const closeTime = closeHour * 60 + closeMin;
        
        if (currentTime >= openTime && currentTime <= closeTime && data.user.shopOpen) {
          setStatus(true);
        } else {
          setStatus(false);
        }
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
      showAlert("ดำเนินการล้มเหลว! โปรดลองอีกครั้ง");
    }
    return;
  }

  async function handleEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    formData.append("id", shopID?.toString() || "");
    formData.append("oldEmail", user?.shopEmail || "");

    showConfirm(
      "ยืนยันการบันทึก?",
      async () => {
        setLoading(true);

        const res = await fetch("/api/shop/edit", {
          method: "POST",
          body: formData,
        });

        if (res.status === 409) {
          const data = await res.json();
          showAlert(data.message);
          setLoading(false);
        } else if (res.ok) {
          setEdit(false);
          setLoading(false);
          await getData();
          showAlert("บันทึกข้อมูลสำเร็จ!", "/shop");
        } else {
          showAlert("เกิดข้อผิดพลาดในการบันทึกข้อมูล! กรุณาลองใหม่อีกครั้ง");
          setLoading(false);
        }
      }
    );
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        message={message}
        navigateTo={navigateTo}
        onClose={closeAlert}
      />

      <ConfirmModal
          isOpen={isConfirmOpen}
          title={confirmTitle}
          message={confirmMessage}
          confirmText={confirmText}
          cancelText={cancelText}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
      />
    
      <div className="p-15">
      <div className="flex gap-10 justify-center text-2xl">
      {/* Side Bar */}
          < Sidebar />
          
      {/* Content */}
          <div className="flex-3/4 shadow-lg rounded-box p-20 bg-white justify-center">
          {/* Profile */}
          <form onSubmit={handleEdit}>
            <div className="lg:flex">
              <div className="flex-1/3 justify-center">
                <div className="mt-2 flex items-center justify-center">
                  <div className="justify-center text-center">
                    { !isEditing ? (
                      <div className="avatar">
                        <div className="w-50 rounded">
                          <img src={ user?.shopPic !== "" ? (user?.shopPic) : ("/profile.jpg")} alt="Profile" />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar">
                        <div className="w-50 rounded">
                          <img src={profilePreview || user?.shopPic} alt="prfile"/>
                        </div>
                      </div>
                    )}
                    { isEditing && (
                      <div className="mt-2 flex items-center justify-center">
                        <input onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setProfilePreview(URL.createObjectURL(file));
                          }
                        }}
                        name="Pic" type="file" className="file-input"  />
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
                  { !isEditing ? (
                    <div className="avatar">
                      <div className="w-50 rounded">
                        <img src={ user?.shopQR !== "" ? (user?.shopQR) : ("")} alt="QR Code" />
                      </div>
                    </div>
                  ) : (
                    <div className="avatar">
                      <div className="w-50 rounded">
                        <img src={qrPreview || user?.shopQR} alt="QR Code" />
                      </div>
                    </div>
                  )}
                </div>
                { isEditing && (
                  <div className="mt-5 flex items-center justify-center">
                    <input onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setQrPreview(URL.createObjectURL(file));
                        }
                      }}
                      name="QR" type="file" className="file-input" />
                  </div>
                )}
                <div className="mt-10 items-center justify-center">
                  <Link href="shop/changepass" className="mt-2 flex items-center justify-center underline text-lg">แก้ไขรหัสผ่าน</Link>
                  <Link href="shop/history" className="mt-2 flex items-center justify-center underline text-lg">ประวัติการใช้งาน</Link>
                </div>
                <div className="mt-10 flex items-center justify-center gap-2">
                  <i className='far'>&#xf017;</i>
                  <span className="text-sm lg:text-xl">เปิดตั้งแต่</span>
                  <input name="Open" defaultValue={user?.shopOpenTime || ""} type="time" className="input w-25 text-center" required disabled={!isEditing} />
                  <span className="text-sm lg:text-xl"> - </span>
                  <input name="Close" defaultValue={user?.shopCloseTime || ""} type="time" className="input w-25 text-center" required disabled={!isEditing} />
                </div>
              </div>

              <div className="flex-2/3">
                <div className="mt-2 flex items-center justify-center">
                  <fieldset className="fieldset w-full">
                    <div className="space-y-2 w-xs mx-auto">
                      <legend className="fieldset-legend">ชื่อ - นามสกุล</legend>
                      <div className="flex gap-2">
                        <input name="Fname" defaultValue={user?.shopFname || ""} type="text" className="input w-1/2" placeholder="ระบุชื่อ" required disabled={!isEditing} />
                        <input name="Lname" defaultValue={user?.shopLname || ""} type="text" className="input w-1/2" placeholder="ระบุนามสกุล" required disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="space-y-2 w-xs mx-auto">
                      <legend className="fieldset-legend">ชื่อร้าน</legend>
                      <div>
                        <input name="Name" defaultValue={user?.shopName || ""} type="text" className="input w-full" placeholder="ระบุชื่อร้าน" required disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="space-y-2 w-xs mx-auto">
                      <legend className="fieldset-legend">เบอร์โทร</legend>
                      <div>
                        <input name="Phone" defaultValue={user?.shopPhone || ""} type="tel" className="input w-full" placeholder="ระบุเบอร์โทร" required disabled={!isEditing} pattern="[0-9]{10}" />
                      </div>
                    </div>
                    <div className="space-y-2 w-xs mx-auto">
                      <legend className="fieldset-legend">อีเมล</legend>
                      <div>
                        <input name="Email" defaultValue={user?.shopEmail || ""} type="email" className="input w-full" placeholder="ระบุอีเมล" required disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="space-y-2 w-xs mx-auto">
                      <legend className="fieldset-legend">สถานที่</legend>
                      <div>
                        <select name="Location" className="select w-full" required disabled={!isEditing} defaultValue={user?.shopLocation || "ตึก 80"}>
                          <option value="ตึก 80">ตึก 80</option>
                          <option value="บพิตรพิมุข">บพิตรพิมุข</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2 w-xs mx-auto text-center flex justify-center gap-10 mt-5">
                      {!isEditing ? (
                        <button type="button" onClick={() => setEdit(true)} className="btn btn-accent">แก้ไขข้อมูล</button>
                      ) : (
                        <>
                          { !isLoading ? (
                            <>
                              <input type="submit" className="btn btn-green" value={"บันทึก"}/>
                              <button type="button" onClick={() => setEdit(false)} className="btn btn-error">ยกเลิก</button>
                            </>
                          ) : (
                            <>
                              <button type="button" className="btn btn-green">
                                <span className="loading loading-spinner loading-sm"></span>
                              </button>
                              <button type="button" className="btn btn-error">ยกเลิก</button>
                            </>
                          )}
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