"use client";
import React from "react";
import { RequestDetail } from "@/types/request";
import { MoveTypeMap, MoveType } from "@/types/moveTypes";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface Props {
  data: RequestDetail;
}

const getMoveTypeDisplayName = (typeKey: MoveType | undefined | null): string => {
  if (!typeKey) return "-";
  const item = Object.values(MoveTypeMap).find((item) => item.clientType === typeKey);
  return item ? item.content : typeKey;
};

const formatDate = (isoDate: string): string => {
  if (!isoDate) return "-";
  try {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    };
    const formatted = date.toLocaleDateString("ko-KR", options);
    return formatted.replace(/요일$/, "").replace(/ (\S)$/, " ($1)");
  } catch {
    return isoDate;
  }
};

export default function RequestCompletePage({ data }: Props) {
  const router = useRouter();
  const moveType = getMoveTypeDisplayName(data.serviceType);
  const moveDate = formatDate(data.moveAt);

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-[600px] rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-primary mb-6 text-center text-2xl font-bold">진행 중인 견적 요청</h2>
        <p className="mb-6 text-center text-gray-600">
          현재 진행 중인 일반 견적 요청 내역입니다.
          <br />
          기사님들과 채팅을 통해 이사를 확정하세요!
        </p>

        {/* 요청 내역 카드 */}
        <div className="mb-6 rounded-lg border border-gray-300 bg-gray-50 p-5">
          <h3 className="mb-3 text-lg font-semibold text-gray-900">요청 내역</h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-medium">이사 종류:</span> {moveType}
            </p>
            <p>
              <span className="font-medium">이사 일자:</span> {moveDate}
            </p>
            <div className="mt-3">
              <p className="truncate">
                <span className="font-medium">출발지:</span> {data.departureAddress}
              </p>
              <p className="ml-12.5 text-sm text-gray-600">
                {data.departureFloor ? `${data.departureFloor}층, ` : ""}
                {data.departurePyeong ? `${data.departurePyeong}평, ` : ""}
                {data.departureElevator ? "엘리베이터 있음" : "엘리베이터 없음"}
              </p>
            </div>
            <div className="mt-3">
              <p className="truncate">
                <span className="font-medium">도착지:</span> {data.arrivalAddress}
              </p>
              <p className="ml-12.5 text-sm text-gray-600">
                {data.arrivalFloor ? `${data.arrivalFloor}층, ` : ""}
                {data.arrivalPyeong ? `${data.arrivalPyeong}평, ` : ""}
                {data.arrivalElevator ? "엘리베이터 있음" : "엘리베이터 없음"}
              </p>
            </div>
            {data.additionalRequirements && (
              <p>
                <span className="font-medium">추가 요청사항:</span> {data.additionalRequirements}
              </p>
            )}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col gap-3">
          <Button variant="primary" text="기사님 찾기" onClick={() => router.push("/driverList")} />
          <Button variant="secondary" text="메인으로 돌아가기" onClick={() => router.push("/")} />
        </div>
      </div>
    </main>
  );
}
