"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import RequestCard from "@/components/ui/card/RequestCard";
import SearchBar from "./components/SearchBar";
import { SortTechFilter, ResponsiveMoveAndFilter } from "@/components/ui/Filters/Filters";
import FilterContainer from "@/components/ui/Modal/FilterContainer";
import NodataArea from "@/components/ui/nodata/NodataArea";
import { useReceivedRequests, useFilteredRequests } from "@/hooks/useReceivedRequests";
import { MoveType } from "@/types/moveTypes";
import { ReceivedRequestFilter } from "@/types/receivedRequest";

export default function RequestPage() {
  const [sortTech, setSortTech] = useState("이사 빠른순");
  const [moveTypeSelected, setMoveTypeSelected] = useState<MoveType[]>([]);
  const [filterTypeSelected, setFilterTypeSelected] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data: baseData, isLoading, isError } = useReceivedRequests();
  const { mutate: filterRequests, data: filteredData, isPending } = useFilteredRequests();

  const responseData = filteredData ?? baseData ?? [];

  const filterCounts = useMemo(() => {
    if (!Array.isArray(baseData)) {
      return { moveType: {}, invited: 0, region: 0 };
    }

    const counts = {
      moveType: {} as Record<MoveType, number>,
      invited: 0,
      region: 0,
    };

    for (const item of baseData ?? []) {
      // moveType 카운트
      const type = item.serviceType as MoveType;
      counts.moveType[type] = (counts.moveType[type] || 0) + 1;

      // 지정 요청 카운트
      if (item.isInvited) counts.invited += 1;

      // 지역 카운트 (departure 기준)
      if (item.departureAddress) counts.region += 1;
    }

    return counts;
  }, [baseData]);

  const handleFilterApply = () => {
    const filter: ReceivedRequestFilter = {
      serviceTypes: moveTypeSelected.length ? moveTypeSelected : undefined,
      isInvited: filterTypeSelected.includes("invited") ? true : undefined,
      consumerName: searchKeyword || undefined,
      sortByMoveAt: sortTech === "이사 빠른순" ? "asc" : undefined,
      sortByCreatedAt: sortTech === "요청일 빠른순" ? "asc" : undefined,
    };
    console.log("📤 필터 요청 payload:", filter);
    filterRequests(filter);
  };

  // 1. toggle에서는 상태만 갱신
  const toggleMoveType = (value: string) => {
    setMoveTypeSelected((prev) =>
      prev.includes(value as MoveType)
        ? prev.filter((v) => v !== (value as MoveType))
        : [...prev, value as MoveType]
    );
  };

  const toggleFilterType = (value: string) => {
    setFilterTypeSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // 2. 최신 상태 기반 자동 필터링 (useEffect로 변경 감지)
  useEffect(() => {
    handleFilterApply();
  }, [moveTypeSelected, filterTypeSelected, sortTech, searchKeyword]);

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <>
      <div className="mx-auto flex flex-col gap-1.5 px-4 md:px-5 lg:max-w-[1400px] lg:gap-2 lg:px-8 xl:max-w-[1400px] xl:gap-0 xl:px-0">
        <div className="py-[14px] lg:py-8">
          <h3 className="text-xl font-bold lg:text-3xl">받은 요청</h3>
        </div>
        <div className="flex lg:gap-28">
          <div className="hidden lg:flex lg:w-[328px] lg:flex-col">
            <ResponsiveMoveAndFilter
              moveTypeSelected={moveTypeSelected}
              onToggleMove={toggleMoveType}
              filterSelected={filterTypeSelected}
              onToggleFilter={toggleFilterType}
              filterCounts={filterCounts}
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 md:gap-4 lg:gap-8">
            <SearchBar value={searchKeyword} onChange={(value) => setSearchKeyword(value)} />
            <div className="flex items-center justify-between py-1">
              <p className="text-sm lg:text-base">전체 {responseData.length}건</p>
              <div className="flex items-center gap-2">
                <SortTechFilter selected={sortTech} onChange={setSortTech} />
                <button
                  className="border-primary rounded border p-0.5 text-white lg:hidden"
                  onClick={() => setFilterOpen((prev) => !prev)}
                >
                  <Image src="/icon/ic-filter.svg" width={24} height={24} alt="필터 아이콘" />
                  <span className="sr-only">필터 열기</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-12">
              {responseData.length > 0 ? (
                responseData.map((cardData, index) => (
                  <RequestCard
                    key={cardData.id || index}
                    user={{
                      userId: cardData.id,
                      name: cardData.consumerName,
                      role: "CONSUMER",
                      email: "",
                      phoneNumber: "",
                    }}
                    request={{
                      requestId: cardData.id,
                      serviceType: [cardData.serviceType],
                      departureAddress: cardData.departureAddress,
                      arrivalAddress: cardData.arrivalAddress,
                      requestStatement: "PENDING",
                      moveAt: cardData.moveAt,
                      createdAt: cardData.createdAt,
                    }}
                  />
                ))
              ) : (
                <NodataArea content="아직 받은 요청이 없어요!" />
              )}
            </div>
          </div>
        </div>
      </div>

      {filterOpen && <FilterContainer isOpen={filterOpen} onClose={() => setFilterOpen(false)} />}
    </>
  );
}
