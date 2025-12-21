"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopID: number | null;
  onAlert: (message: string) => void;
}

export default function ResetPasswordModal({ isOpen, onClose, shopID, onAlert }: ResetPasswordModalProps) {
  const [show, setShow] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const pathname = usePathname();
  const [alertMessage, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const handleClose = (callback?: () => void) => {
    setShow(false);
    setTimeout(() => {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("");
      onClose();
      if (callback) {
        setTimeout(callback, 100);
      }
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
        setMessage("รหัสผ่านใหม่ไม่ตรงกัน!");
      return;
    }

    if (newPassword.length < 8) {
        setMessage("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร!");
      return;
    }

    setLoading(true);

    let role = "";
    if(pathname.startsWith("/shop")) {
      role = "shop";
    } else if(pathname.startsWith("/admin")) {
      role = "admin";
    } else {
      role = "customer";
    }

    try {
      const res = await fetch("/api/changePass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: shopID,
          oldPassword,
          newPassword,
          role,
        }),
      });

      setLoading(false);

      if (res.ok) {
        handleClose(() => {
          onAlert("เปลี่ยนรหัสผ่านสำเร็จ!");
        });
      } else {
        const data = await res.json();
        handleClose(() => {
          onAlert(data.message);
        });
      }
    } catch (error) {
      setLoading(false);
      handleClose(() => {
        onAlert("เกิดข้อผิดพลาด! กรุณาลองใหม่อีกครั้ง");
      });
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-200 ${
          show ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={() => handleClose()}
      />
      
      <div 
        className={`modal-box relative z-10 transition-all duration-200 ${
          show 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-4'
        }`}
      >
        <div className="mb-4">
            <h3 className="font-bold text-lg">แก้ไขรหัสผ่าน</h3>
            { alertMessage !== "" && (
                <p className="text-red-500">{ alertMessage }</p>
            )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">รหัสผ่านเดิม</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="input input-bordered w-full"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">รหัสผ่านใหม่</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input input-bordered w-full"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered w-full"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="modal-action">
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "บันทึก"
              )}
            </button>
            <button 
              type="button" 
              className="btn btn-error" 
              onClick={() => handleClose()}
              disabled={isLoading}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}