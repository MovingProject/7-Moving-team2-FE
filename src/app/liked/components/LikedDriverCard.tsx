"use client";

import React from "react";
import { LikedDriver } from "@/utils/hook/likes/useLikedQuery";
import { MoveTypeMap } from "@/types/moveTypes";
import { IconType } from "@/components/ui/Tag";
import Tag from "@/components/ui/Tag";
import LikedDriverProfile from "./LikedDriverProfile";
import LikedDriverInfo from "./LikedDriverInfo";
import CardText from "@/components/ui/card/CardText";
import { useUnlikeDriver } from "@/utils/hook/likes/useUnlike";
import Popup from "@/components/ui/Popup";
import LikeButton from "@/components/ui/LikeButton";

export default function LikedDriverCard({
  driver,
  onClickAction,
}: {
  driver: LikedDriver;
  onClickAction?: () => void;
}) {
  const { mutate: unlikeDriver } = useUnlikeDriver();
  const [showPopup, setShowPopup] = React.useState(false);
  const [liked, setLiked] = React.useState(true);
  const [count, setCount] = React.useState(driver.likeCount);
  const handleUnlike = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 즉시 UI 반영 (낙관적 업데이트)
    setLiked(false);
    setCount((prev) => Math.max(0, prev - 1));

    // 서버에 실제 요청
    unlikeDriver(driver.id, {
      onSuccess: () => {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 1500);
      },
      onError: () => {
        // 실패 시 되돌림
        setLiked(true);
        setCount(driver.likeCount);
      },
    });
  };
  return (
    <div
      onClick={onClickAction}
      className="flex cursor-pointer flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      {/* 상단 프로필, 좋아요 */}
      <div className="flex items-center justify-between">
        <LikedDriverProfile driver={driver} />
        <LikeButton isLiked={liked} count={count} className="scale-[0.85]" onClick={handleUnlike} />
      </div>

      {/* 서비스 태그 */}
      <div className="flex flex-wrap gap-1">
        {driver.serviceTypes.map((type, index) => (
          <Tag
            key={index}
            type={
              MoveTypeMap[type as keyof typeof MoveTypeMap].clientType.toLowerCase() as IconType
            }
            content={MoveTypeMap[type as keyof typeof MoveTypeMap].content}
          />
        ))}
      </div>

      {/* 한줄 소개 */}
      {driver.oneLiner && (
        <CardText className="line-clamp-2 text-xs font-medium text-gray-700">
          {driver.oneLiner}
        </CardText>
      )}

      {/* 하단 정보 */}
      <LikedDriverInfo driver={driver} />

      {showPopup && (
        <div className="absolute top-[70px] left-1/2 z-50 flex w-full -translate-x-1/2 justify-center">
          <Popup
            type="info"
            message="찜한 기사님이 해제되었습니다."
            onClose={() => setShowPopup(false)}
          />
        </div>
      )}
    </div>
  );
}
