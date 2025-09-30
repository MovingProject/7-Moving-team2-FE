"use client";

import { useState } from "react";
import Image from "next/image";
import RequestCard from "@/components/ui/card/RequestCard";
import SearchBar from "./components/SearchBar";
import { SortTechFilter, ResponsiveMoveAndFilter } from "@/components/ui/Filters/Filters";
import { CommonCardProps } from "@/components/ui/card/BaseCard";
import FilterContainer from "@/components/ui/Modal/FilterContainer";

export default function RequestPage() {
  const [sortTech, setSortTech] = useState("이사 빠른순");
  const [moveTypeSelected, setMoveTypeSelected] = useState<string[]>([]);
  const [filterTypeSelected, setFilterTypeSelected] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
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

  interface ServerData {
    totalCount: number;
    data: CommonCardProps[];
  }

  const serverData: ServerData = {
    totalCount: 2,
    data: [
      {
        user: {
          userId: "user-consumer-001",
          name: "김철수",
          role: "CONSUMER",
        },
        request: {
          requestId: "req-789",
          serviceType: ["SMALL_MOVE"],
          departureAddress: "인천시 남동구",
          arrivalAddress: "경기도 고양시",
          requestStatement: "PENDING",
          moveAt: "2024-07-01",
          createdAt: "2025-09-25",
        },
        quotation: {
          quotationId: "q-123",
          departureAddress: "서울시 강남구",
          arrivalAddress: "경기도 성남시",
          price: 180000,
          moveAt: "2025-10-15",
          createdAt: "2025-09-25",
          quotationStatement: "ACCEPTED",
        },
      },
      {
        user: {
          userId: "user-consumer-002",
          name: "홍길동",
          role: "CONSUMER",
        },
        request: {
          requestId: "req-780",
          serviceType: ["SMALL_MOVE"],
          departureAddress: "서울시 강남구",
          arrivalAddress: "경기도 성남시",
          requestStatement: "PENDING",
          moveAt: "2025-10-15",
          createdAt: "2025-09-25",
        },
      },
    ],
  };

  return (
    <>
      <div className="mx-auto flex flex-col gap-1.5 px-4 lg:max-w-[1400px] lg:gap-0 lg:px-0">
        <div className="py-[14px] lg:py-8">
          <h3 className="text-lg font-semibold lg:text-2xl">받은 요청</h3>
        </div>
        <div className="flex lg:gap-28">
          <div className="hidden lg:flex lg:w-[328px] lg:flex-col">
            <ResponsiveMoveAndFilter
              moveTypeSelected={moveTypeSelected}
              onToggleMove={toggleMoveType}
              filterSelected={filterTypeSelected}
              onToggleFilter={toggleFilterType}
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 md:gap-4 lg:gap-8">
            <SearchBar />
            <div className="flex items-center justify-between py-1">
              <p className="text-sm lg:text-base">전체 {serverData.totalCount}건</p>
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
              {serverData.data.map((cardData) => (
                <RequestCard
                  key={cardData.request?.requestId}
                  user={cardData.user}
                  request={cardData.request}
                  quotation={cardData.quotation}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {filterOpen && <FilterContainer isOpen={filterOpen} onClose={() => setFilterOpen(false)} />}
    </>
  );
}
