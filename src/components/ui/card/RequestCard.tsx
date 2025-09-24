"use client";
import React from "react";
import clsx from "clsx";
import BaseCard from "./BaseCard";
import { CardSize, CardLayoutSize, TagData } from "./CardContext";
import Tag from "../Tag";
import TechnicianProfile from "../profile/TechnicianProfile";
import MovingInfoViewer, { MovingInfo } from "../profile/MovingInfoViewer";
import Button from "../Button";

interface RequestCardProps {
  size?: CardSize;
  layoutSize?: CardLayoutSize;
  time: string;
  tags: TagData[];
  profileData: {
    name: string;
    movingInfo: MovingInfo;
  };
  isCompleted?: boolean;
}

const layoutizeClasses: Record<CardLayoutSize, string> = {
  sm: "px-[14px] py-4 gap-4 max-w-[327px]",
  md: "px-[14px] py-4 gap-4 max-w-[600px]",
  lg: "px-6 py-5 gap-4 max-w-[995px]",
  xl: "px-6 py-5 gap-4 w-full",
};

export default function RequestCard({
  layoutSize = "xl",
  size = "md",
  tags,
  time,
  profileData,
  isCompleted = false,
}: RequestCardProps) {
  const layoytClasses = layoutSize === "sm" || layoutSize === "md" ? "flex-col" : "";

  const cardClasses = clsx("bg-white border border-gray-200", layoutizeClasses[layoutSize]);

  return (
    <BaseCard size={size} layoutSize={layoutSize} className={cardClasses}>
      <div className="flex justify-between">
        <div className="flex gap-2">
          {tags.map((tag, index) => (
            <Tag key={index} type={tag.type} content={tag.content} />
          ))}
        </div>
        <span className="text-sm text-gray-400">{time}</span>
      </div>
      <TechnicianProfile profile={profileData} size={size} show={["name"]} />
      <MovingInfoViewer info={profileData.movingInfo} infoType="route" />

      <div className={clsx("flex gap-2", layoytClasses)}>
        <Button size="sm" textSize="mobile" text="견적 보내기" />
        <Button size="sm" textSize="mobile" variant="secondary" text="반려" />
      </div>
    </BaseCard>
  );
}
