"use client";

import { useEffect, useState } from "react";
import { FilterModal } from "./FilterModal";
import { ResponsiveMoveAndFilter } from "../Filters/Filters";

export default function FilterContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // ✅ 화면 크기 감지 (1024px 기준)
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const handler = () => setIsDesktop(media.matches);
    handler(); // 초기 실행
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // ✅ 상태 (moveType / filter)
  const [moveTypeSelected, setMoveTypeSelected] = useState<string[]>([]);
  const [filterSelected, setFilterSelected] = useState<string[]>([]);

  const toggleMoveType = (value: string) => {
    setMoveTypeSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleFilterType = (value: string) => {
    setFilterSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  if (isDesktop) {
    // ✅ 데스크탑 → 필터 바로 출력
    return (
      <div className="p-4">
        <ResponsiveMoveAndFilter
          moveTypeSelected={moveTypeSelected}
          onToggleMove={toggleMoveType}
          filterSelected={filterSelected}
          onToggleFilter={toggleFilterType}
        />
      </div>
    );
  }

  // ✅ 모바일/태블릿 → 버튼 + 모달
  return (
    <div className="p-4">
      <button className="rounded bg-blue-500 px-4 py-2 text-white" onClick={() => setIsOpen(true)}>
        필터 열기
      </button>

      <FilterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        moveTypeSelected={moveTypeSelected}
        onToggleMove={toggleMoveType}
        filterSelected={filterSelected}
        onToggleFilter={toggleFilterType}
      />
    </div>
  );
}
