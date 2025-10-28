// Figma 상 명시된 필터 모음, pure wrapper

import { useEffect } from "react";
import FilterBox from "./FilterBox";
import CheckFilter from "./CheckFilter";
import ResponsiveCheckFilter from "./ResponsiveCheckFilter";
import {
  REGION_OPTIONS,
  SERVICE_OPTIONS,
  SORT_OPTIONS,
  SORT_TECH_OPTIONS,
  MOVE_TYPE_OPTIONS,
  CHECK_FILTER_OPTIONS,
} from "./filterOptions";
import { useFilterStore } from "@/store/filterStore";

export default function FiltersWrapper() {
  const { closeAll } = useFilterStore();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".filterbox")) closeAll();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [closeAll]);

  return null;
}

// 지역 필터
export function RegionFilter(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "label" | "options">
) {
  return (
    <FilterBox type="filter" label="지역" options={REGION_OPTIONS} {...props} filterKey="region" />
  );
}

// 서비스 필터
export function ServiceFilter(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "label" | "options">
) {
  return (
    <FilterBox
      type="filter"
      label="서비스"
      options={SERVICE_OPTIONS}
      {...props}
      filterKey="service"
    />
  );
}

// 정렬 필터 (회원 기사 찾기 페이지)
export function SortFilter(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "label" | "options">
) {
  return <FilterBox type="sort" label="정렬" options={SORT_OPTIONS} {...props} filterKey="sort" />;
}

// 정렬 필터 (기사 받은 요청 페이지)
export function SortTechFilter(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "label" | "options">
) {
  return (
    <FilterBox
      type="sort"
      label="정렬"
      options={SORT_TECH_OPTIONS}
      {...props}
      filterKey="sortTech"
    />
  );
}

// 체크 필터 - 이사 유형
export function MoveTypeFilter(
  props: Omit<React.ComponentProps<typeof CheckFilter>, "title" | "options">
) {
  return <CheckFilter title="이사 유형" options={MOVE_TYPE_OPTIONS} {...props} />;
}

// 체크 필터 - 필터
export function FilterFilter(
  props: Omit<React.ComponentProps<typeof CheckFilter>, "title" | "options">
) {
  return <CheckFilter title="필터" options={CHECK_FILTER_OPTIONS} {...props} />;
}

// 반응형 체크 필터 (이사 유형 + 필터)
export function ResponsiveMoveAndFilter(props: {
  moveTypeSelected: string[];
  onToggleMove: (v: string) => void;
  filterSelected: string[];
  onToggleFilter: (v: string) => void;
  filterCounts?: {
    moveType: Record<string, number>;
    invited: number;
    region: number;
  };
}) {
  const { moveTypeSelected, onToggleMove, filterSelected, onToggleFilter, filterCounts } = props;

  const moveOptions = MOVE_TYPE_OPTIONS.map((opt) => ({
    ...opt,
    label: `${opt.label.split(" ")[0]} (${filterCounts?.moveType?.[opt.value] ?? 0})`,
  }));

  const filterOptions = CHECK_FILTER_OPTIONS.map((opt) => {
    const count =
      opt.value === "invited" ? (filterCounts?.invited ?? 0) : (filterCounts?.region ?? 0);

    const baseLabel = opt.label.replace(/\s*\(\d+\)/, "");
    return { ...opt, label: `${baseLabel} (${count})` };
  });
  return (
    <ResponsiveCheckFilter
      filters={[
        {
          key: "moveType",
          title: "이사 유형",
          options: moveOptions,
          selected: moveTypeSelected,
          onToggle: onToggleMove,
        },
        {
          key: "filter",
          title: "필터",
          options: filterOptions,
          selected: filterSelected,
          onToggle: onToggleFilter,
        },
      ]}
    />
  );
}
