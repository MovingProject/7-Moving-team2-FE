"use client";

import { useEffect, useState } from "react";
import DefaultCard from "@/components/ui/card/DefaultCard";
import Button from "@/components/ui/Button";
import { DriverUser, RequestData, DriverProfileData } from "@/types/card";
import { AreaType } from "@/types/areaTypes";
import { MoveType } from "@/types/moveTypes";
import ReviewContainer from "@/app/mypage/components/ReviewContainer";
import ShareSection from "../components/ShareSection";
import Popup from "@/components/ui/Popup";

export default function DriverDetailPage() {
  const [driver, setDriver] = useState<{ user: DriverUser; request: RequestData } | null>(null);
  const [popup, setPopup] = useState<{ type: "info" | "warning"; message: string } | null>(null);
  useEffect(() => {
    const stored = sessionStorage.getItem("selectedDriver");
    if (stored) {
      setDriver(JSON.parse(stored));
    }
  }, []);

  if (!driver || !driver.user.profile) {
    return <p className="py-20 text-center text-gray-400">기사님 정보를 불러오는 중...</p>;
  }

  const user = driver.user;
  const profile = driver.user.profile as DriverProfileData;
  const request = driver.request;

  return (
    <main className="min-h-screen w-full bg-white px-[260px] py-10">
      {popup && (
        <div className="absolute top-[70px] left-1/2 z-50 flex w-full -translate-x-1/2 justify-center">
          <Popup type={popup.type} message={popup.message} onClose={() => setPopup(null)} />
        </div>
      )}
      <section className="flex gap-10">
        <div className="flex flex-[0.65] flex-col gap-10">
          <DefaultCard user={user} request={request} />
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-900">상세 설명</h2>
            <p className="text-gray-600">
              {profile.oneLiner ?? "이 기사님은 아직 상세 설명을 등록하지 않았습니다."}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-900">제공 서비스</h2>
            <div className="flex flex-wrap gap-3">
              {(profile.driverServiceTypes ?? []).map((type: MoveType) => (
                <span key={type} className="rounded-full border border-gray-300 px-4 py-1 text-sm">
                  {type === "SMALL_MOVE"
                    ? "소형이사"
                    : type === "HOME_MOVE"
                      ? "가정이사"
                      : "사무실이사"}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-900">서비스 가능 지역</h2>
            <div className="flex flex-wrap gap-3">
              {(profile.driverServiceAreas ?? []).map((area: AreaType) => (
                <span key={area} className="rounded-full border border-gray-300 px-4 py-1 text-sm">
                  {area === "SEOUL" ? "서울" : area === "GYEONGGI" ? "경기" : area}
                </span>
              ))}
            </div>
          </div>
          {/* 리뷰 영역 */}
          <div className="flex flex-col gap-6">
            <ReviewContainer />
          </div>
        </div>
        <div className="flex flex-[0.35] flex-shrink-0 flex-col gap-6">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {user.name} 기사님에게 지정 견적을 요청해보세요!
            </h3>
            <Button variant="secondary" text="❤ 기사님 찜하기" />
            <Button variant="primary" text="지정 견적 요청하기" />
          </div>
          <div>
            <ShareSection setPopup={setPopup} />
          </div>
        </div>
      </section>
    </main>
  );
}
