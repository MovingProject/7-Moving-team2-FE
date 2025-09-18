"use client";

import FilterDropdown from "./FilterDropdown";

type FilterProps = {
  selected?: string;
  onChangeAction: (value: string) => void;
};

export function RegionFilter(props: FilterProps) {
  return (
    <FilterDropdown
      label="지역"
      options={[
        "전체",
        "서울",
        "경기",
        "인천",
        "강원",
        "충북",
        "충남",
        "세종",
        "대전",
        "전북",
        "전남",
        "광주",
        "경북",
        "경남",
        "대구",
        "울산",
        "부산",
        "제주",
      ]}
      size="sm"
      {...props}
    />
  );
}

export function ServiceFilter(props: FilterProps) {
  return (
    <FilterDropdown
      label="서비스"
      options={["전체", "소형이사", "가정이사", "사무실이사"]}
      size="sm"
      {...props}
    />
  );
}

export function SortFilter(props: FilterProps) {
  return (
    <FilterDropdown
      label="정렬"
      options={["리뷰 많은 순", "평점 높은 순", "경력 높은 순", "확정 많은 순"]}
      size="sm"
      {...props}
    />
  );
}

export function SortFilterFast(props: FilterProps) {
  return (
    <FilterDropdown
      label="정렬"
      options={["이사 빠른 순", "요청일 빠른 순"]}
      size="sm"
      {...props}
    />
  );
}
