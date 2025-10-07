"use client";

import clsx from "clsx";

type DropdownType = "filter" | "sort" | "profile" | "notification"; // 드롭다운이 사용되는 요소들
type DropdownLayout = "default" | "grid"; // 옵션 배치 방식
type DropdownScroll = "none" | "scrollable"; // 드롭다운 내부 스크롤 여부

interface DropdownProps {
  type: DropdownType;
  layout: DropdownLayout;
  scroll: DropdownScroll;
  options: string[];
  onSelect: (value: string) => void;
  header?: React.ReactNode; // profile, notification 전용
  footer?: React.ReactNode; // profile 전용 (로그아웃)
}
// 드롭다운 타입 별 사이즈
const dropdownSizeMap: Record<DropdownType, Record<DropdownLayout, string>> = {
  filter: {
    default: clsx(
      "w-full max-w-[125px] py-4 px-3.5 text-sm",
      "lg:w-full lg:max-w-[328px] lg:py-4 lg:px-6 lg:text-lg"
    ),
    grid: clsx(
      "w-full max-w-[200px] py-4 px-3.5 text-sm",
      "lg:w-full lg:max-w-[328px] lg:py-4 lg:px-6 lg:text-lg"
    ),
  },
  sort: {
    default: clsx(
      "w-full max-w-[120px] py-1.5 pl-2 pr-1.5 text-xs whitespace-nowrap",
      "w-full lg:max-w-[135px] lg:py-2 lg:px-2.5 lg:text-sm"
    ),
    grid: "",
  },
  profile: {
    default: clsx(
      "w-[150px] pt-[10px] pb-[6px] px-[10px] text-sm",
      "lg:w-[220px] lg:pt-[16px] lg:pb-[6px] lg:px-[4px] lg:text-base"
    ),
    grid: "",
  },
  notification: {
    default: clsx(
      "w-[250px] py-2.5 px-4 text-sm",
      "lg:w-[360px] lg:py-[16px] lg:px-[14px] lg:text-base"
    ),
    grid: "",
  },
};

const dropdownRadiusMap: Record<DropdownType, string> = {
  filter: clsx("rounded-xl", "lg:rounded-2xl"),
  sort: "rounded-xl",
  profile: "rounded-2xl",
  notification: "rounded-3xl",
};

export default function Dropdown({
  type,
  layout,
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
        "absolute z-10 mt-2 border border-gray-200 bg-white shadow-lg",
        dropdownSizeMap[type][layout],
        dropdownRadiusMap[type],
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
              type === "notification" && idx !== 0 && "border-t border-gray-200", // 알림일 때만 border-top
              layout === "grid" && idx % 2 === 1 && "border-l border-gray-200"
            )}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </li>
        ))}
      </ul>
      {footer && <div className="border-t border-gray-200 text-center">{footer}</div>}
    </div>
  );
}
