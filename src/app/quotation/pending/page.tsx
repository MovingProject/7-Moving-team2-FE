"use client";

import { useState } from "react";
import { getRandomProfileImage } from "@/utils/constant/getProfileImage";
import { UserData, RequestData, QuotationData } from "@/types/card";
import TabNavigation from "../components/TabNavigation";
import { CONSUMER_TAB_LIST } from "@/types/tabs";
import DefaultCard from "@/components/ui/card/DefaultCard";
import OrderCard from "@/components/ui/card/OrderCard";
import RequestCard from "@/components/ui/card/RequestCard";

const mockQuotations: {
  user: UserData;
  request: RequestData;
  quotation: QuotationData;
}[] = [
  {
    user: {
      userId: "user-driver-001",
      name: "홍길동",
      role: "DRIVER",
      email: "hong@test.com",
      phoneNumber: "010-1234-5678",
      profile: {
        driverId: "drv-001",
        nickname: "홍길동 기사님",
        oneLiner: "고객님의 물품을 소중하고 안전하게 운송합니다.",
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
  },
  {
    user: {
      userId: "user-driver-002",
      name: "이순신",
      role: "DRIVER",
      email: "lee@test.com",
      phoneNumber: "010-2345-6789",
      profile: {
        driverId: "drv-002",
        nickname: "이순신 기사님",
        oneLiner: "안전하고 빠른 이사를 도와드립니다.",
        image: getRandomProfileImage(),
        reviewCount: 31,
        rating: 4.5,
        careerYears: 5,
        confirmedCount: 120,
        driverServiceTypes: ["SMALL_MOVE"],
        driverServiceAreas: ["SEOUL"],
        likes: {
          likedCount: 22,
          isLikedByCurrentUser: false,
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
      quotationId: "q-124",
      departureAddress: "서울시 강남구",
      arrivalAddress: "경기도 성남시",
      quotationStatement: "SUBMITTED",
      price: 190000,
      moveAt: "2025-10-15",
      createdAt: "2025-09-26",
    },
  },
];

export default function ReceivedPage() {
  const [quotations, setQuotations] = useState(mockQuotations);

  return (
    <div className="estimate-container flex min-h-[calc(100vh-80px)] flex-col">
      <div className="flex flex-grow flex-col">
        <TabNavigation tabs={CONSUMER_TAB_LIST} />
        <div className="mx-auto flex w-full flex-col gap-4 py-6 lg:max-w-[1400px] lg:flex-row lg:justify-between lg:gap-8 lg:px-0">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold md:text-2xl">소형이사</h3>
            <p className="text-sm text-gray-500 md:text-base">견적 신청일: 2024년 6월 24일</p>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:gap-6">
            <dl className="flex justify-between gap-4 md:flex-col md:justify-center md:gap-1">
              <dt className="w-[78px] text-gray-500">출발지</dt>
              <dd>서울 중구 삼일대로 343</dd>
            </dl>
            <dl className="flex justify-between gap-4 md:flex-col md:justify-center md:gap-1">
              <dt className="w-[78px] text-gray-500">도착지</dt>
              <dd>서울 중구 삼일대로 343</dd>
            </dl>
            <dl className="flex justify-between gap-4 md:flex-col md:justify-center md:gap-1">
              <dt className="w-[78px] text-gray-500">이용일</dt>
              <dd>2024. 08. 26(월)</dd>
            </dl>
          </div>
        </div>
        <div className="flex-grow bg-gray-200 py-6 lg:py-12">
          <div className="mx-auto grid gap-4 px-4 lg:max-w-[1400px] lg:grid-cols-2 lg:gap-6 lg:px-0">
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
    </div>
  );
}
