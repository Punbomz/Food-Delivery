import { useState } from "react";

export const useAlertModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [navigateTo, setNavigateTo] = useState<string | undefined>(undefined);

  const showAlert = (msg: string, navigate?: string) => {
    setMessage(msg);
    setNavigateTo(navigate);
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    message,
    navigateTo,
    showAlert,
    closeAlert,
  };
};