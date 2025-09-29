"use client";

import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import Dropdown from "./Dropdown";
import ArrowIconDown from "@/assets/icon/ArrowIconDown.svg";

// 타입 정의 (filter는 지역/서비스 필터처럼 데이터 필터링, sort는 데이터 정렬 변경)
type FilterType = "filter" | "sort";
type FilterVariant = "default" | "active";

interface FilterProps {
  type: FilterType;
  label: string;
  options: string[];
  selected?: string;
  variant?: FilterVariant;
  onChange: (value: string) => void;
}

const typeResponsiveMap: Record<FilterType, string> = {
  filter: clsx(
    "py-1.5 pl-3.5 pr-2.5 text-sm font-semibold rounded-[var(--radius-xl)]", // 모바일, 태블릿 동일
    "lg:py-4 lg:px-6 lg:text-lg lg:w-full lg:max-w-[328px] lg:rounded-[var(--radius-2xl)]" // 데스크탑
  ),
  sort: clsx(
    "py-1.5 pl-2 pr-1.5 text-xs font-semibold rounded-[var(--radius-xl)]", // 모바일, 태블릿 동일
    "lg:py-2 lg:px-2.5 lg:text-sm" // 데스크탑
  ),
};

// type + variant 매핑, sort는 default 상태 시 border 없음
const typeVariantMap: Record<FilterType, Record<FilterVariant, string>> = {
  filter: {
    default: "bg-white text-black-900 border border-gray-200 hover:bg-gray-50",
    active: "bg-primary-lightest text-primary border border-primary",
  },
  sort: {
    default: "bg-white text-black-900 hover:bg-gray-50", // border 없음
    active: "bg-primary-lightest text-primary border border-primary", // active일 땐 border 생김
  },
};

const typeIconMap: Record<FilterType, string> = {
  filter: clsx("h-5 w-5, sm:h-5 sm:w-5, lg:h-9 lg:w-9"),
  sort: clsx("h-5, w-5"),
};

// 공통 필터 박스
export default function FilterBox({
  type,
  label,
  options,
  selected,
  variant = "default",
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
          "flex items-center justify-between gap-2 transition-colors duration-150",
          typeResponsiveMap[type],
          isActive ? typeVariantMap[type]["active"] : typeVariantMap[type]["default"]
        )}
      >
        <span>{selected || label}</span>
        <Image
          src={ArrowIconDown}
          alt="arrow"
          fill
          className={clsx("transition-transform", typeIconMap[type], isOpen && "rotate-180")}
        />
      </button>
      {isOpen && (
        <Dropdown
          type={type}
          layout={dropdownType}
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
