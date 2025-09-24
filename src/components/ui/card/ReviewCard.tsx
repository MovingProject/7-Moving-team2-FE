"use client";
import React from "react";
import clsx from "clsx";
import BaseCard from "./BaseCard";
import { CardSize, CardLayoutSize, TagData } from "./CardContext";
import CardText from "./CardText";
import Tag from "../Tag";
import TechnicianProfile from "../profile/TechnicianProfile";
import { MovingInfo } from "../profile/MovingInfoViewer";
import Button from "../Button";

interface ReviewCardProps {
  size?: CardSize;
  layoutSize?: CardLayoutSize;
  time: string;
  tags: TagData[];
  profileData: {
    name: string;
    imageUrl: string;
    movingInfo: MovingInfo;
  };
  messages: string;
}

const layoutizeClasses: Record<CardLayoutSize, string> = {
  sm: "px-[14px] py-4 gap-4 max-w-[327px]",
  md: "px-[14px] py-4 gap-4 max-w-[600px]",
  lg: "px-6 py-5 gap-4 max-w-[995px]",
  xl: "px-6 py-5 gap-4 w-full",
};

export default function ReviewCard({
  layoutSize = "xl",
  size = "md",
  tags,
  time,
  profileData,
  messages,
}: ReviewCardProps) {
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
      <TechnicianProfile profile={profileData} size={size} show={["name", "estimated"]} />
      {messages ? (
        <p className="text-sm text-gray-600">{messages}</p>
      ) : (
        <div>
          <Button size="sm" textSize="mobile" text="리뷰 작성" />
        </div>
      )}
    </BaseCard>
  );
}
