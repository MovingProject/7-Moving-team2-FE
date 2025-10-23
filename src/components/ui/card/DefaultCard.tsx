"use client";

import React from "react";
import BaseCard, { CommonCardProps } from "./BaseCard";
import CardText from "./CardText";
import Tag from "../Tag";
import { DriverProfileData, DriverUser } from "@/types/card";
import { MoveTypeMap } from "@/types/moveTypes";
import UserProfileArea from "../profile/UserProfileArea";
import { isDriverUser } from "@/utils/type-guards";
import DriverDetailPage from "@/app/driverList/[id]/page";

export default function DefaultCard({
  user,
  request,
  quotation,
  variant = "list",
  driverDetail,
}: CommonCardProps) {
  const isDriver = isDriverUser(user);
  if (!isDriver) {
    return null;
  }
  const driverUser = user as DriverUser;
  const profileData = driverUser.profile;
  const { oneLiner, driverServiceTypes } = profileData as DriverProfileData;
  const price = quotation?.price;

  return (
    <BaseCard className="gap-[14px] border border-gray-300 bg-white px-[14px] py-4 lg:gap-4 lg:px-6 lg:py-5">
      <div className="flex justify-between">
        <div className="flex gap-2">
          {driverServiceTypes?.map((tag, index) => (
            <Tag
              key={index}
              type={MoveTypeMap[tag].clientType}
              content={MoveTypeMap[tag].content}
            />
          ))}
        </div>
      </div>

      {oneLiner && <CardText className="text-sm font-semibold lg:text-xl">{oneLiner}</CardText>}

      <UserProfileArea
        user={user}
        driverDetail={driverDetail}
        request={request}
        quotation={quotation}
        show={["name", "reviews", "likes"]}
        variant={variant}
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
