// Figma 상 명시된 필터 모음
"use client";

import { FilterBox } from "./FilterBox";
import {
  REGION_OPTIONS,
  SERVICE_OPTIONS,
  SORT_OPTIONS,
  SORT_TECH_OPTIONS,
} from "./dropdownOptions";

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
