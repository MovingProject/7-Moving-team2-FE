"use client";

import { useState, useEffect, useMemo } from "react";
import { RegionFilter, ServiceFilter, SortFilter } from "@/components/ui/Filters/Filters";
import DefaultCard from "@/components/ui/card/DefaultCard";
import { useRouter } from "next/navigation";
import { LikedDriver, useLikedDriversQuery } from "@/utils/hook/likes/useLikedQuery";
import { useDriverListInfiniteQuery } from "@/utils/hook/driver/driver";
import { useInView } from "react-intersection-observer";
import Input from "@/components/ui/Input";
import LikedDriverCard from "../liked/components/LikedDriverCard";
import { AreaType, AreaMap } from "@/types/areaTypes";
import { MoveType } from "@/types/moveTypes";
import { mapDriverToCardData } from "@/utils/mappers/driverToCardMapper";
import { SortOption } from "@/types/driver";

export default function DriverListPage() {
  const router = useRouter();

  const [region, setRegion] = useState("지역");
  const [service, setService] = useState("서비스");
  const [sort, setSort] = useState("리뷰 많은 순");
  const [query, setQuery] = useState("");
  const { data: likedData } = useLikedDriversQuery();
  const likedDrivers = likedData?.pages.flatMap((p) => p.likedDriverList) ?? [];

  const sortMap: Record<string, SortOption> = {
    "리뷰 많은 순": "REVIEW_DESC",
    "평점 높은 순": "RATING_DESC",
    "경력 높은 순": "CAREER_DESC",
    "확정 많은 순": "CONFIRMED_DESC",
  };

  const handleResetFilter = () => {
    setRegion("지역");
    setService("서비스");
    setSort("리뷰 많은 순");
    setQuery("");
  };

  const REGION_REVERSE_MAP = Object.entries(AreaMap).reduce<Record<string, AreaType>>(
    (acc, [en, ko]) => {
      acc[ko] = en as AreaType;
      return acc;
    },
    {}
  );

  const SERVICE_REVERSE_MAP: Record<string, MoveType> = {
    소형이사: "SMALL_MOVE",
    가정이사: "HOME_MOVE",
    사무실이사: "OFFICE_MOVE",
  };

  const filters = useMemo(() => {
    const areaKey = region !== "지역" ? (REGION_REVERSE_MAP[region] as AreaType) : undefined;
    const typeKey = service !== "서비스" ? (SERVICE_REVERSE_MAP[service] as MoveType) : undefined;
    return {
      limit: 10,
      sort: sortMap[sort] ?? "REVIEW_DESC",
      area: areaKey,
      type: typeKey,
      keyword: query.trim() || undefined,
    };
  }, [region, service, sort, query]);

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useDriverListInfiniteQuery(filters);

  // inView 감지 시 다음 페이지 불러오기
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // 데이터 평탄화
  const drivers = data?.pages.flatMap((page) => page.items) ?? [];

  // 카드 클릭
  const handleCardClick = (driverId: string) => {
    router.push(`/driverList/${driverId}`);
  };

  // 찜한 기사님 클릭
  const handleLikedDriverClick = (driver: LikedDriver) => {
    sessionStorage.setItem("selectedLikedDriver", JSON.stringify(driver));
    router.push(`/driverList/${driver.id}`);
  };

  return (
    <main className="min-h-screen w-full bg-white px-8 pt-6 pb-4 md:px-20 lg:px-30 xl:px-60">
      <header className="mb-10 flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900">기사님 찾기</h1>
      </header>
      <section className="flex flex-col gap-10 lg:flex-row">
        <div className="hidden flex-[0.25] flex-col gap-6 lg:block">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-lg font-semibold text-gray-800">필터</h2>
            <button
              onClick={handleResetFilter}
              className="hover:text-primary cursor-pointer text-sm text-gray-400 transition"
            >
              초기화
            </button>
          </div>
          {/* Filter */}
          <div className="flex flex-col gap-5">
            <div className="mt-3 flex flex-col gap-5">
              <h3>지역을 선택해주세요</h3>
              <RegionFilter selected={region} onChange={setRegion} filterKey="region" />
            </div>
            <div className="flex flex-col gap-5">
              <h3>어떤 서비스가 필요하세요?</h3>
              <ServiceFilter selected={service} onChange={setService} filterKey="service" />
            </div>
          </div>
          {/* 찜한 기사님 */}
          <div className="mt-5 flex flex-1 flex-col max-lg:hidden">
            <h3 className="mb-8 text-lg font-semibold text-gray-800">찜한 기사님</h3>
            <div className="flex flex-col gap-3 pr-1" style={{ maxHeight: "400px" }}>
              {likedDrivers && likedDrivers.length > 0 ? (
                likedDrivers.map((driver) =>
                  driver ? (
                    <LikedDriverCard
                      key={driver.id}
                      driver={driver}
                      onClickAction={() => handleLikedDriverClick(driver)}
                    />
                  ) : null
                )
              ) : (
                <p className="text-sm text-gray-400">찜한 기사님이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-[0.75] flex-col gap-3">
          {/* Sort & Input */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 lg:justify-end">
            <div className="flex max-w-[70%] flex-1 gap-3 lg:hidden">
              <RegionFilter selected={region} onChange={setRegion} filterKey="region" />
              <ServiceFilter selected={service} onChange={setService} filterKey="service" />
            </div>
            <SortFilter selected={sort} onChange={setSort} filterKey="sort" />
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
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
            {isLoading ? (
              <p className="py-10 text-center text-gray-400">불러오는 중...</p>
            ) : drivers.length > 0 ? (
              drivers.map((driver) => {
                if (!driver || !driver.user?.id) return null;
                const cardData = mapDriverToCardData(driver);
                return (
                  <div
                    key={driver.user?.id}
                    onClick={() => handleCardClick(driver.user?.id)}
                    className="cursor-pointer"
                  >
                    <DefaultCard {...cardData} variant="list" />
                  </div>
                );
              })
            ) : (
              <p className="py-10 text-center text-gray-400">조건에 맞는 기사님이 없습니다.</p>
            )}
            {/* 무한스크롤 트리거 */}
            {hasNextPage && (
              <div ref={ref} className="mt-6 text-center text-gray-400">
                {isFetchingNextPage ? "불러오는 중..." : "스크롤 시 더 불러옵니다."}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
