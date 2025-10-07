"use client";

import { useState } from "react";
import { RegionFilter, ServiceFilter, SortFilter } from "@/components/ui/Filters/Filters";
import DefaultCard from "@/components/ui/card/DefaultCard";
import { getRandomProfileImage } from "@/utils/constant/getProfileImage";
import Input from "@/components/ui/Input";
import { RequestData, UserData } from "@/types/card";

export default function DriverListPage() {
  const [region, setRegion] = useState("지역");
  const [service, setService] = useState("서비스");
  const [sort, setSort] = useState("리뷰 많은 순");
  const [query, setQuery] = useState("");
  const handleResetFilter = () => {
    console.log("필터 초기화!");
  };

  const defaultCardDataList: {
    user: UserData;
    request: RequestData;
  }[] = Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    user: {
      userId: `user-driver-${i + 1}`,
      name: "홍길동",
      role: "DRIVER",
      profile: {
        driverId: `drv-00${i + 1}`,
        nickname: "홍길동 기사님",
        oneLiner: "고객님의 물품을 소중하고 안전하게 운송하여 드립니다.",
        image: getRandomProfileImage(),
        reviewCount: 45,
        rating: 4.8,
        careerYears: 7,
        confirmedCount: 187,
        driverServiceTypes: ["SMALL_MOVE", "HOME_MOVE"],
        driverServiceAreas: ["SEOUL", "GYEONGGI"],
        likes: {
          likedCount: 36,
          isLikedByCurrentUser: true,
        },
      },
    },
    request: {
      requestId: `req-${i + 1}`,
      serviceType: ["SMALL_MOVE"],
      departureAddress: "서울시 강남구",
      arrivalAddress: "경기도 성남시",
      requestStatement: "PENDING",
      moveAt: "2025-10-15",
      createdAt: "2025-09-25",
    },
  }));

  return (
    <main className="min-h-screen w-full bg-white px-[260px] py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">기사님 찾기</h1>
      </header>
      <section className="flex gap-10">
        <div className="flex w-[300px] flex-shrink-0 flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-lg font-semibold text-gray-800">필터</h2>
            <button
              onClick={handleResetFilter}
              className="text-sm text-gray-400 transition hover:text-blue-500"
            >
              초기화
            </button>
          </div>
          {/* Filter */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5">
              <h3>지역을 선택해주세요</h3>
              <RegionFilter selected={region} onChange={setRegion} />
            </div>
            <div className="flex flex-col gap-5">
              <h3>어떤 서비스가 필요하세요?</h3>
              <ServiceFilter selected={service} onChange={setService} />
            </div>
          </div>
          {/* 찜한 기사님 */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">찜한 기사님</h3>
            <div
              className="flex flex-col gap-3 overflow-x-hidden overflow-y-auto pr-1"
              style={{ maxHeight: "400px" }}
            >
              {defaultCardDataList.map((data, idx) => (
                <DefaultCard key={idx} user={data.user} request={data.request} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          {/* Sort & Input */}
          <div className="mb-5 flex flex-col items-end gap-4">
            <div className="flex items-center">
              <SortFilter selected={sort} onChange={setSort} />
            </div>
            <Input
              type="search"
              value={query}
              placeholder="텍스트를 입력해 주세요."
              onChange={(value) => setQuery(value)}
              icon="left"
              className="w-full max-w-[1000px]"
            />
          </div>

          {/* Card List */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2" style={{ maxHeight: "700px" }}>
            {defaultCardDataList.map((data, idx) => (
              <DefaultCard key={idx} user={data.user} request={data.request} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
