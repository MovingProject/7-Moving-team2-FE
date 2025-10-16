"use client";

import { useMemo } from "react";
import LikeButton from "../LikeButton";
import MovingInfoViewer, { MovingInfo } from "./MovingInfoViewer";
import ProfileViewer from "./ProfileViewer";
import { AreaMap, AreaType } from "@/types/areaTypes";
import { MoveTypeMap, ServerMoveType } from "@/types/moveTypes";
import { DriverProfileData, QuotationData, RequestData, UserData } from "@/types/card";
import CardText from "../card/CardText";
import { isDriverUser } from "@/utils/type-guards";

interface UserProfileInfoProps {
  user: UserData;
  quotation?: QuotationData;
  request?: RequestData;
  show?: ("name" | "oneLiner" | "services" | "reviews" | "estimated" | "likes")[];
  className?: string;
}

export default function UserProfileArea({
  user,
  request,
  quotation,
  show = ["name", "reviews"],
  className,
}: UserProfileInfoProps) {
  const isVisible = (key: "name" | "oneLiner" | "services" | "reviews" | "estimated" | "likes") =>
    show.includes(key);

  const isDriver = isDriverUser(user);
  const profile = user.profile; // DriverProfileData | ConsumerProfileData
  const driverProfile = isDriver ? (profile as DriverProfileData) : null;

  const movingInfo: MovingInfo = useMemo(() => {
    if (!driverProfile) return {} as MovingInfo;
    const price = quotation?.price;
    const moveAt = request?.moveAt;

    const info: MovingInfo = {
      reviewCount: driverProfile.reviewCount,
      rating: driverProfile.rating,
      careerYears: driverProfile.careerYears,
      confirmedCount: driverProfile.confirmedCount,
      serviceAreas:
        driverProfile.driverServiceAreas?.map(
          (areaKey) => AreaMap[areaKey as AreaType] ?? "알 수 없음"
        ) ?? [],
      serviceTypes:
        driverProfile.driverServiceTypes
          ?.map((type) => MoveTypeMap[type as ServerMoveType]?.content ?? "알 수 없음")
          .filter(Boolean) ?? [],
      price,
      moveAt,
    };

    return info;
  }, [driverProfile, quotation?.price, request?.moveAt]);
  if (!user) {
    return null;
  }

  return (
    <div className={`relative flex items-center gap-3 ${className ?? ""}`}>
      {driverProfile?.image && <ProfileViewer initialImageUrl={driverProfile.image} />}

      <div className="flex flex-col gap-1 lg:gap-2">
        {isVisible("name") && (
          <CardText className="text-base font-semibold text-gray-800 lg:text-lg">
            {user.name ?? "-"}
          </CardText>
        )}
        {isVisible("oneLiner") && driverProfile?.oneLiner && (
          <CardText className="text-sm text-gray-600 lg:text-base">
            {driverProfile.oneLiner}
          </CardText>
        )}

        {isVisible("reviews") && movingInfo && (
          <MovingInfoViewer info={movingInfo} infoType="review" />
        )}
        {isVisible("services") && movingInfo && (
          <MovingInfoViewer info={movingInfo} infoType="driverService" />
        )}
        {isVisible("estimated") && movingInfo && (
          <MovingInfoViewer info={movingInfo} infoType="estimate" />
        )}
        {isVisible("likes") && driverProfile?.likes && (
          <LikeButton
            count={driverProfile?.likes.likedCount}
            isLiked={driverProfile?.likes.isLikedByCurrentUser}
            className="absolute top-2 right-3 lg:top-1/2 lg:right-4 lg:-translate-y-1/2"
          />
        )}
      </div>
    </div>
  );
}
