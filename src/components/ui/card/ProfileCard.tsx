"use client";
import React from "react";
import clsx from "clsx";
import BaseCard from "./BaseCard";
import { CardSize, CardLayoutSize, TagData } from "./CardContext";
import CardText from "./CardText";
import Tag from "../Tag";
import TechnicianProfile from "../profile/TechnicianProfile";
import MovingInfoViewer, { MovingInfo } from "../profile/MovingInfoViewer";
import Button from "../Button";

interface ProfileCardProps {
  size?: CardSize;
  layoutSize?: CardLayoutSize;
  profileData: {
    greeting: string;
    services: string[];
    locals: string[];
    name: string;
    imageUrl: string;
    movingInfo?: MovingInfo;
  };
}

const layoutizeClasses: Record<CardLayoutSize, string> = {
  sm: "bg-white border rounded-2xl border-gray-200 px-3 py-4 gap-2",
  md: "bg-white border rounded-2xl border-gray-200 border bpx-[14px] py-4 gap-4",
  lg: "p-6 gap-6 max-w-[1400px]",
  xl: "p-6 gap-6 w-full",
};

export default function ProfileCard({
  layoutSize = "xl",
  size = "md",
  profileData,
}: ProfileCardProps) {
  const cardClasses = clsx(layoutizeClasses[layoutSize]);
  const isCompact = layoutSize === "sm" || layoutSize === "md";

  return (
    <BaseCard size={size} layoutSize={layoutSize}>
      <div className="flex flex-col gap-2">
        {/* ✅ layoutSize에 따라 다른 마크업 렌더링 */}
        {isCompact ? (
          <div
            className={`flex flex-col gap-2 ${layoutSize === "sm" ? "max-w-[327px]" : "max-w-[600px]"}`}
          >
            {/* sm, md 레이아웃일 때 */}
            <div className={clsx("flex flex-col gap-2", cardClasses)}>
              <TechnicianProfile
                profile={{
                  name: profileData.name,
                  imageUrl: profileData.imageUrl,
                  greeting: profileData.greeting,
                }}
                show={["name", "greeting"]}
              />
              {profileData.movingInfo && (
                <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-[10px]">
                  <MovingInfoViewer info={profileData.movingInfo} infoType="review" />
                  <MovingInfoViewer info={profileData.movingInfo} infoType="localservice" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" textSize="mobile" variant="secondary" text="기본 정보 수정" />
              <Button size="sm" textSize="mobile" text="내 프로필 수정" />
            </div>
          </div>
        ) : (
          <div className={clsx("border border-gray-200 bg-white", cardClasses)}>
            {/* lg, xl 등 다른 레이아웃일 때 */}
            <div className="flex justify-between">
              <div>
                {profileData.name && <CardText>{profileData.name}</CardText>}
                {profileData.greeting && <CardText>{profileData.greeting}</CardText>}
              </div>
              <div className="flex gap-2">
                <Button size="md" textSize="mobile" variant="secondary" text="기본 정보 수정" />
                <Button size="md" textSize="mobile" text="내 프로필 수정" />
              </div>
            </div>
            <TechnicianProfile
              profile={profileData}
              show={["services", "movingInfo"]}
              className="rounded-lg border border-gray-200 p-[10px]"
            />
          </div>
        )}
      </div>
    </BaseCard>
  );
}
