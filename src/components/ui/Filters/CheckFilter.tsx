/* eslint-disable @next/next/no-img-element */

"use client";

import CheckBox from "@/assets/icon/CheckBox.svg";
import CheckBoxEmpty from "@/assets/icon/CheckBoxEmpty.svg";

interface CheckFilterOption {
  label: string;
  value: string;
}

interface CheckFilterProps {
  title?: string; // 필터 이름 (이사 유형, 서비스 종류 등)
  options: CheckFilterOption[]; // 필터 옵션 리스트
  selected: string[]; // 현재 선택된 값
  onToggle: (value: string) => void; // 체크 토글 핸들러
  showSelectAll?: boolean; // 전체 선택 표시 여부 (default: true)
}

export default function CheckFilter({
  title,
  options,
  selected,
  onToggle,
  showSelectAll = true,
}: CheckFilterProps) {
  return (
    <div className="w-full max-w-[328px] bg-white p-4">
      {/* 헤더 */}
      <div className="mb-6 border-b border-gray-200 px-2.5 py-4">
        {/* 데스크탑: 타이틀 + 전체선택 */}
        <div className="hidden items-center justify-between lg:flex">
          {title && <h3 className="text-[20px] font-semibold">{title}</h3>}
          {showSelectAll && (
            <label className="flex cursor-pointer items-center gap-1 text-lg text-gray-400">
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

        {/* 모바일/태블릿: 전체선택만 (옵션과 동일하게 체크 박스 우측 배치) */}
        {showSelectAll && (
          <div className="flex items-center justify-between lg:hidden">
            <label className="flex w-full cursor-pointer items-center justify-between text-lg text-gray-400">
              <span>전체선택</span>
              <span className="flex items-center gap-1 pr-1.5">
                <input
                  type="checkbox"
                  checked={options.every((opt) => selected.includes(opt.value))}
                  onChange={() =>
                    selected.length === options.length
                      ? options.forEach((opt) => onToggle(opt.value))
                      : options.forEach(
                          (opt) => !selected.includes(opt.value) && onToggle(opt.value)
                        )
                  }
                  className="peer hidden"
                />
                <img src={CheckBoxEmpty.src} alt="unchecked" className="peer-checked:hidden" />
                <img src={CheckBox.src} alt="checked" className="hidden peer-checked:block" />
              </span>
            </label>
          </div>
        )}
      </div>

      {/* 옵션 리스트 */}
      <ul className="flex flex-col divide-y divide-gray-200">
        {options.map((opt) => (
          <label key={opt.value} className="flex cursor-pointer items-center justify-between p-4">
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
