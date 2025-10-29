"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { AxiosError } from "axios";
import Button from "@/components/ui/Button";
import { AreaType, AreaMap } from "@/types/areaTypes";
import { MoveType, MoveTypeMap } from "@/types/moveTypes";
import DefaultCard from "@/components/ui/card/DefaultCard";
import ReviewContainer from "@/app/mypage/components/ReviewContainer";
import ShareSection from "../components/ShareSection";
import Popup from "@/components/ui/Popup";
import DefaultModal from "@/components/ui/Modal/DefaultModal";
import { useLikeDriver } from "@/utils/hook/likes/useLikeQuery";
import { useDriverDetailQuery } from "@/utils/hook/driver/useDriverDetailQuery";
import {
  mapDriverToCardData,
  mapDriverDetailToDriverListShape,
} from "@/utils/mappers/driverToCardMapper";
import { useInviteDriver } from "@/utils/hook/request/useInviteQuery";
import { useAuthStore } from "@/store/authStore";

export default function DriverDetailPage() {
  const params = useParams();
  const driverId = params?.id as string;
  const { user } = useAuthStore();
  const { data, isLoading } = useDriverDetailQuery(driverId);
  const [popup, setPopup] = useState<{ type: "info" | "warning"; message: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { mutate: likeMutate, isPending } = useLikeDriver();
  const { mutate: inviteDriver, isPending: isInviting } = useInviteDriver();

  const handleLikeClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!driverId) return;
    likeMutate(driverId, {
      onSuccess: (res) =>
        setPopup({
          type: res.liked ? "info" : "warning",
          message: res.liked ? "찜한 기사님 목록에 추가되었습니다." : "이미 찜한 기사님입니다.",
        }),
      onError: () => setPopup({ type: "warning", message: "찜하기 중 오류가 발생했습니다." }),
    });
  };

  const handleInviteClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!driverId) return;
    inviteDriver(driverId, {
      onSuccess: (res) => {
        if (res.alreadyExisted) {
          setPopup({
            type: "warning",
            message: "이미 지정 견적을 요청한 기사님입니다.",
          });
        } else {
          setPopup({
            type: "info",
            message: "지정 견적 요청이 완료되었습니다.",
          });
        }
      },
      onError: (error: unknown) => {
        if (error instanceof AxiosError) {
          const msg = error.response?.data?.message ?? "";

          if (msg.includes("진행중인 요청이 없습니다")) {
            setIsModalOpen(true);
          } else if (msg.includes("일치하지 않습니다")) {
            setPopup({
              type: "warning",
              message: "해당 기사님의 서비스 조건과 일치하지 않습니다.",
            });
          } else {
            setPopup({
              type: "warning",
              message: "지정 견적 요청 수를 초과하였습니다!",
            });
          }
        } else {
          console.error("AxiosError 아님:", error);
          setPopup({
            type: "warning",
            message: "알 수 없는 오류가 발생했습니다.",
          });
        }
      },
    });
  };

  if (isLoading || !data) {
    return <p className="py-20 text-center text-gray-400">기사님 정보를 불러오는 중...</p>;
  }
  const driverListShape = mapDriverDetailToDriverListShape(data);
  const cardData = mapDriverToCardData(driverListShape);
  console.log(" driver detail raw data:", data);

  const renderLoginModal = (
    <DefaultModal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      title="로그인이 필요한 작업입니다"
      buttonText="로그인하기"
      onButtonClick={() => window.location.replace("/login")}
    >
      <p className="text-center text-gray-700">로그인 후에 이용하실 수 있습니다.</p>
    </DefaultModal>
  );

  return (
    <main className="min-h-screen w-full bg-white px-8 py-10 md:px-20 lg:px-5 xl:px-60">
      {renderLoginModal}
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
          <DefaultCard {...cardData} variant="detail" driverDetail={data} />
          {/* 공유 영역 (lg 미만에서는 이쪽으로 내려옴) */}
          <div className="block lg:hidden">
            <ShareSection setPopup={setPopup} />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-900">상세 설명</h2>
            <p className="text-gray-600">
              {data.description ?? "이 기사님은 아직 상세 설명을 등록하지 않았습니다."}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-900">제공 서비스</h2>
            <div className="flex flex-wrap gap-3">
              {data.serviceTypes?.length ? (
                data.serviceTypes.map((type: MoveType) => (
                  <span
                    key={type}
                    className="rounded-full border border-gray-300 px-4 py-1 text-sm"
                  >
                    {MoveTypeMap[type]?.content ?? type}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">등록된 서비스가 없습니다.</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-900">서비스 가능 지역</h2>
            <div className="flex flex-wrap gap-3">
              {data.serviceAreas?.length ? (
                data.serviceAreas.map((area: AreaType) => (
                  <span
                    key={area}
                    className="rounded-full border border-gray-300 px-4 py-1 text-sm"
                  >
                    {AreaMap[area] ?? area}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">등록된 지역이 없습니다.</p>
              )}
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
              onClick={handleInviteClick}
              disabled={isInviting}
            />
          </div>
        </div>
        <div className="hidden flex-[0.35] flex-shrink-0 flex-col gap-6 lg:block">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {data.nickname} 기사님에게 지정 견적을 요청해보세요!
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
              onClick={handleInviteClick}
              disabled={isInviting}
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
