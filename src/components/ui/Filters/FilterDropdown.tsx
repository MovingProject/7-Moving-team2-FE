"use client";

import { useState } from "react";

type FilterDropdownProps = {
  label: string;
  options: string[];
  selected?: string;
  onChangeAction: (value: string) => void;
  size?: "sm" | "md" | "lg";
  active?: boolean;
};

export default function FilterDropdown({
  label,
  options,
  selected,
  onChangeAction,
  size = "sm",
  active,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: "py-6 text-sm",
    md: "py-8 px-10 text-md",
    lg: "py-16 px-24 text-lg",
  };

  const handleSelect = (option: string) => {
    onChangeAction(option);
    setIsOpen(false);
  };

  return (
    <div>
      <button>{selected || label}</button>
      {isOpen && (
        <ul>
          {options.map((option) => (
            <li>{option}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
