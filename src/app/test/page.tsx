"use client";

import { useState } from "react";
import {
  RegionFilterSm,
  RegionFilterMd,
  ServiceFilterSm,
  ServiceFilterMd,
  SortFilterSm,
  SortFilterMd,
} from "@/components/ui/Filters/Filters";
import { Dropdown } from "@/components/ui/Filters/Dropdown";
import { PROFILE_OPTIONS, NOTIFICATION_OPTIONS } from "@/components/ui/Filters/dropdownOptions";

export default function TestPage() {
  const [region, setRegion] = useState("지역");
  const [service, setService] = useState("서비스");
  const [sort, setSort] = useState("리뷰 많은 순");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-bold">필터 테스트 페이지</h1>

      <div className="flex flex-wrap gap-20">
        <RegionFilterSm selected={region} onChange={setRegion} />
        <ServiceFilterSm selected={service} onChange={setService} />
        <SortFilterSm selected={sort} onChange={setSort} />
      </div>

      <div className="flex flex-wrap gap-20">
        <RegionFilterMd selected={region} onChange={setRegion} />
        <ServiceFilterMd selected={service} onChange={setService} />
        <SortFilterMd selected={sort} onChange={setSort} />
      </div>

      <div className="mt-6 space-y-2">
        <p>선택된 지역: {region}</p>
        <p>선택된 서비스: {service}</p>
        <p>선택된 정렬: {sort}</p>
      </div>

      {/* 프로필 용 드롭다운 */}
      <div className="relative inline-block">
        <button
          onClick={() => setProfileOpen((p) => !p)}
          className="flex items-center gap-2 rounded-full border px-4 py-2 hover:bg-gray-50"
        >
          <img src="/icons/profile.svg" alt="profile" className="h-6 w-6 rounded-full" />
          <span>홍길동</span>
        </button>
        {profileOpen && (
          <Dropdown
            type="profile"
            layout="default"
            size="sm"
            radius="xxl"
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
          <img src="/icons/bell.svg" alt="알림" className="h-6 w-6" />
          {/* 알림 카운트 예시 */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            3
          </span>
        </button>
        {notificationOpen && (
          <Dropdown
            type="notification"
            layout="default"
            size="sm"
            radius="xxxl"
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
    </div>
  );
}
