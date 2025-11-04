"use client";

import React from "react";
import Image from "next/image";
import CardText from "@/components/ui/card/CardText";
import LikeButton from "@/components/ui/LikeButton";
import { LikedDriver } from "@/utils/hook/likes/useLikedQuery";
import { useUnlikeDriver } from "@/utils/hook/likes/useUnlike";
import LikedDriverInfo from "./LikedDriverInfo";

export default function LikedDriverProfile({
  driver,
  setPopupAction,
}: {
  driver: LikedDriver;
  setPopupAction: (popup: { type: "info" | "warning"; message: string } | null) => void;
}) {
  const { mutate: unlikeDriver } = useUnlikeDriver();
  const [liked, setLiked] = React.useState(true);
  const [count, setCount] = React.useState(driver.likeCount);

  const handleUnlike = (e: React.MouseEvent) => {
    e.stopPropagation();

    setLiked(false);
    setCount((prev) => Math.max(0, prev - 1));

    unlikeDriver(driver.id, {
      onSuccess: () => {
        setPopupAction({
          type: "info",
          message: "찜한 기사님이 해제되었습니다.",
        });
      },
      onError: () => {
        setLiked(true);
        setCount(driver.likeCount);
        setPopupAction({
          type: "warning",
          message: "찜 해제 중 오류가 발생했습니다.",
        });
      },
    });
  };

  return (
    <div className="flex w-full items-center justify-between rounded-md border border-gray-100 bg-white px-3 py-2">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border">
          <Image
            src={driver.avatarUrl || "/assets/icon/user.svg"}
            alt={driver.nickname}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <CardText className="text-xs leading-none font-semibold text-gray-900 lg:text-base">
            {driver.nickname}
          </CardText>
          <LikedDriverInfo driver={driver} />
        </div>
      </div>
      <LikeButton isLiked={liked} count={count} className="scale-[0.85]" onClick={handleUnlike} />
    </div>
  );
}
