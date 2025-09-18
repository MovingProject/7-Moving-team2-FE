"use client";

import { FilterBox } from "./FilterBox";
import { REGION_OPTIONS, SERVICE_OPTIONS, SORT_OPTIONS } from "./dropdownOptions";

// 지역 필터
export function RegionFilter(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "size" | "label" | "options">
) {
  return <FilterBox type="dropDown" size="sm" label="지역" options={REGION_OPTIONS} {...props} />;
}

// 서비스 필터
export function ServiceFilter(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "size" | "label" | "options">
) {
  return (
    <FilterBox type="dropDown" size="sm" label="서비스" options={SERVICE_OPTIONS} {...props} />
  );
}

// 정렬 필터
export function SortFilter(
  props: Omit<React.ComponentProps<typeof FilterBox>, "type" | "size" | "label" | "options">
) {
  return <FilterBox type="sort" size="sm" label="정렬" options={SORT_OPTIONS} {...props} />;
}
