"use client";

import React from "react";
import { LikedDriver } from "@/utils/hook/likes/useLikedQuery";
import { MoveTypeMap } from "@/types/moveTypes";
import { IconType } from "@/components/ui/Tag";
import Tag from "@/components/ui/Tag";
import LikedDriverProfile from "./LikedDriverProfile";
import CardText from "@/components/ui/card/CardText";

export default function LikedDriverCard({
  driver,
  onClickAction,
}: {
  driver: LikedDriver;
  onClickAction?: () => void;
}) {
  return (
    <div
      onClick={onClickAction}
      className="flex cursor-pointer flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
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
          {driver.oneLiner ?? "한 줄 소개가 없습니다."}
        </CardText>
      )}
      {/* 상단 프로필 */}
      <div className="flex items-center">
        <LikedDriverProfile driver={driver} />
      </div>
    </div>
  );
}
