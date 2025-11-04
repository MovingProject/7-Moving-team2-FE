"use client";

import React from "react";
import { LikedDriver } from "@/utils/hook/likes/useLikedQuery";
import { MoveTypeMap } from "@/types/moveTypes";
import Tag from "@/components/ui/Tag";
import LikedDriverProfile from "./LikedDriverProfile";
import CardText from "@/components/ui/card/CardText";

export default function LikedDriverCard({
  driver,
  onClickAction,
  setPopupAction,
}: {
  driver: LikedDriver;
  onClickAction?: () => void;
  setPopupAction: (popup: { type: "info" | "warning"; message: string } | null) => void;
}) {
  return (
    <div
      onClick={onClickAction}
      className="flex cursor-pointer flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex flex-wrap gap-1">
        {driver.serviceTypes.map((type, index) => (
          <Tag
            key={index}
            type={MoveTypeMap[type as keyof typeof MoveTypeMap].clientType}
            content={MoveTypeMap[type as keyof typeof MoveTypeMap].content}
          />
        ))}
      </div>
      {driver.oneLiner && (
        <CardText className="line-clamp-2 text-xs font-medium text-gray-700">
          {driver.oneLiner ?? "한 줄 소개가 없습니다."}
        </CardText>
      )}
      <div className="flex items-center">
        <LikedDriverProfile driver={driver} setPopupAction={setPopupAction} />
      </div>
    </div>
  );
}
