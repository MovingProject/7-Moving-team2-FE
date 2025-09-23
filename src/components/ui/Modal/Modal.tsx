// 모달 UI 컴포넌트 파일입니다.
"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import XIconMd from "@/assets/icon/X.svg";
import XIconSm from "@/assets/icon/X-1.svg";

type ModalType = "post" | "address" | "filter" | "default";
type ModalSize = "sm" | "md";

interface ModalProps {
  type: ModalType;
  size?: ModalSize;
  title?: string;
  headerContent?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode | ((size: ModalSize) => React.ReactNode);
  breakpoint?: number;
  className?: string | ((size: ModalSize) => string);
}

// type + size 매핑
const modalSizeMap: Record<ModalType, Record<ModalSize, string>> = {
  post: {
    sm: "rounded-t-[32px] px-[24px] pt-[32px] pb-[40px]",
    md: "w-[600px] h-auto rounded-[32px] px-[24px] pt-[32px] pb-[40px]",
  },
  address: {
    sm: "w-[350px] rounded-[24px] py-[24px] px-[16px]",
    md: "rounded-[24px] px-[24px] pt-[32px] pb-[40px]",
  },
  filter: {
    sm: "fixed w-full bottom-0 max-h-[90vh] rounded-t-[32px] pt-[16px] pb-[32px] gap-[24px]",
    md: "w-[328px] rounded-[32px] pt-[16px] pb-[32px]",
  },
  default: {
    sm: "rounded-[24px] py-[24px] px-[16px] gap-[30px]",
    md: "rounded-[32px] px-[24px] pt-[32px] pb-[40px] gap-[40px]",
  },
};

export function Modal({
  type,
  size,
  title,
  headerContent,
  onClose,
  children,
  footer,
  breakpoint = 767,
  className,
}: ModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = () => setIsMobile(media.matches);
    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [breakpoint]);

  // size가 지정 안 되면 viewport 기준으로 결정
  const computedSize: ModalSize = size ?? (isMobile ? "sm" : "md");
  const sizeClass = modalSizeMap[type][computedSize];
  const CloseIcon = computedSize === "md" ? XIconMd : XIconSm;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={clsx(
          "relative flex flex-col bg-white shadow-lg",
          sizeClass,
          size === "md" && "mx-auto my-auto",
          typeof className === "function" ? className(computedSize) : className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6">
          {headerContent ? (
            <div className="flex-1">{headerContent}</div>
          ) : (
            <h2 className="text-lg font-semibold">{title}</h2>
          )}
          <button onClick={onClose} className="flex-shrink-0 cursor-pointer">
            <img src={CloseIcon.src} alt="close" />
          </button>
        </div>

        <div className="max-w-full flex-1 overflow-y-auto px-6 py-4">{children}</div>

        {footer && (
          <div className="px-6 py-4">
            {typeof footer === "function" ? footer(computedSize) : footer}
          </div>
        )}
      </div>
    </div>
  );
}
