"use client";

import React, { useMemo } from "react";
import RequestCard from "@/components/ui/card/RequestCard";
import { useAuthStore } from "@/store/authStore";
import LogoSpinner from "@/components/ui/LogoSpinner";
import NodataArea from "@/components/ui/nodata/NodataArea";
import {
  adaptApiDriverQuotationList,
  adaptDriverItemToRequestCardProps,
} from "@/utils/quotationAdapter";
import { useDriverQuotationList } from "@/utils/hook/quotation/useDriverQuotationList";

export default function QuotationSentPage() {
  const { user } = useAuthStore();
  const userRole = user?.role;

  // 1. 데이터 훅 호출
  const {
    data: apiQuotationList, // ApiDriverQuotationItem[] 타입
    isLoading,
    error,
  } = useDriverQuotationList();
  const quotationList = useMemo(() => {
    if (!apiQuotationList) return [];
    return adaptApiDriverQuotationList(apiQuotationList);
  }, [apiQuotationList]);

  console.log("quotationList", quotationList);
  // 2. 권한, 로딩, 에러 처리 (이전 답변 유지)
  if (userRole !== "DRIVER") {
    return (
      <div className="py-20 text-center text-red-600">
        접근 권한이 없습니다. (기사 계정만 접근 가능)
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LogoSpinner />
      </div>
    );
  }

  // 에러 메시지 추출 (이전 답변의 error 처리를 가정)
  const errorMessage = error ? error.response?.data?.message || error.message : null;
  if (error) {
    return (
      <div className="py-20 text-center text-red-600">
        <p>견적 목록을 불러오는 데 실패했습니다. (에러: {errorMessage})</p>
      </div>
    );
  }

  // 4. 데이터 없음 처리
  if (quotationList.length === 0) {
    return (
      <NodataArea
        content="보낸 견적서가 없습니다."
        linkPath="/request"
        linkText="받은요청 확인하기"
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col">
      <div className="flex flex-grow flex-col">
        <section className="flex-grow bg-gray-200 py-6 lg:py-12">
          <div className="mx-auto flex border-b border-gray-200 px-4 py-2 md:px-5 lg:max-w-[1400px] lg:gap-0 lg:px-5 xl:max-w-[1400px] xl:gap-8 xl:px-0">
            <h2 className="w-full text-lg font-semibold lg:text-2xl">기사님의 견적관리</h2>
          </div>
          <div className="mx-auto mt-2 grid gap-4 px-4 lg:max-w-[1400px] lg:grid-cols-2 lg:gap-6 lg:px-0">
            {quotationList.map((item) => {
              const cardProps = adaptDriverItemToRequestCardProps(item);

              return (
                <RequestCard
                  key={item.quotationId}
                  user={cardProps.user}
                  request={cardProps.request}
                  quotation={cardProps.quotation}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
