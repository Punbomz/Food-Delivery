"use client"

import { useRouter } from "next/navigation";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  navigateTo?: string;
}

export default function ConfirmModal({ 
  isOpen, 
  title = "ยืนยัน",
  message, 
  confirmText = "ตกลง",
  cancelText = "ยกเลิก",
  onConfirm, 
  onCancel,
  navigateTo 
}: ConfirmModalProps) {
  const router = useRouter();

  const handleConfirm = () => {
    onConfirm();
    if (navigateTo) {
      window.location.replace(navigateTo);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn btn-success" onClick={handleConfirm}>
            {confirmText}
          </button>
          <button className="btn btn-error" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </dialog>
  );
}