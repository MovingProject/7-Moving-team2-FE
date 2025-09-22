"use client";

import clsx from "clsx";

interface AddressCardProps {
  zipCode: string;
  roadAddr: string; // 도로명 주소
  lotAddr?: string; // 지번
  selected?: boolean;
  onSelect: () => void;
}

export function AddressCard({ zipCode, roadAddr, lotAddr, selected, onSelect }: AddressCardProps) {
  return (
    <div
      className={clsx(
        "cursor-pointer rounded-2xl p-3 transition-colors hover:bg-gray-50",
        selected
          ? "border-[1px] border-[#4DA9FF] bg-[#F5FAFF]"
          : "border-[1px] border-[#F2F2F2] bg-[#FFF]"
      )}
      onClick={onSelect}
    >
      <p className="mb-[16px] text-sm font-semibold md:text-base">{zipCode}</p>
      <p className="text-#1F1F1F mb-[16px]">
        <span className="rounded-2xl bg-[#F5FAFF] px-[8px] py-1 text-xs font-medium text-[#1B92FF]">
          도로명
        </span>
        {roadAddr}
      </p>
      {lotAddr && (
        <p className="text-[#1F1F1F]">
          <span className="rounded-2xl bg-[#F5FAFF] px-[13px] py-1 text-xs font-medium text-[#1B92FF]">
            지번
          </span>
          {lotAddr}
        </p>
      )}
    </div>
  );
}
