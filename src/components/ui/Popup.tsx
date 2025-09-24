"use client";

import clsx from "clsx";
import WarningIconSm from "@/assets/icon/WarningIcon-sm.svg";
import WarningIconMd from "@/assets/icon/WarningIcon-md.svg";

type PopupType = "info" | "warning";
type PopupSize = "sm" | "md" | "lg";

interface PopupProps {
  type?: PopupType; // 기본: info
  size?: PopupSize; // 기본: md
  message: string; // 팝업에 표시할 텍스트
}

const sizeMap: Record<PopupSize, string> = {
  sm: "py-[10px] px-[24px] text-sm w-[327px] h-[48px]",
  md: "py-[18px] px-[24px] text-base w-[955px]",
  lg: "py-[24px] px-[32px] text-lg w-[955px]",
};

/**
 * Popup 컴포넌트
 *
 * 사용 예시 (test page에서도 확인 가능)
 * <Popup type="info" size="sm" message="링크가 복사되었어요" />
 * <Popup type="warning" size="md" message="확정하지 않은 견적이에요!" />
 *
 * type - 팝업 종류 (info | warning) warning에만 경고 아이콘 자동으로 붙습니다
 * size - 팝업 크기 (sm | md | lg)
 * message - 팝업 내부에 들어갈 텍스트 메시지
 */

export default function Popup({ type = "info", size = "md", message }: PopupProps) {
  const iconSrc = size === "sm" ? WarningIconSm.src : WarningIconMd.src;

  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-[12px] border border-[#4DA9FF] bg-[#E9F4FF] font-semibold text-[#1B92FF]",
        sizeMap[size]
      )}
    >
      {type === "warning" && (
        <img
          src={iconSrc}
          alt="warning"
          className={clsx(size === "sm" ? "h-4 w-4" : "h-5 w-5", "shrink-0")} // 팝업 sm이면 아이콘 sm, 팝업 md/lg면 아이콘 md
        />
      )}
      <p>{message}</p>
    </div>
  );
}
