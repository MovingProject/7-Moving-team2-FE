"use client";

import clsx from "clsx";

type DropdownType = "default" | "grid"; // 옵션 배치 방식
type DropdownSize = "sm" | "md" | "lg";
type DropdownRadius = "xl" | "xxl" | "xxxl"; // border-radius + 크기 포함
type DropdownScroll = "none" | "scrollable"; // 스크롤 여부

interface DropdownProps {
  type: DropdownType;
  size: DropdownSize;
  radius: DropdownRadius;
  scroll: DropdownScroll;
  options: string[];
  onSelect: (value: string) => void;
}

const sizeMap: Record<DropdownSize, string> = {
  sm: "text-[12px] w-[180px]",
  md: "text-[12px] w-[90px]",
  lg: "text-[18px] w-[300px]",
};

const radiusMap: Record<DropdownRadius, string> = {
  xl: "rounded-[var(--radius-xl)]",
  xxl: "rounded-[var(--radius-2xl)]",
  xxxl: "rounded-[var(--radius-3xl)]",
};

export function Dropdown({ type, size, radius, scroll, options, onSelect }: DropdownProps) {
  const scrollClass = scroll === "scrollable" ? "max-h-60 overflow-y-auto overflow-x-hidden" : "";

  return (
    <div
      className={clsx(
        "absolute z-10 mt-2 border bg-white shadow-lg",
        sizeMap[size],
        radiusMap[radius],
        scrollClass
      )}
    >
      <ul
        className={clsx(
          type === "grid"
            ? "grid min-w-[100px] grid-cols-2 gap-2 text-center"
            : "flex flex-col text-center"
        )}
      >
        {options.map((opt) => (
          <li
            key={opt}
            className="cursor-pointer px-4 py-2 text-center hover:bg-gray-100"
            onClick={() => onSelect(opt)}
          >
            {opt}
          </li>
        ))}
      </ul>
    </div>
  );
}
