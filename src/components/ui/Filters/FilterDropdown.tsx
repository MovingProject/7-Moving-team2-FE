"use client";

import { useState } from "react";

type FilterDropdownProps = {
  label: string;
  options: string[];
  selected?: string;
  onChangeAction: (value: string) => void;
};

export default function FilterDropdown({
  label,
  options,
  selected,
  onChangeAction,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

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
