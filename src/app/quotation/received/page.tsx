"use client";

import { useEffect, useState } from "react";
import { getRandomProfileImage } from "@/utils/constant/getProfileImage";
import { UserData, RequestData, QuotationData } from "@/types/card";
import TabNavigation from "../components/TabNavigation";
import { CONSUMER_TAB_LIST } from "@/types/tabs";
import QuotationArea from "./components/QuotationArea";

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

  // useEffect(() => {
  //   async function fetchData() {}

  //   fetchData();
  // }, []);
  return (
    <div className="estimate-container flex min-h-[calc(100vh-80px)] flex-col">
      <div className="flex flex-grow flex-col">
        <TabNavigation tabs={CONSUMER_TAB_LIST} />
        <div className="flex-grow bg-gray-200 py-6 lg:py-12">
          <div className="mx-auto flex w-full flex-col gap-4 lg:max-w-[1400px] lg:gap-8 lg:px-0">
            <QuotationArea
              quotations={mockQuotations}
              selectedSort="전체"
              onSortChange={(value) => console.log("정렬 변경:", value)}
            />
            <QuotationArea
              quotations={mockQuotations}
              selectedSort="전체"
              onSortChange={(value) => console.log("정렬 변경:", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
