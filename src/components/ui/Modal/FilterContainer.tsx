"use client";

import { useEffect, useState } from "react";
import FilterModal from "./FilterModal";
import { ResponsiveCheckFilter } from "../Filters/ResponsiveCheckFilter";
import { MOVE_TYPE_OPTIONS, CHECK_FILTER_OPTIONS } from "../Filters/filterOptions";

interface FilterContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterContainer({ isOpen, onClose }: FilterContainerProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  // 화면 크기 감지 (1024px 기준)
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const handler = () => setIsDesktop(media.matches);
    handler(); // 초기 실행
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // 상태 (moveType / filter)
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
    // 데스크탑 → 필터 바로 출력
    return (
      <ResponsiveCheckFilter
        filters={[
          {
            key: "moveType",
            title: "이사 유형",
            options: MOVE_TYPE_OPTIONS,
            selected: moveTypeSelected,
            onToggle: toggleMoveType,
          },
          {
            key: "filter",
            title: "추가 필터",
            options: CHECK_FILTER_OPTIONS,
            selected: filterSelected,
            onToggle: toggleFilterType,
          },
        ]}
      />
    );
  }

  // 모바일/태블릿 → 모달
  return (
    <FilterModal
      isOpen={isOpen}
      onClose={onClose}
      moveTypeSelected={moveTypeSelected}
      onToggleMove={toggleMoveType}
      filterSelected={filterSelected}
      onToggleFilter={toggleFilterType}
    />
  );
}
