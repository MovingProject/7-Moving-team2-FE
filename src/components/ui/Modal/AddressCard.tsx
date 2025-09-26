"use client";

import clsx from "clsx";

interface AddressCardProps {
  zipCode: string;
  roadAddr: string; // 도로명 주소
  lotAddr?: string; // 지번
  selected?: boolean;
  onSelect: () => void;
}

export default function AddressCard({
  zipCode,
  roadAddr,
  lotAddr,
  selected,
  onSelect,
}: AddressCardProps) {
  return (
    <div
      className={clsx(
        "cursor-pointer rounded-2xl p-3 transition-colors hover:bg-gray-50",
        selected
          ? "border-primary-softer bg-primary-lightest border"
          : "border border-gray-100 bg-white"
      )}
      onClick={onSelect}
    >
      <p className="mb-4 text-sm font-semibold md:text-base">{zipCode}</p>
      <div className="mb-4 flex items-start gap-2">
        <span className="bg-primary-lightest text-primary rounded-2xl px-2 py-1 text-xs font-medium whitespace-nowrap">
          도로명
        </span>
        <p className="text-sm break-words text-gray-900 md:text-base">{roadAddr}</p>
      </div>
      {lotAddr && (
        <div className="flex items-start gap-2">
          <span className="bg-primary-lightest text-primary rounded-2xl px-3.25 py-1 text-xs font-medium whitespace-nowrap">
            지번
          </span>
          <p className="text-sm break-words text-gray-900 md:text-base">{lotAddr}</p>
        </div>
      )}
    </div>
  );
}
