"use client";

import { useAuthStore } from "@/store/authStore";
import { useCustomerReceivedQuotationList } from "@/utils/hook/quotation/useCustomerReceivedQuotationList"; // 새로 만든 훅

import QuotationArea from "./components/QuotationArea";
import PageTitleArea from "../components/PageTitleArea";

import { adaptRequestToQuotationAreaData, AdaptedQuotationData } from "@/utils/quotationAdapter";
import LogoSpinner from "@/components/ui/LogoSpinner";
import NodataArea from "@/components/ui/nodata/NodataArea";

export default function ReceivedPage() {
  const { user } = useAuthStore();
  const userRole = user?.role;

  // 1. 🎯 useQuery 훅을 통해 데이터, 로딩, 에러 상태를 가져옵니다.
  const {
    data: allRequests, // allRequests는 CustomerAllRequestsResponse (배열) 타입입니다.
    isLoading,
    error,
  } = useCustomerReceivedQuotationList();

  // 2. 권한 체크
  if (userRole !== "CONSUMER") {
    return (
      <div className="py-20 text-center text-red-600">
        접근 권한이 없습니다. (고객 계정만 접근 가능)
      </div>
    );
  }

  // 3. 로딩 상태 처리
  if (isLoading) {
    return <LogoSpinner />;
  }

  // 4. 에러 상태 처리
  if (error) {
    return (
      <div className="py-20 text-center text-red-600">
        <PageTitleArea title="오류 발생" />
        <p>견적 목록을 불러오는 데 실패했습니다. (에러: {error.message})</p>
      </div>
    );
  }

  // 5. 데이터 없음 처리 (allRequests가 undefined이거나 빈 배열일 때)
  // useQuery 성공 시 data는 undefined이거나 배열이므로 안전하게 체크 가능
  if (!allRequests || allRequests.length === 0) {
    return <NodataArea content="아직 등록된 견적 요청이 없거나, 받은 견적이 없습니다." />;
  }

  console.log("allRequests", allRequests);
  return (
    <div className="estimate-container flex min-h-[calc(100vh-80px)] flex-col">
      <div className="flex flex-grow flex-col">
        <div className="flex-grow bg-gray-200 py-6 lg:py-12">
          <div className="mx-auto flex w-full flex-col gap-4 lg:max-w-[1400px] lg:gap-8 lg:px-0">
            {/* 6. 데이터 변환 및 Map 순회 */}
            {allRequests.map((request) => {
              const adaptedQuotations: AdaptedQuotationData[] =
                adaptRequestToQuotationAreaData(request);

              return (
                <div key={request.id}>
                  <QuotationArea requestInfo={request} quotations={adaptedQuotations} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
