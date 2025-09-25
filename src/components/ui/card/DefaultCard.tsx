"use client";

import React from "react";
import clsx from "clsx";
import BaseCard from "./BaseCard";
import { CardSize, CardLayoutSize, TagData } from "./CardContext";
import CardText from "./CardText";
import Tag from "../Tag";
import TechnicianProfile from "../profile/TechnicianProfile";
import { MovingInfo } from "../profile/MovingInfoViewer";

interface DefaultCardProps {
  size?: CardSize;
  layoutSize?: CardLayoutSize;
  profileData: {
    greeting?: string;
    price?: number;
    tags: TagData[];
    name: string;
    imageUrl: string;
    movingInfo: MovingInfo;
    likes: {
      count: number;
      isLiked: boolean;
    };
  };
}

const layoutizeClasses: Record<CardLayoutSize, string> = {
  sm: "px-[14px] py-4 gap-[14px]",
  md: "px-[14px] py-4 gap-[14px]",
  lg: "px-6 py-5 gap-4",
  xl: "px-6 py-5 gap-4 w-full",
};

export default function DefaultCard({
  layoutSize = "xl",
  size = "md",
  profileData: { greeting, price, tags, ...restProfileData },
}: DefaultCardProps) {
  const cardClasses = clsx(
    "gap-[14px] bg-white border border-gray-200",
    layoutizeClasses[layoutSize]
  );

  return (
    <BaseCard size={size} layoutSize={layoutSize} className={cardClasses}>
      <div className="flex justify-between">
        <div className="flex gap-2">
          {tags.map((tag, index) => (
            <Tag key={index} type={tag.type} content={tag.content} />
          ))}
        </div>
      </div>

      {greeting && <CardText className="text-sm font-semibold lg:text-xl">{greeting}</CardText>}

      <TechnicianProfile
        profile={restProfileData}
        show={["name", "reviews", "likes"]}
        className="rounded-lg border border-gray-200 p-[10px]"
      />
      {price && (
        <div className="flex justify-end">
          <CardText className="text-lg lg:text-xl">
            견적 금액 <span className="font-semibold">{price.toLocaleString()}원</span>
          </CardText>
        </div>
      )}
    </BaseCard>
  );
}
