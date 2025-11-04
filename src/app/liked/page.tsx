"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LikedDriver, useLikedDriversQuery } from "@/utils/hook/likes/useLikedQuery";
import LikedDriverCard from "./components/LikedDriverCard";
import NodataArea from "@/components/ui/nodata/NodataArea";
import { LikedDriverCardSkeleton } from "./components/LikedDriverCardSkeleton";
import Popup from "@/components/ui/Popup";

export default function LikedDriversPage() {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useLikedDriversQuery(10);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [popup, setPopup] = useState<{ type: "info" | "warning"; message: string } | null>(null);

  useEffect(() => {
    if (!isLoading && data) {
      setFadeOut(true); // 스켈레톤 페이드아웃 시작
      const fadeTimer = setTimeout(() => setShowSkeleton(false), 400); // DOM 제거
      const cardTimer = setTimeout(() => setShowCards(true), 100); // 카드 천천히 fade-in
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(cardTimer);
      };
    }
  }, [isLoading, data]);

  // 모든 페이지 데이터 평탄화
  const likedDrivers: LikedDriver[] =
    data?.pages
      ?.flatMap((page) => page?.likedDriverList ?? [])
      .filter((d): d is LikedDriver => !!d && !!d.id) ?? [];

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCardClick = (driverId: string) => {
    router.push(`/driverList/${driverId}`);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen w-full bg-white px-8 pt-6 md:px-16 lg:px-24 xl:px-40">
        <header className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-900">찜한 기사님</h1>
          <p className="mt-2 text-sm text-gray-500">
            고객님이 찜한 기사님 목록을 확인할 수 있습니다.
          </p>
        </header>

        {/* 스켈레톤 카드 */}
        {showSkeleton && (
          <div
            className={`grid grid-cols-1 gap-6 transition-opacity duration-500 sm:grid-cols-2 ${
              fadeOut ? "opacity-0" : "opacity-100"
            }`}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <LikedDriverCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* 카드 리스트 */}
        {showCards && (
          <section
            className={`transition-all duration-700 ease-out ${
              showSkeleton ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            {likedDrivers.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {likedDrivers.map((driver) => (
                  <LikedDriverCard
                    key={driver.id}
                    driver={driver}
                    onClickAction={() => handleCardClick(driver.id)}
                    setPopupAction={setPopup}
                  />
                ))}
              </div>
            ) : (
              <NodataArea content="찜한 기사님이 없습니다." />
            )}

            {/* 무한 스크롤 감지 영역 */}
            <div ref={observerRef} className="mt-10 flex h-12 items-center justify-center">
              {isFetchingNextPage && <span className="text-sm text-gray-400">불러오는 중...</span>}
            </div>
          </section>
        )}
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-red-400">데이터를 불러오는 중 오류가 발생했습니다.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white px-8 pt-6 md:px-16 lg:px-24 xl:px-60">
      {popup && (
        <div className="absolute top-[70px] left-1/2 z-50 flex w-full -translate-x-1/2 justify-center">
          <Popup type={popup.type} message={popup.message} onClose={() => setPopup(null)} />
        </div>
      )}

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">찜한 기사님</h1>
      </header>

      {/* 카드 리스트 */}
      <section>
        {likedDrivers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {likedDrivers.map((driver: LikedDriver) => (
              <LikedDriverCard
                key={driver.id}
                driver={driver}
                onClickAction={() => handleCardClick(driver.id)}
                setPopupAction={setPopup}
              />
            ))}
          </div>
        ) : (
          <NodataArea content="찜한 기사님이 없습니다." />
        )}

        {/* 무한 스크롤 감지 영역 */}
        <div ref={observerRef} className="mt-10 flex h-12 items-center justify-center">
          {isFetchingNextPage && <span className="text-sm text-gray-400">불러오는 중...</span>}
        </div>
      </section>
    </main>
  );
}
