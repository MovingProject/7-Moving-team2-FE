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
import DefaultModal from "@/components/ui/Modal/DefaultModal";
import { useLikeDriver } from "@/utils/hook/likes/useLikeQuery";

export default function DriverDetailPage() {
  const [driver, setDriver] = useState<{ user: DriverUser; request: RequestData } | null>(null);
  const [popup, setPopup] = useState<{ type: "info" | "warning"; message: string } | null>(null);
  const { mutate: likeMutate, isPending } = useLikeDriver();

  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const stored = sessionStorage.getItem("selectedDriver");
    if (stored) {
      setDriver(JSON.parse(stored));
    }
  }, []);

  const handleLikeClick = () => {
    if (!driver?.user?.userId) return;

    likeMutate(driver.user.userId, {
      onSuccess: (res) => {
        if (res.liked) {
          setPopup({ type: "info", message: "찜한 기사님 목록에 추가되었습니다." });
        } else {
          setPopup({ type: "warning", message: "이미 찜한 기사님입니다." });
        }
      },
      onError: () => {
        setPopup({ type: "warning", message: "찜하기 중 오류가 발생했습니다." });
      },
    });
  };

  if (!driver || !driver.user.profile) {
    return <p className="py-20 text-center text-gray-400">기사님 정보를 불러오는 중...</p>;
  }

  const user = driver.user;
  const profile = driver.user.profile as DriverProfileData;
  const request = driver.request;

  return (
    <main className="min-h-screen w-full bg-white px-8 py-10 md:px-20 lg:px-5 xl:px-60">
      {popup && (
        <div className="absolute top-[70px] left-1/2 z-50 flex w-full -translate-x-1/2 justify-center">
          <Popup type={popup.type} message={popup.message} onClose={() => setPopup(null)} />
        </div>
      )}
      <DefaultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="지정 견적 요청하기"
        buttonText="일반 견적 요청하기"
        onButtonClick={() => setIsModalOpen(false)}
      >
        <p className="text-gray-700">일반 견적 요청을 먼저 진행해 주세요.</p>
      </DefaultModal>

      <section className="flex flex-col gap-10 lg:flex-row">
        <div className="flex flex-[0.65] flex-col gap-10">
          <DefaultCard user={user} request={request} />
          {/* 공유 영역 (lg 미만에서는 이쪽으로 내려옴) */}
          <div className="block lg:hidden">
            <ShareSection setPopup={setPopup} />
          </div>
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
          {/* 페이지 하단 (모바일용 하단 버튼) */}
          <div className="mt-8 flex items-center justify-between lg:hidden">
            {/* 찜하기: 작은 하트 버튼 */}
            <Button
              variant="secondary"
              text="❤"
              className="border border-gray-300 p-3 hover:bg-gray-50"
              onClick={handleLikeClick}
              disabled={isPending}
            />
            {/* 지정 견적 요청하기 */}
            <Button
              variant="primary"
              text="지정 견적 요청하기"
              className="ml-3 flex-1"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
        <div className="hidden flex-[0.35] flex-shrink-0 flex-col gap-6 lg:block">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {user.name} 기사님에게 지정 견적을 요청해보세요!
            </h3>
            <Button
              variant="secondary"
              text="❤ 기사님 찜하기"
              onClick={handleLikeClick}
              disabled={isPending}
            />
            <Button
              variant="primary"
              text="지정 견적 요청하기"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div>
            <ShareSection setPopup={setPopup} />
          </div>
        </div>
      </section>
    </main>
  );
}
