"use client";

import { useState, useMemo } from "react";
import { RegionFilter, ServiceFilter, SortFilter } from "@/components/ui/Filters/Filters";
import DefaultCard from "@/components/ui/card/DefaultCard";
import { getRandomProfileImage } from "@/utils/constant/getProfileImage";
import Input from "@/components/ui/Input";
import { RequestData, DriverUser, DriverProfileData } from "@/types/card";
import { useRouter } from "next/navigation";
import { AreaType } from "@/types/areaTypes";
import { MoveType } from "@/types/moveTypes";

export default function DriverListPage() {
  const router = useRouter();

  const [region, setRegion] = useState("지역");
  const [service, setService] = useState("서비스");
  const [sort, setSort] = useState("리뷰 많은 순");
  const [query, setQuery] = useState("");

  const handleResetFilter = () => {
    setRegion("지역");
    setService("서비스");
    setSort("리뷰 많은 순");
    setQuery("");
  };

  const defaultCardDataList: {
    user: DriverUser;
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

  const handleCardClick = (id: string) => {
    router.push(`/driver/${id}`);
  };

  // 필터 + 검색 + 정렬
  const filteredData = useMemo(() => {
    let result = [...defaultCardDataList];

    const regionKey = region === "지역" ? null : (region.toUpperCase() as AreaType);
    const serviceKey = service === "서비스" ? null : (service.toUpperCase() as MoveType);
    const q = query.trim().toLowerCase();

    result = result.filter((item) => {
      const profile = item.user.profile;
      if (!profile) return false; // profile null 방어

      const passRegion = !regionKey || profile.driverServiceAreas?.includes(regionKey);
      const passService =
        !serviceKey || (profile.driverServiceTypes as MoveType[]).includes(serviceKey);

      const passQuery =
        !q ||
        item.user.name.toLowerCase().includes(q) ||
        profile.oneLiner?.toLowerCase().includes(q);

      return passRegion && passService && passQuery;
    });

    if (sort === "리뷰 많은 순") {
      result.sort(
        (a, b) => (b.user.profile?.reviewCount ?? 0) - (a.user.profile?.reviewCount ?? 0)
      );
    } else if (sort === "이름순") {
      result.sort((a, b) => a.user.name.localeCompare(b.user.name));
    }

    return result;
  }, [defaultCardDataList, region, service, query, sort]);

  return (
    <main className="min-h-screen w-full bg-white px-[260px] py-10">
      <header className="mb-15">
        <h1 className="text-2xl font-semibold text-gray-900">기사님 찾기</h1>
      </header>
      <section className="flex gap-10">
        <div className="flex w-[300px] flex-shrink-0 flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-lg font-semibold text-gray-800">필터</h2>
            <button
              onClick={handleResetFilter}
              className="hover:text-primary text-sm text-gray-400 transition"
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
            <h3 className="mb-8 text-lg font-semibold text-gray-800">찜한 기사님</h3>
            <div
              className="flex flex-col gap-3 overflow-x-hidden overflow-y-auto pr-1"
              style={{ maxHeight: "400px" }}
            >
              {defaultCardDataList.map((data, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardClick(data.user.userId)}
                  className="cursor-pointer"
                >
                  <DefaultCard user={data.user} request={data.request} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3">
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
            {filteredData.length > 0 ? (
              filteredData.map((data, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardClick(data.user.userId)}
                  className="cursor-pointer"
                >
                  <DefaultCard user={data.user} request={data.request} />
                </div>
              ))
            ) : (
              <p className="py-10 text-center text-gray-400">조건에 맞는 기사님이 없습니다</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
