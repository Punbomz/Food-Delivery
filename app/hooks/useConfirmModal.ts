import { useState } from "react";

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("ยืนยัน");
  const [confirmText, setConfirmText] = useState("ตกลง");
  const [cancelText, setCancelText] = useState("ยกเลิก");
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  const showConfirm = (
    msg: string, 
    onConfirm: () => void,
    options?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
    }
  ) => {
    setMessage(msg);
    setTitle(options?.title || "ยืนยัน");
    setConfirmText(options?.confirmText || "ตกลง");
    setCancelText(options?.cancelText || "ยกเลิก");
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (onConfirmCallback) {
      onConfirmCallback();
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    message,
    title,
    confirmText,
    cancelText,
    showConfirm,
    handleConfirm,
    handleCancel,
  };
};