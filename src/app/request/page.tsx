"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import RequestCard from "@/components/ui/card/RequestCard";
import SearchBar from "./components/SearchBar";
import FiltersWrapper, {
  SortTechFilter,
  ResponsiveMoveAndFilter,
} from "@/components/ui/Filters/Filters";
import FilterContainer from "@/components/ui/Modal/FilterContainer";
import NodataArea from "@/components/ui/nodata/NodataArea";
import { useReceivedRequests, useFilteredRequests } from "@/hooks/useReceivedRequests";
import { MoveType } from "@/types/moveTypes";
import { ReceivedRequestFilter, ReceivedRequestsResponse } from "@/types/receivedRequest";

export default function RequestPage() {
  const [sortTech, setSortTech] = useState("이사 빠른 순");
  const [moveTypeSelected, setMoveTypeSelected] = useState<MoveType[]>([]);
  const [filterTypeSelected, setFilterTypeSelected] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hiddenRequestIds, setHiddenRequestIds] = useState<Set<string>>(new Set());
  const [responseData, setResponseData] = useState<ReceivedRequestsResponse>([]);

  const { data: baseData, isLoading, isError } = useReceivedRequests();
  const { mutate: filterRequests, data: filteredData, isPending } = useFilteredRequests();

  useEffect(() => {
    if (isPending) return;

    if (filteredData) {
      setResponseData(filteredData);
    } else if (baseData && responseData.length === 0) {
      setResponseData(baseData);
    }
  }, [filteredData, baseData, isPending, responseData.length]);

  const handleReject = (requestId: string) => {
    setHiddenRequestIds((prev) => new Set([...prev, requestId]));
  };

  const sortedData = useMemo(() => {
    if (responseData.length === 0) return [];

    const visibleData = responseData.filter((item) => !hiddenRequestIds.has(item.id));

    const invitedItems = visibleData.filter((item) => item.isInvited);
    const normalItems = visibleData.filter((item) => !item.isInvited);

    const sortFn = (a: (typeof responseData)[number], b: (typeof responseData)[number]) => {
      if (sortTech === "이사 빠른 순") {
        return new Date(a.moveAt).getTime() - new Date(b.moveAt).getTime();
      } else if (sortTech === "요청일 빠른 순") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    };

    return [...invitedItems.sort(sortFn), ...normalItems.sort(sortFn)];
  }, [responseData, sortTech, hiddenRequestIds]);

  const filterCounts = useMemo(() => {
    const visibleData = responseData.filter((item) => !hiddenRequestIds.has(item.id));

    const counts = {
      moveType: {} as Record<MoveType, number>,
      invited: 0,
      region: 0,
    };

    for (const item of visibleData) {
      const type = item.serviceType as MoveType;
      counts.moveType[type] = (counts.moveType[type] || 0) + 1;
      if (item.isInvited) counts.invited += 1;
      if (item.departureAddress) counts.region += 1;
    }

    return counts;
  }, [responseData, hiddenRequestIds]);

  const handleFilterApply = () => {
    const filter: ReceivedRequestFilter = {
      serviceTypes: moveTypeSelected.length ? moveTypeSelected : undefined,
      isInvited: filterTypeSelected.includes("invited") ? true : undefined,
      consumerName: searchKeyword || undefined,
    };
    if (sortTech === "이사 빠른 순") filter.sortByMoveAt = "asc";
    else if (sortTech === "요청일 빠른 순") filter.sortByCreatedAt = "asc";

    console.log("필터 요청 payload:", filter);
    filterRequests(filter);
    setHiddenRequestIds(new Set());
  };

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

  useEffect(() => {
    handleFilterApply();
  }, [moveTypeSelected, filterTypeSelected, sortTech, searchKeyword]);

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <>
      <div className="mx-auto flex flex-col gap-1.5 px-4 md:px-5 lg:max-w-[1400px] lg:gap-2 lg:px-8 xl:max-w-[1400px] xl:gap-0 xl:px-10">
        <FiltersWrapper />
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
            <SearchBar value={searchKeyword} onChange={setSearchKeyword} />

            <div className="flex items-center justify-between py-1">
              <p className="min-h-7 text-sm lg:min-h-0 lg:text-base">전체 {sortedData.length}건</p>
              <div className="flex items-center gap-2">
                <SortTechFilter selected={sortTech} onChange={setSortTech} filterKey="sortTech" />
                <button
                  className="border-primary mb-1.5 rounded border p-0.5 text-white lg:hidden"
                  onClick={() => setFilterOpen((prev) => !prev)}
                >
                  <Image src="/icon/ic-filter.svg" width={24} height={24} alt="필터 아이콘" />
                  <span className="sr-only">필터 열기</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6 md:gap-8 lg:gap-12">
              {sortedData.length > 0 ? (
                sortedData.map((cardData) => (
                  <RequestCard
                    key={cardData.id}
                    user={{
                      userId: cardData.consumerId,
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
                      isInvited: cardData.isInvited,
                    }}
                    onReject={handleReject}
                  />
                ))
              ) : (
                <NodataArea content="아직 받은 요청이 없어요!" />
              )}
            </div>
          </div>
        </div>
      </div>

      {filterOpen && (
        <FilterContainer
          isOpen={filterOpen}
          onClose={() => {
            setFilterOpen(false);
          }}
          onApply={({ moveTypes, filterTypes }) => {
            setMoveTypeSelected(moveTypes as MoveType[]);
            setFilterTypeSelected(filterTypes);
            handleFilterApply();
            setFilterOpen(false);
          }}
        />
      )}
    </>
  );
}
