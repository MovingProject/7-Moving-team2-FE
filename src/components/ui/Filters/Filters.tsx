"use client";

import FilterDropdown from "./FilterDropdown";

type FilterProps = {
  selected?: string;
  onChangeAction: (value: string) => void;
};

function createFilter(label: string, options: string[], dropdownClassName: string = "") {
  return function CustomFilter(props: FilterProps) {
    return (
      <FilterDropdown
        label={label}
        options={options}
        buttonSize="sm"
        dropdownSize="sm"
        variant="default"
        className=""
        dropdownClassName={dropdownClassName}
        {...props}
      />
    );
  };
}

// 필터 종류
export const RegionFilter = createFilter(
  "지역",
  [
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
  ],
  "h-179 overflow-y-auto grid grid-cols-2"
);

export const ServiceFilter = createFilter("서비스", ["전체", "소형이사", "가정이사", "사무실이사"]);

export const SortFilter = createFilter("정렬", [
  "리뷰 많은 순",
  "평점 높은 순",
  "경력 높은 순",
  "확정 많은 순",
]);

export const SortFilterFast = createFilter("정렬", ["이사 빠른 순", "요청일 빠른 순"]);
