"use client";

import { useState } from "react";
import clsx from "clsx";
import CheckFilter from "./CheckFilter"; // 공통 단일 체크필터 컴포넌트

interface CheckFilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  key: string;
  title: string;
  options: CheckFilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
}

interface CheckFilterTabsProps {
  filters: FilterGroup[];
}

export default function CheckFilterTabs({ filters }: CheckFilterTabsProps) {
  const [active, setActive] = useState(filters[0].key);
  const activeFilter = filters.find((f) => f.key === active);

  return (
    <div className="w-full">
      {/* 탭 헤더 */}
      <div className="mb-3 ml-6 flex gap-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={clsx(
              "flex py-2 transition-colors",
              active === f.key
                ? "text-[18px] font-semibold text-gray-900"
                : "text-[18px] text-gray-400"
            )}
          >
            {f.title}
          </button>
        ))}
      </div>

      {/* 활성화된 체크필터 */}
      {activeFilter && (
        <CheckFilter
          options={activeFilter.options}
          selected={activeFilter.selected}
          onToggle={activeFilter.onToggle}
          showSelectAll={true}
        />
      )}
    </div>
  );
}
