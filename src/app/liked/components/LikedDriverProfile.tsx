"use client";

import React from "react";
import Image from "next/image";
import CardText from "@/components/ui/card/CardText";
import LikeButton from "@/components/ui/LikeButton";
import { LikedDriver } from "@/utils/hook/likes/useLikedQuery";
import { useUnlikeDriver } from "@/utils/hook/likes/useUnlike";
import LikedDriverInfo from "./LikedDriverInfo";
import Popup from "@/components/ui/Popup";
import UserIcon from "@/assets/icon/user.svg";

export default function LikedDriverProfile({ driver }: { driver: LikedDriver }) {
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
    <div className="flex w-full items-center justify-between rounded-md border border-gray-100 bg-white px-3 py-2">
      {/* 왼쪽: 프로필 + 정보 */}
      <div className="flex items-center gap-3 overflow-hidden">
        {/* 프로필 이미지 */}
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-gray-200">
          <Image
            src={driver.avatarUrl || "/assets/icon/user.svg"}
            alt={driver.nickname}
            width={12}
            height={12}
            className="object-cover"
          />
        </div>
        {/* 이름 + 정보 */}
        <div className="flex flex-col justify-center gap-2">
          <CardText className="text-[13px] leading-none font-semibold text-gray-900">
            {driver.nickname}
          </CardText>
          {/* 하단 정보 */}
          <LikedDriverInfo driver={driver} />
        </div>
      </div>

      {/* 오른쪽: 좋아요 버튼 */}
      <LikeButton isLiked={liked} count={count} className="scale-[0.85]" onClick={handleUnlike} />
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
