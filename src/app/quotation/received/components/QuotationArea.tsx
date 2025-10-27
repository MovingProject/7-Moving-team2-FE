import { useState } from "react";
import { SortFilter } from "@/components/ui/Filters/Filters";
import { getRandomProfileImage } from "@/utils/constant/getProfileImage";
import { UserData, RequestData, QuotationData } from "@/types/card";
import DefaultCard from "@/components/ui/card/DefaultCard";

interface ReceivedQuotationProps {
  quotations?: {
    user: UserData;
    request: RequestData;
    quotation: QuotationData;
  }[];

  selectedSort?: string;
  onSortChange?: (value: string) => void;
}

export default function QuotationArea({
  quotations = [],
  selectedSort,
  onSortChange,
}: ReceivedQuotationProps) {
  const [sortTech, setSortTech] = useState(selectedSort ?? "전체");
  const defaultCardData: {
    user: UserData;
    request: RequestData;
    quotation: QuotationData;
  } = {
    user: {
      userId: "user-driver-001",
      name: "홍길동",
      role: "DRIVER",
      email: "hong@test.com",
      phoneNumber: "010-1234-5678",
      profile: {
        driverId: "drv-001",
        nickname: "홍길동 기사님2",
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
      requestId: "req-789",
      serviceType: ["SMALL_MOVE"],
      departureAddress: "서울시 강남구",
      arrivalAddress: "경기도 성남시",
      requestStatement: "PENDING",
      moveAt: "2025-10-15",
      createdAt: "2025-09-25",
    },
    quotation: {
      quotationId: "q-123",
      departureAddress: "서울시 강남구",
      arrivalAddress: "경기도 성남시",
      quotationStatement: "SUBMITTED",
      price: 180000,
      moveAt: "2025-10-15",
      createdAt: "2025-09-25",
    },
  };

  return (
    <div className="flex flex-col gap-10 rounded-2xl border border-gray-300 bg-white p-4 shadow-md lg:p-10">
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold lg:text-2xl">견적 정보</h3>
        <div className="flex flex-col gap-2.5 rounded-xl bg-gray-100 p-4 lg:p-8">
          <dl className="flex gap-4">
            <dt className="w-[78px] text-gray-500">견적요청일</dt>
            <dd>24.08.06</dd>
          </dl>
          <dl className="flex gap-4">
            <dt className="w-[78px] text-gray-500">서비스 유형</dt>
            <dd>사무실이사</dd>
          </dl>
          <dl className="flex gap-4">
            <dt className="w-[78px] text-gray-500">이용일</dt>
            <dd>2024. 08. 26(월) 오전 10:00</dd>
          </dl>
          <dl className="flex gap-4">
            <dt className="w-[78px] text-gray-500">출발지</dt>
            <dd>서울 중구 삼일대로 343</dd>
          </dl>
          <dl className="flex gap-4">
            <dt className="w-[78px] text-gray-500">도착지</dt>
            <dd>서울 중구 삼일대로 343</dd>
          </dl>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-bold lg:text-2xl">견적서 목록</h3>
          <SortFilter selected={sortTech} onChange={setSortTech} filterKey="sortTech" />
        </div>
        <div className="flex flex-col gap-6">
          {quotations.length > 0 ? (
            quotations.map((q) => (
              <DefaultCard
                key={q.quotation.quotationId}
                user={q.user}
                request={q.request}
                quotation={q.quotation}
              />
            ))
          ) : (
            <p className="py-6 text-center text-gray-500">아직 받은 견적서가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
