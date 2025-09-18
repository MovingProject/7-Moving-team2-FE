"use client";

import { useState } from "react";
import clsx from "clsx";
import { Dropdown } from "./Dropdown";
import ArrowDownIconSm from "@/assets/icon/ArrowDownIcon-sm.svg";
import ArrowDownIconMd from "@/assets/icon/ArrowDownIcon-md.svg";
import ArrowDownIconLg from "@/assets/icon/ArrowDownIcon-lg.svg";

// 타입 정의
type FilterType = "dropDown" | "sort";
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
  onChange: (value: string) => void;
}

// 매핑
const sizeMap: Record<FilterSize, string> = {
  sm: "py-6 pl-8 pr-6 text-[12px] w-[90px] h-[30px]",
  md: "py-8 px-10",
  lg: "py-16 px-24 text-[18px] w-[300px] h-[64px]",
};

const variantMap: Record<FilterVariant, string> = {
  default: "bg-white text-[#1F1F1F] border border-[#E5E7EB] hover:bg-gray-50",
  active:
    "bg-[var(--color-primary-lightest)] text-[var(--color-primary)] border-[1px] border-solid border-[var(--color-primary)]",
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
  onChange,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = isOpen || variant === "active";
  const dropdownType = options.length > 6 ? "grid" : "default";

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "flex w-full items-center justify-between gap-2 transition-colors duration-150",
          sizeMap[size],
          radiusMap[radius],
          isActive ? variantMap["active"] : variantMap["default"]
        )}
      >
        <span>{selected || label}</span>
        <img
          src={arrowIconMap[size]}
          alt="arrow"
          className={clsx("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>
      {isOpen && (
        <Dropdown
          type={dropdownType}
          size="sm"
          radius="xl" // Dropdown 전용 radius
          scroll={options.length > 10 ? "scrollable" : "none"}
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
