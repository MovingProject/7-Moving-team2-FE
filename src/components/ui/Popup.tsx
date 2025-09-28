/* eslint-disable @next/next/no-img-element */

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

/**
 * Popup 컴포넌트
 *
 * 사용 예시 (test page에서도 확인 가능)
 * <Popup type="info" message="링크가 복사되었어요" />
 * <Popup type="warning" message="확정하지 않은 견적이에요!" />
 *
 * type - 팝업 종류 (info | warning) warning에만 경고 아이콘 자동으로 붙습니다
 * 사이즈는 반응형으로 자동 조절 (폰트, 아이콘 크기 포함)
 * message - 팝업 내부에 들어갈 텍스트 메시지
 * autoCloseDuration - info 타입 팝업은 3초 후에 자동으로 닫힘
 */

export default function Popup({
  type = "info",
  message,
  autoCloseDuration = 3000,
  onClose,
}: PopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (type === "info") {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [type, autoCloseDuration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={clsx(
        "border-primary-softer bg-primary-light text-primary flex items-center gap-2 rounded-[12px] border font-semibold",
        "w-full max-w-[327px] px-6 py-2.5 text-sm", // 모바일
        "md:max-w-[600px] md:px-6 md:py-4.5 md:text-sm", // 태블릿
        "lg:max-w-[955px] lg:px-8 lg:py-6 lg:text-base" // 데스크탑
      )}
    >
      {type === "warning" && (
        <Image src={WarningIcon} alt="warning" className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
      )}
      <p>{message}</p>
    </div>
  );
}
