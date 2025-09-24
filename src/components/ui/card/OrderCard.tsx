"use client";

import React from "react";
import clsx from "clsx";
import BaseCard from "./BaseCard";
import { CardSize, CardLayoutSize, TagData } from "./CardContext";
import CardText from "./CardText";
import Tag from "../Tag";
import TechnicianProfile from "../profile/TechnicianProfile";
import Button from "../Button";
import { MovingInfo } from "../profile/MovingInfoViewer";

interface OrderCardProps {
  size?: CardSize;
  layoutSize?: CardLayoutSize;
  price: number;
  profileData: {
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
  sm: "px-3 py-5 gap-2 max-w-[327px]",
  md: "px-3 py-[22px] gap-[14px] max-w-[600px]",
  lg: "px-6 py-7 gap-6 max-w-[688px]",
  xl: "px-6 py-7 gap-6 w-full",
};

export default function OrderCard({
  layoutSize = "xl",
  size = "md",
  price,
  profileData: { tags, ...restProfileData },
}: OrderCardProps) {
  const cardClasses = clsx("bg-white border border-gray-200", layoutizeClasses[layoutSize]);

  return (
    <BaseCard size={size} layoutSize={layoutSize} className={cardClasses}>
      <div className="flex justify-between">
        <div className="flex gap-2">
          {tags.map((tag, index) => (
            <Tag key={index} type={tag.type} content={tag.content} />
          ))}
        </div>
      </div>

      <TechnicianProfile profile={restProfileData} show={["name", "movingInfo", "likes"]} />

      <div className="flex justify-end">
        <CardText>
          견적 금액 <span className="font-semibold">{price.toLocaleString()}원</span>
        </CardText>
      </div>

      <div className="flex gap-2">
        <Button size="sm" textSize="mobile" text="견적 제출하기" />
        <Button size="sm" textSize="mobile" variant="secondary" text="상세보기" />
      </div>
    </BaseCard>
  );
}
