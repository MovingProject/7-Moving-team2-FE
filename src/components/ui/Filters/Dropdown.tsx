"use client";

import clsx from "clsx";

type DropdownType = "filter" | "sort" | "profile" | "notification"; // 드롭다운이 사용되는 요소들
type DropdownLayout = "default" | "grid"; // 옵션 배치 방식
type DropdownSize = "sm" | "md"; // 드롭다운의 사이즈
type DropdownRadius = "xl" | "xxl" | "xxxl"; // border-radius
type DropdownScroll = "none" | "scrollable"; // 드롭다운 내부 스크롤 여부

interface DropdownProps {
  type: DropdownType;
  layout: DropdownLayout;
  size: DropdownSize;
  radius: DropdownRadius;
  scroll: DropdownScroll;
  options: string[];
  onSelect: (value: string) => void;
  header?: React.ReactNode; // profile, notification 전용
  footer?: React.ReactNode; // profile 전용 (로그아웃)
}
// 드롭다운 타입 별 사이즈
const typeSizeMap: Record<DropdownType, Record<DropdownSize, string>> = {
  filter: {
    sm: "w-[125px] py-[16px] px-[14px] text-[14px]", // 지역/서비스 필터 작은 드롭다운
    md: "w-[328px] py-[16px] px-[24px] text-[18px]", // 큰 버전
  },
  sort: {
    sm: "w-[115px] py-[6px] pl-[8px] pr-[6px] text-[12px]", // 정렬 필터 작은 드롭다운
    md: "w-[135px] py-[8px] px-[10px] text-[14px]", // 정렬 필터 큰 드롭다운
  },
  profile: {
    sm: "w-[150px] pt-[10px] pb-[6px] px-[10px] text-[14px]", // 프로필 메뉴 작은 버전
    md: "w-[250px] pt-[16px] pb-[6px] px-[4px] text-[16px]", // 프로필 메뉴 큰 버전
  },
  notification: {
    sm: "w-[310px] py-[10px] px-[16px] text-[14px]", // 알림 리스트 작은 버전
    md: "w-[360px] py-[16px] px-[14px] text-[16px]", // 알림 리스트 큰 버전
  },
};

const radiusMap: Record<DropdownRadius, string> = {
  xl: "rounded-[var(--radius-xl)]",
  xxl: "rounded-[var(--radius-2xl)]",
  xxxl: "rounded-[var(--radius-3xl)]",
};

const typeStyleMap: Record<DropdownType, string> = {
  filter: "shadow-lg border-[#E6E6E6] bg-[#FFF]",
  sort: "shadow-none border-[#E6E6E6] bg-[#FFF]",
  profile: "shadow-lg border-[#E6E6E6] bg-[#FFF]",
  notification: "shadow-lg border-[#E6E6E6] bg-[#FFF]",
};

export function Dropdown({
  type,
  layout,
  size,
  radius,
  scroll,
  options,
  onSelect,
  header,
  footer,
}: DropdownProps) {
  const scrollClass =
    scroll === "scrollable" ? "max-h-60 overflow-y-auto overflow-x-hidden scroll-thin" : "";

  return (
    <div
      className={clsx(
        "absolute z-10 mt-2",
        typeSizeMap[type][size],
        layout === "grid" && "w-[220px]",
        radiusMap[radius],
        typeStyleMap[type],
        scrollClass
      )}
    >
      {header && <div className="px-4 py-2">{header}</div>}
      <ul className={clsx(layout === "grid" ? "grid min-w-[100px] grid-cols-2" : "flex flex-col")}>
        {options.map((opt, idx) => (
          <li
            key={opt}
            className={clsx(
              "cursor-pointer px-4 py-2 hover:bg-gray-100",
              type === "notification" && idx !== 0 && "border-t border-[#E5E7EB]", // 알림일 때만 border-top
              layout === "grid" && idx % 2 === 1 && "border-l border-[#E5E7EB]"
            )}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </li>
        ))}
      </ul>
      {footer && <div className="border-t border-[#E5E7EB] text-center">{footer}</div>}
    </div>
  );
}
