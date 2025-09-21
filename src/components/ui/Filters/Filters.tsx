// Figma 상 명시된 필터 모음, pure wrapper

import { FilterBox } from "./FilterBox";
import { CheckFilter } from "./CheckFilter";
import { ResponsiveCheckFilter } from "./ResponsiveCheckFilter";
import {
  REGION_OPTIONS,
  SERVICE_OPTIONS,
  SORT_OPTIONS,
  SORT_TECH_OPTIONS,
  MOVE_TYPE_OPTIONS,
  CHECK_FILTER_OPTIONS,
} from "./filterOptions";

// 지역 필터
export function RegionFilterSm(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "size" | "label" | "options">
) {
  return <FilterBox type="filter" size="sm" label="지역" options={REGION_OPTIONS} {...props} />;
}

export function RegionFilterMd(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "size" | "label" | "options">
) {
  return (
    <FilterBox
      type="filter"
      size="md"
      radius="xxl"
      label="지역"
      options={REGION_OPTIONS}
      iconSizeOverride="md"
      {...props}
    />
  );
}

// 서비스 필터
export function ServiceFilterSm(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "size" | "label" | "options">
) {
  return <FilterBox type="filter" size="sm" label="서비스" options={SERVICE_OPTIONS} {...props} />;
}

export function ServiceFilterMd(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "size" | "label" | "options">
) {
  return (
    <FilterBox
      type="filter"
      size="md"
      radius="xxl"
      label="서비스"
      options={SERVICE_OPTIONS}
      iconSizeOverride="md"
      {...props}
    />
  );
}

// 정렬 필터 (회원 기사 찾기 페이지)
export function SortFilterSm(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "size" | "label" | "options">
) {
  return <FilterBox type="sort" size="sm" label="정렬" options={SORT_OPTIONS} {...props} />;
}

export function SortFilterMd(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "size" | "label" | "options">
) {
  return <FilterBox type="sort" size="md" label="정렬" options={SORT_OPTIONS} {...props} />;
}

// 정렬 필터 (기사 받은 요청 페이지)
export function SortTechFilterSm(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "size" | "label" | "options">
) {
  return <FilterBox type="sort" size="sm" label="정렬" options={SORT_TECH_OPTIONS} {...props} />;
}

export function SortTechFilterMd(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "size" | "label" | "options">
) {
  return <FilterBox type="sort" size="md" label="정렬" options={SORT_TECH_OPTIONS} {...props} />;
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
}) {
  return (
    <ResponsiveCheckFilter
      filters={[
        {
          key: "moveType",
          title: "이사 유형",
          options: MOVE_TYPE_OPTIONS,
          selected: props.moveTypeSelected,
          onToggle: props.onToggleMove,
        },
        {
          key: "filter",
          title: "필터",
          options: CHECK_FILTER_OPTIONS,
          selected: props.filterSelected,
          onToggle: props.onToggleFilter,
        },
      ]}
    />
  );
}
