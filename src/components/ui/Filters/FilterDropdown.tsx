"use client";

import { useState } from "react";

type FilterDropdownProps = {
  label: string;
  options: string[];
  selected?: string;
  onChangeAction: (value: string) => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "active";
};

export default function FilterDropdown({
  label,
  options,
  selected,
  onChangeAction,
  size = "sm",
  variant = "default",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = isOpen || variant === "active";

  const sizeClasses = {
    sm: "py-6 text-sm",
    md: "py-8 px-10 text-base",
    lg: "py-16 px-24 text-lg",
  };

  const baseClasses = "border rounded-[8px] transition-colors duration-150";
  const defaultClasses = "bg-[#FFF] text-[#1F1F1F]";
  const activeClasses = "bg-[#F5FAFF] border-[1px] border-solid border-[#1B92FF]";

  return (
    <div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${baseClasses} ${sizeClasses[size]} ${isActive ? activeClasses : defaultClasses}`}
      >
        {selected || label}
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-2 w-40 rounded-lg border bg-white shadow-lg">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChangeAction(option);
                setIsOpen(false);
              }}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
