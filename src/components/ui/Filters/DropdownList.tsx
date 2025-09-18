"use client";

type DropdownListProps = {
  options: string[];
  onSelectAction: (value: string) => void;
  size: "sm" | "md" | "lg"; // border radius 8, 16, 24에 따라 사이즈 구분
  className?: string;
  header?: React.ReactNode; // 프로필, 알림 용
  footer?: React.ReactNode;
  itemDivider?: boolean; // 알림, 프로필 dropdown 내 구분선
};

export default function DropdownList({
  options,
  onSelectAction,
  size = "sm",
  className = "",
  header,
  footer,
  itemDivider = false,
}: DropdownListProps) {
  const radiusClasses = {
    sm: "rounded-[8px]",
    md: "rounded-[16px]",
    lg: "rounded-[24px]",
  };

  return (
    <div
      className={`absolute z-10 mt-2 border bg-white shadow-lg ${radiusClasses[size]} ${className} `}
    >
      {header && <div className="border-b px-4 py-2">{header}</div>}
      <ul className="flex flex-col">
        {options.map((option, idx) => (
          <li
            key={option}
            onClick={() => onSelectAction(option)}
            className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${itemDivider && idx !== 0 ? "border-t" : ""} `}
          >
            {option}
          </li>
        ))}
      </ul>
      {footer && <div className="border-t px-4 py-2">{footer}</div>}
    </div>
  );
}
