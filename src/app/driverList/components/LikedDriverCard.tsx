"use client";

import React from "react";
import BaseCard, { CommonCardProps } from "@/components/ui/card/BaseCard";
import CardText from "@/components/ui/card/CardText";
import Tag from "@/components/ui/Tag";
import UserProfileArea from "@/components/ui/profile/UserProfileArea";
import { DriverProfileData, DriverUser } from "@/types/card";
import { MoveTypeMap } from "@/types/moveTypes";
import { isDriverUser } from "@/utils/type-guards";
import { IconType } from "@/components/ui/Tag";

export default function LikedDriverCard({ user, request, quotation }: CommonCardProps) {
  const isDriver = isDriverUser(user);
  if (!isDriver) return null;

  const driverUser = user as DriverUser;
  const profileData = driverUser.profile as DriverProfileData;
  const { oneLiner, driverServiceTypes } = profileData;

  return (
    <BaseCard className="gap-2 border border-gray-200 bg-white p-3 transition hover:shadow-sm">
      {/* 서비스 태그 (작게 줄임) */}
      <div className="mb-1 flex gap-1">
        {driverServiceTypes?.map((tag, index) => (
          <Tag
            key={index}
            type={MoveTypeMap[tag].clientType.toLowerCase() as IconType}
            content={MoveTypeMap[tag].content}
          />
        ))}
      </div>

      {/* 한줄소개 */}
      {oneLiner && (
        <CardText className="line-clamp-1 text-xs font-medium text-gray-700">{oneLiner}</CardText>
      )}

      {/* 프로필 영역 (이름, 리뷰, 좋아요) */}
      <UserProfileArea
        user={user}
        request={request}
        quotation={quotation}
        show={["name", "reviews", "likes"]}
        className="rounded-md border border-gray-100 p-2"
      />
    </BaseCard>
  );
}
