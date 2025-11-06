"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import WarningIcon from "@/assets/icon/WarningIcon.svg";

type PopupType = "info" | "warning";

interface PopupProps {
  type?: PopupType; // 기본: info
  message: string; // 팝업에 표시할 텍스트
  autoCloseDuration?: number; // info 타입일 때 자동 닫힘 시간
  onClose?: () => void;
}

export default function Popup({
  type = "info",
  message,
  autoCloseDuration = 3000,
  onClose,
}: PopupProps) {
  const [visible, setVisible] = useState(true);
  const [animState, setAnimState] = useState<"enter" | "leave">("enter");

  useEffect(() => {
    // fade-out 타이밍 설정
    const fadeOutTimer = setTimeout(() => setAnimState("leave"), autoCloseDuration - 500);
    const closeTimer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, autoCloseDuration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(closeTimer);
    };
  }, [autoCloseDuration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={clsx(
        "transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
        animState === "enter"
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-4 scale-90 opacity-0",
        "border-primary-softer bg-primary-light text-primary flex items-center gap-2 rounded-[12px] border font-semibold shadow-lg",
        "w-full max-w-[327px] px-6 py-2.5 text-sm",
        "md:max-w-[600px] md:px-6 md:py-4.5 md:text-sm",
        "lg:max-w-[955px] lg:px-8 lg:py-6 lg:text-base"
      )}
    >
      {type === "warning" && (
        <Image
          src={WarningIcon}
          alt="warning"
          width={16}
          height={16}
          className="h-4 w-4 shrink-0 md:h-5 md:w-5"
        />
      )}
      <p className="whitespace-nowrap">{message}</p>
    </div>
  );
}
