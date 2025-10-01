"use client";
import React, { useMemo } from "react";
import BaseCard, { CommonCardProps } from "./BaseCard";
import CardText from "./CardText";
import MovingInfoViewer, { MovingInfo } from "../profile/MovingInfoViewer";
import Button from "../Button";
import UserProfileArea from "../profile/UserProfileArea";
import { DriverUser } from "@/types/card";
import { isDriverUser } from "@/utils/type-guards";
import { AreaMap, AreaType } from "@/types/areaTypes";
import { MoveTypeMap } from "@/types/moveTypes";

export default function ProfileCard({ user }: CommonCardProps) {
  const isDriver = isDriverUser(user);

  const driverUser = user as DriverUser;
  const profileData = driverUser.profile;
  const movingInfo: MovingInfo = useMemo(() => {
    const info: MovingInfo = {
      serviceTypes: profileData?.driverServiceTypes?.map((service) => MoveTypeMap[service].content),
      serviceAreas: profileData?.driverServiceAreas?.map((areaKey) => AreaMap[areaKey as AreaType]),
      reviewCount: profileData?.reviewCount,
      rating: profileData?.rating,
      careerYears: profileData?.careerYears,
      confirmedCount: profileData?.confirmedCount,
    };

    return info;
  }, [profileData]);
  if (!isDriver) {
    return null;
  }
  return (
    <BaseCard className="relative lg:gap-6 lg:rounded-xl lg:border lg:border-gray-300 lg:bg-gray-100 lg:p-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 rounded-2xl border border-gray-300 bg-white px-3 py-4 lg:hidden">
          <UserProfileArea user={user} show={["name", "oneLiner"]} />
          {movingInfo && (
            <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-[10px]">
              <MovingInfoViewer info={movingInfo} infoType="review" />
              <MovingInfoViewer info={movingInfo} infoType="driverService" />
            </div>
          )}
        </div>
        <div className="hidden lg:flex lg:flex-col lg:gap-4">
          <div className="flex max-w-1/2 flex-col gap-2">
            {user.name && <CardText className="text-2xl">{user.name}</CardText>}
            {profileData?.oneLiner && (
              <CardText className="text-gray-600">{profileData.oneLiner}</CardText>
            )}
          </div>
          <UserProfileArea
            user={user}
            show={["services", "reviews"]}
            className="rounded-2xl border border-gray-300 bg-gray-200 px-[18px] py-6"
          />
        </div>
        <div className="lg: flex flex-col gap-2 lg:absolute lg:top-6 lg:right-6 lg:flex-row">
          <Button
            size="sm"
            textSize="mobile"
            variant="secondary"
            text="기본 정보 수정"
            className="lg:w-[160px]"
          />
          <Button size="sm" textSize="mobile" text="내 프로필 수정" className="lg:w-[160px]" />
        </div>
      </div>
    </BaseCard>
  );
}
