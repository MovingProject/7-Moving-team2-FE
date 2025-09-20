"use client";

import { useState } from "react";
import clsx from "clsx";
import { Dropdown } from "./Dropdown";
import ArrowDownIconSm from "@/assets/icon/ArrowDownIcon-sm.svg";
import ArrowDownIconMd from "@/assets/icon/ArrowDownIcon-md.svg";
import ArrowDownIconLg from "@/assets/icon/ArrowDownIcon-lg.svg";

// 타입 정의 (filter는 지역/서비스 필터처럼 데이터 필터링, sort는 데이터 정렬 변경)
type FilterType = "filter" | "sort";
type FilterSize = "sm" | "md" | "lg";
type FilterVariant = "default" | "active";
type FilterRadius = "xl" | "xxl";

interface FilterProps {
  type: FilterType;
  size: FilterSize;
  label: string;
  options: string[];
  selected?: string;
  variant?: FilterVariant;
  radius?: FilterRadius;
  iconSizeOverride?: FilterSize;
  onChange: (value: string) => void;
}

// type + size 매핑
const typeSizeMap: Record<FilterType, Record<FilterSize, string>> = {
  filter: {
    sm: "py-[6px] pl-[14px] pr-[10px] text-[14px] font-semibold",
    md: "py-[16px] px-[24px] w-[327px] text-[16px] font-semibold",
    lg: "py-[16px] px-[24px] w-[640px] text-[18px] font-semibold",
  },
  sort: {
    sm: "py-[6px] pl-[8px] pr-[6px] text-[12px] font-semibold",
    md: "py-[8px] px-[10px] text-[14px] font-semibold",
    lg: "", // sort는 lg 없음
  },
};

// type + variant 매핑, sort는 default 상태 시 border 없음
const typeVariantMap: Record<FilterType, Record<FilterVariant, string>> = {
  filter: {
    default: "bg-white text-[#1F1F1F] border border-[#E5E7EB] hover:bg-gray-50",
    active: "bg-[#F5FAFF] text-[#1B92FF] border border-[#1B92FF]",
  },
  sort: {
    default: "bg-white text-[#1F1F1F] hover:bg-gray-50", // border 없음
    active: "bg-[#F5FAFF] text-[#1B92FF] border border-[#1B92FF]", // active일 땐 border 생김
  },
};

const radiusMap: Record<FilterRadius, string> = {
  xl: "rounded-[var(--radius-xl)]",
  xxl: "rounded-[var(--radius-2xl)]",
};

const arrowIconMap: Record<FilterSize, string> = {
  sm: ArrowDownIconSm.src,
  md: ArrowDownIconMd.src,
  lg: ArrowDownIconLg.src,
};

// 공통 필터 박스
export function FilterBox({
  type,
  size,
  label,
  options,
  selected,
  variant = "default",
  radius = "xl",
  iconSizeOverride,
  onChange,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = isOpen || variant === "active";
  const dropdownType = options.length > 6 ? "grid" : "default";
  const iconSize = iconSizeOverride ?? size;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "flex items-center justify-between gap-2 transition-colors duration-150",
          typeSizeMap[type][size],
          radiusMap[radius],
          isActive ? typeVariantMap[type]["active"] : typeVariantMap[type]["default"]
        )}
      >
        <span>{selected || label}</span>
        <img
          src={arrowIconMap[iconSize]}
          alt="arrow"
          className={clsx("transition-transform", isOpen && "rotate-180")}
        />
      </button>
      {isOpen && (
        <Dropdown
          type={type}
          layout={dropdownType}
          size={size === "lg" ? "md" : size}
          radius="xl" // Dropdown 전용 radius
          scroll={options.length > 6 ? "scrollable" : "none"}
          options={options}
          onSelect={(value) => {
            onChange(value);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}
