"use client";

import React from "react";
import Image from "next/image";
import CardText from "@/components/ui/card/CardText";
import { LikedDriver } from "@/utils/hook/likes/useLikedQuery";
import { useUnlikeDriver } from "@/utils/hook/likes/useUnlike";
import LikedDriverInfo from "./LikedDriverInfo";
import UserIcon from "@/assets/icon/user.svg";

export default function CompactLikedDriverProfile({ driver }: { driver: LikedDriver }) {
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
    <div className="flex w-full items-center justify-between rounded-md bg-white px-3 py-2">
      {/* 왼쪽: 프로필 + 정보 */}
      <div className="flex items-center gap-3 overflow-hidden">
        {/* 프로필 이미지 */}
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-gray-200">
          <Image
            src={driver.avatarUrl || "/assets/icon/user.svg"}
            alt={driver.nickname}
            width={24}
            height={24}
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
    </div>
  );
}
