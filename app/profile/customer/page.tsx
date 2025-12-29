"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "@/app/components/Skeleton";
import ConfirmModal from "@/app/components/ConfirmModal";
import { useConfirmModal } from "@/app/hooks/useConfirmModal";
import AlertModal from "@/app/components/AlertModal";
import { useAlertModal } from "@/app/hooks/useAlertModal";
import ResetPasswordModal from "@/app/components/ResetPasswordModal";

type Profile = {
  customerPic: string | null;
  customerFname: string;
  customerLname: string;
  customerEmail: string;
  customerPhone: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null)

  const { isOpen, message, navigateTo, showAlert, closeAlert } = useAlertModal();
  const [isResetPasswordOpen, setResetPasswordOpen] = useState(false);

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

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await fetch("/api/profile/customer", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setPreview(data.customerPic);
        setLoading(false);
      }
    } catch(error) {
      console.error("Fetch user data failed:", error);
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    formData.append("oldEmail", profile?.customerEmail || "");

    showConfirm(
      "ยืนยันการบันทึก?",
      async () => {
        setLoading(true);

        const res = await fetch("/api/customer/edit", {
          credentials: "include",
          method: "POST",
          body: formData,
        });

        if (res.status === 409) {
          const data = await res.json();
          showAlert(data.message);
          setLoading(false);
        } else if (res.ok) {
          setisEditing(false);
          setLoading(false);
          await getData();
          showAlert("บันทึกข้อมูลสำเร็จ!", "/profile/customer");
        } else {
          showAlert("เกิดข้อผิดพลาดในการบันทึกข้อมูล! กรุณาลองใหม่อีกครั้ง");
          setLoading(false);
        }
      }
    );
  }

  if (loading) {
    return (
      <div className="flex p-10">
        <Skeleton />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        onAlert={showAlert}
      />

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

      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="w-xs lg:w-3xl bg-base-200 border border-base-300 rounded-box shadow-lg p-5 lg:p-20">
          <form onSubmit={handleSave} className="flex flex-col items-center gap-5">
            {/* Profile Image */}
            <div className="avatar">
              <div className="ring ring-primary ring-offset-base-100 w-28 rounded-full ring-offset-2">
                {isEditing ? (
                  <>
                    {preview && (
                      <label className="cursor-pointer">
                        <img
                          src={preview}
                          alt="Profile"
                          width={112}
                          height={112}
                          className="object-cover rounded-full"
                        />
                        <input
                          type="file"
                          name="Pic"
                          accept="image/*"
                          className="file-input file-input-bordered w-full max-w-xs hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                    )}
                  </>
                ) : (
                  <img
                    src={profile.customerPic || "/avatar.png"}
                    alt="Profile"
                    width={112}
                    height={112}
                    className="object-cover rounded-full"
                  />
                )}
              </div>
            </div>

            {/* Name */}
              {isEditing ? (
                <>
                  <div className="space-y-2 w-xs px-3">
                    <legend className="fieldset-legend justify-center">ชื่อ - นามสกุล</legend>
                    <div className="flex gap-2">
                      <input name="Fname" defaultValue={profile?.customerFname || ""} type="text" className="input w-1/2" placeholder="ระบุชื่อ" required disabled={!isEditing} />
                      <input name="Lname" defaultValue={profile?.customerLname || ""} type="text" className="input w-1/2" placeholder="ระบุนามสกุล" required disabled={!isEditing} />
                    </div>
                  </div>
                </>
              ) : (
                <h2 className="text-xl font-semibold text-base-content">
                  {profile.customerFname} {profile.customerLname}
                </h2>
              )}

            {/* Info */}
            <div className="w-full border-t border-base-300 pt-4 text-sm text-base-content space-y-3">
              <div className="flex justify-between items-center">
                <span className="opacity-70">หมายเลขโทรศัพท์</span>
                { isEditing ? (
                  <input name="Phone" defaultValue={profile?.customerPhone || ""} type="tel" className="input w-1/2" placeholder="ระบุเบอร์โทรศัพท์" pattern="[0-9]{10}" required disabled={!isEditing} />
                ) : (
                  <span>{profile.customerPhone}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">อีเมลมหาวิทยาลัย</span>
                { isEditing ? (
                  <input name="Email" defaultValue={profile?.customerEmail || ""} type="email" className="input w-1/2" placeholder="ระบุอีเมล" required disabled={!isEditing} />
                ) : (
                  <span className="truncate">{profile.customerEmail}</span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-center gap-6 text-sm mt-2">
              { isEditing ? (
                <>
                  { !updating ? (
                    <>
                      <div className="items-center justify-center flex flex-col gap-5">
                        <div>
                          <button
                            type="button"
                            onClick={() => setResetPasswordOpen(true)}
                            className="btn btn-warning"
                          >
                            แก้ไขรหัสผ่าน
                          </button>
                        </div>
                        <div className="flex gap-5">
                          <input type="submit" className="btn btn-green" value={"บันทึก"}/>
                          <button type="button" onClick={() => {setisEditing(false); setPreview(profile.customerPic)}} className="btn btn-error">ยกเลิก</button>
                        </div>
                      </div>
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
              ) : (
                <div className="flex flex-col gap-5">
                  <button type="button" onClick={() => setisEditing(true)} className="btn btn-accent">แก้ไขข้อมูล</button>
                  <Link href="/customer/history" className="btn btn-warning">ประวัติการใช้งาน</Link>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
