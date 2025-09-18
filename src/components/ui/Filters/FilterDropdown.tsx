"use client";

import { useState } from "react";
import DropdownList from "./DropdownList";

type FilterDropdownProps = {
  label: string;
  options: string[];
  selected?: string;
  onChangeAction: (value: string) => void;
  buttonSize?: "sm" | "md" | "lg"; // 버튼 사이즈
  dropdownSize?: "sm" | "md" | "lg"; // dropdown 사이즈
  variant?: "default" | "active";
};

export default function FilterDropdown({
  label,
  options,
  selected,
  onChangeAction,
  buttonSize = "sm", // 패딩 기준
  dropdownSize = "sm",
  variant = "default", // 버튼 활성화 여부
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = isOpen || variant === "active";

  const buttonSizeClasses = {
    sm: "py-6 text-sm",
    md: "py-8 px-10 text-base",
    lg: "py-16 px-24 text-lg",
  };

  const baseClasses = "border rounded-[8px] transition-colors duration-150";
  const defaultClasses = "bg-[#FFF] text-[#1F1F1F]";
  const activeClasses = "bg-[#F5FAFF] border-[1px] border-solid border-[#1B92FF] text-[#1B92FF]";

  return (
    <div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${baseClasses} ${buttonSizeClasses[buttonSize]} ${isActive ? activeClasses : defaultClasses}`}
      >
        {selected || label}
      </button>
      {isOpen && (
        <DropdownList
          options={options}
          onSelectAction={(value) => {
            onChangeAction(value);
            setIsOpen(false);
          }}
          size={dropdownSize}
        />
      )}
    </div>
  );
}
