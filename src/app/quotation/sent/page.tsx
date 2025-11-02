import React from "react";
import TabNavigation from "../components/TabNavigation";
import { DRIVER_TAB_LIST } from "@/types/tabs";
import RequestCard from "@/components/ui/card/RequestCard";
import { UserData, RequestData, QuotationData } from "@/types/card";

export default function QuotationSentPage() {
  const BASE_PATH = "/quotation/sent";
  const requestCardData: {
    user: UserData;
    request: RequestData;
    quotation?: QuotationData;
  } = {
    user: {
      userId: "user-consumer-001",
      name: "김철수",
      role: "CONSUMER",
      email: "kim@test.com",
      phoneNumber: "010-9876-5432",
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
      quotationStatement: "CONCLUDED",
    },
  };
  const requestCardData2: {
    user: UserData;
    request: RequestData;
    quotation?: QuotationData;
  } = {
    user: requestCardData.user,
    request: {
      ...requestCardData.request,
      requestStatement: "COMPLETE",
    },
  };
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col">
      <div className="flex flex-grow flex-col">
        <TabNavigation tabs={DRIVER_TAB_LIST} />
        <section className="flex-grow bg-gray-200 py-6 lg:py-12">
          <div className="mx-auto grid gap-4 px-4 lg:max-w-[1400px] lg:grid-cols-2 lg:gap-6 lg:px-0">
            <RequestCard
              user={requestCardData.user}
              request={requestCardData.request}
              quotation={requestCardData.quotation}
            />
            <RequestCard
              user={requestCardData2.user}
              request={requestCardData2.request}
              quotation={requestCardData2.quotation}
            />
            <RequestCard
              user={requestCardData2.user}
              request={requestCardData2.request}
              quotation={requestCardData2.quotation}
            />
            <RequestCard
              user={requestCardData2.user}
              request={requestCardData2.request}
              quotation={requestCardData2.quotation}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
