"use client";

import { useState } from "react";
import {
  RegionFilter,
  ServiceFilter,
  SortFilter,
  SortTechFilter,
  MoveTypeFilter,
  FilterFilter,
  ResponsiveMoveAndFilter,
} from "@/components/ui/Filters/Filters";
import Dropdown from "@/components/ui/Filters/Dropdown";
import Image from "next/image";
import { PROFILE_OPTIONS, NOTIFICATION_OPTIONS } from "@/components/ui/Filters/filterOptions";

export default function TestPage() {
  const [region, setRegion] = useState("지역");
  const [service, setService] = useState("서비스");
  const [sort, setSort] = useState("리뷰 많은 순");
  const [sortTech, setSortTech] = useState("이사 빠른순");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [moveTypeSelected, setMoveTypeSelected] = useState<string[]>([]);
  const [filterTypeSelected, setFilterTypeSelected] = useState<string[]>([]);

  const toggleMoveType = (value: string) => {
    setMoveTypeSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleFilterType = (value: string) => {
    setFilterTypeSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-bold">필터 테스트 페이지</h1>

      <div className="flex flex-col flex-wrap gap-20">
        <RegionFilter selected={region} onChange={setRegion} />
        <ServiceFilter selected={service} onChange={setService} />
        <SortFilter selected={sort} onChange={setSort} />
        <SortTechFilter selected={sortTech} onChange={setSortTech} />
      </div>
      <div className="mt-6">
        <p>선택된 지역: {region}</p>
        <p>선택된 서비스: {service}</p>
        <p>선택된 정렬: {sort}</p>
        <p>선택된 정렬: {sortTech}</p>
      </div>

      {/* 프로필 용 드롭다운 */}
      <div className="relative inline-block">
        <button
          onClick={() => setProfileOpen((p) => !p)}
          className="flex w-[100px] items-center gap-2 rounded-full border px-4 py-2 hover:bg-gray-50"
        >
          <Image src="/icons/profile.svg" alt="profile" className="h-6 w-6 rounded-full" />
          <span>홍길동</span>
        </button>
        {profileOpen && (
          <Dropdown
            type="profile"
            layout="default"
            scroll="none"
            options={PROFILE_OPTIONS}
            header={<div className="py-2 font-semibold">홍길동 고객님</div>}
            footer={
              <div
                className="cursor-pointer px-4 py-2 text-red-500 hover:bg-gray-100"
                onClick={() => console.log("로그아웃")}
              >
                로그아웃
              </div>
            }
            onSelect={(val) => {
              console.log("프로필 선택:", val);
              setProfileOpen(false);
            }}
          />
        )}
      </div>

      {/* 알림 용 드롭다운 */}
      <div className="relative inline-block">
        <button
          onClick={() => setNotificationOpen((p) => !p)}
          className="relative rounded-full p-2 hover:bg-gray-50"
        >
          <Image src="/icons/bell.svg" alt="알림" className="h-6 w-6" />
          {/* 알림 카운트 예시 */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            3
          </span>
        </button>
        {notificationOpen && (
          <Dropdown
            type="notification"
            layout="default"
            scroll="scrollable"
            options={NOTIFICATION_OPTIONS}
            header={<div className="py-2 font-semibold">알림</div>}
            onSelect={(val) => {
              console.log("알림 선택:", val);
              setNotificationOpen(false);
            }}
          />
        )}
      </div>

      {/* 체크 필터 테스트 */}
      <div className="mt-10 flex-col space-y-6">
        <h2 className="text-lg font-semibold">체크 필터 테스트</h2>
        <MoveTypeFilter selected={moveTypeSelected} onToggle={toggleMoveType} />
        <FilterFilter selected={filterTypeSelected} onToggle={toggleFilterType} />
      </div>
      <div className="mt-10 flex-col space-y-6">
        <h2 className="text-lg font-semibold">반응형 체크 필터 테스트</h2>
        <ResponsiveMoveAndFilter
          moveTypeSelected={moveTypeSelected}
          onToggleMove={toggleMoveType}
          filterSelected={filterTypeSelected}
          onToggleFilter={toggleFilterType}
        />
      </div>
    </div>
  );
}
