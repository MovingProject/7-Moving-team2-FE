"use client";

import Image from "next/image";
import CardText from "@/components/ui/card/CardText";
import LikeButton from "@/components/ui/LikeButton";
import { LikedDriver } from "@/utils/hook/liked/useLikedQuery";
import UserIcon from "@/assets/icon/user.svg";

export default function LikedDriverProfile({ driver }: { driver: LikedDriver }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-100 bg-white px-3 py-2">
      {/* 왼쪽: 프로필 + 정보 */}
      <div className="flex items-center gap-3 overflow-hidden">
        {/* 프로필 이미지 */}
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-gray-200">
          <Image
            src={driver.avatarUrl || "/assets/icon/user.svg"}
            alt={driver.nickname}
            fill
            className="object-cover"
          />
        </div>
        {/* 이름 + 정보 */}
        <div className="flex flex-col justify-center gap-2">
          <CardText className="text-[13px] leading-none font-semibold text-gray-900">
            {driver.nickname}
          </CardText>
        </div>
      </div>

      {/* 오른쪽: 좋아요 버튼 */}
      <LikeButton count={driver.likeCount} className="ml-auto scale-[0.85]" />
    </div>
  );
}
