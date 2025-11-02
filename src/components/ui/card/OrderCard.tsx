"use client";

import React from "react";
import BaseCard, { CommonCardProps } from "./BaseCard";
import CardText from "./CardText";
import Tag from "../Tag";
import Button from "../Button";
import UserProfileArea from "../profile/UserProfileArea";
import { DriverUser, DriverProfileData } from "@/types/card";
import { isDriverUser } from "@/utils/type-guards";
import { MoveTypeMap } from "@/types/moveTypes";

export default function OrderCard({ user, request, quotation }: CommonCardProps) {
  const isDriver = isDriverUser(user);
  if (!isDriver) {
    return null;
  }
  const driverUser = user as DriverUser;
  const profileData = driverUser.profile;
  const { nickname, oneLiner, rating, confirmedCount, driverServiceTypes, ...restProfileData } =
    profileData as DriverProfileData;
  const price = quotation?.price;
  const tags = quotation?.serviceType;
  console.log("profileData", profileData);

  return (
    <BaseCard className="gap-2 border border-gray-300 px-3 py-5 md:gap-[14px] md:py-[22px] lg:gap-4 lg:px-6 lg:py-7">
      <div className="flex justify-between">
        {tags && (
          <div className="flex gap-2">
            <Tag type={MoveTypeMap[tags].clientType} content={MoveTypeMap[tags].content} />
          </div>
        )}
      </div>
      {oneLiner && <CardText className="text-sm font-semibold lg:text-xl">{oneLiner}</CardText>}
      <UserProfileArea
        user={user}
        request={request}
        quotation={quotation}
        show={["name", "reviews", "likes"]}
        className="rounded-lg border border-gray-300 p-[10px]"
      />

      {price && (
        <div className="flex justify-end">
          <CardText className="text-lg lg:text-xl">
            견적 금액 <span className="font-semibold">{price.toLocaleString()}원</span>
          </CardText>
        </div>
      )}

      <div className="flex gap-2">
        <Button size="sm" textSize="mobile" text="채팅방 바로가기" />
      </div>
    </BaseCard>
  );
}
