"use client"

import { useRouter } from "next/navigation";

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  navigateTo?: string;
}

export default function AlertModal({ isOpen, message, onClose, navigateTo }: AlertModalProps) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    if (navigateTo) {
      window.location.replace(navigateTo);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">แจ้งเตือน</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn" onClick={handleClose}>
            ปิด
          </button>
        </div>
      </div>
    </dialog>
  );
}