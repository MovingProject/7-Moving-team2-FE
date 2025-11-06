import clsx from "clsx";

import Image from "next/image";
import React from "react";
import CloseIcon from "@/assets/icon/X.svg";

export interface AlertProps {
  isOpen: boolean;
  message: React.ReactNode;
  /** Alert 메시지의 종류 (색상 결정) */
  onClose?: () => void;
  /** 추가적인 Tailwind CSS 클래스 */
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ isOpen, message, onClose, className }) => {
  const errorStyles = "bg-warning-light border-warning text-warning";

  const handleClose = () => {
    onClose && onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={clsx(
          "translate fixed top-16 left-1/2 flex w-11/12 max-w-[520px] -translate-x-1/2 items-center justify-between rounded-lg border p-4 lg:p-6",
          errorStyles,
          className
        )}
      >
        <p className="text-sm font-medium break-words lg:text-base">{message}</p>

        {onClose && (
          <button onClick={handleClose} className="flex-shrink-0 cursor-pointer">
            <Image src={CloseIcon} alt="close" width={36} height={36} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
