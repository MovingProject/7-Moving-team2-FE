"use client";

import CheckBox from "@/assets/icon/CheckBox.svg";
import CheckBoxEmpty from "@/assets/icon/CheckBoxEmpty.svg";

interface CheckFilterOption {
  label: string;
  value: string;
}

interface CheckFilterProps {
  title: string; // 필터 이름 (이사 유형, 서비스 종류 등)
  options: CheckFilterOption[]; // 필터 옵션 리스트
  selected: string[]; // 현재 선택된 값
  onToggle: (value: string) => void; // 체크 토글 핸들러
  showSelectAll?: boolean; // 전체 선택 표시 여부 (default: true)
}

export function CheckFilter({
  title,
  options,
  selected,
  onToggle,
  showSelectAll = true,
}: CheckFilterProps) {
  return (
    <div className="w-[328px] bg-[#FFF] p-[16px]">
      {/* 헤더 */}
      <div className="mb-[24px] flex items-center justify-between border-b border-[#E5E7EB] px-[10px] py-[16px]">
        <h3 className="text-[20px] font-semibold">{title}</h3>
        {showSelectAll && (
          <label className="flex cursor-pointer items-center gap-[4px] text-[18px] text-[#ABABAB]">
            <input
              type="checkbox"
              checked={options.every((opt) => selected.includes(opt.value))}
              onChange={() =>
                selected.length === options.length
                  ? options.forEach((opt) => onToggle(opt.value)) // 전체 해제
                  : options.forEach((opt) => !selected.includes(opt.value) && onToggle(opt.value))
              }
              className="peer hidden"
            />
            <img src={CheckBoxEmpty.src} alt="unchecked" className="peer-checked:hidden" />
            <img src={CheckBox.src} alt="checked" className="hidden peer-checked:block" />
            전체선택
          </label>
        )}
      </div>

      {/* 옵션 리스트 */}
      <ul className="flex flex-col divide-y divide-gray-200">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center justify-between p-[16px]"
          >
            <span>{opt.label}</span>
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => onToggle(opt.value)}
              className="peer hidden"
            />
            <img src={CheckBoxEmpty.src} alt="unchecked" className="peer-checked:hidden" />
            <img src={CheckBox.src} alt="checked" className="hidden peer-checked:block" />
          </label>
        ))}
      </ul>
    </div>
  );
}
