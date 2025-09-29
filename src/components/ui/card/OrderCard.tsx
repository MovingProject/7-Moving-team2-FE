"use client";

import React from "react";
import BaseCard, { CommonCardProps } from "./BaseCard";
import CardText from "./CardText";
import Tag from "../Tag";
import Button from "../Button";
import UserProfileArea from "../profile/UserProfileArea";
import { DriverUser } from "@/types/card";
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
    profileData;
  const price = quotation?.price;
  const tags = request?.serviceType;

  return (
    <BaseCard className="gap-2 px-3 py-5 md:gap-[14px] md:py-[22px] lg:gap-6 lg:px-6 lg:py-7">
      <div className="flex justify-between">
        {tags && (
          <div className="flex gap-2">
            {tags.map((tag, index) => (
              <Tag
                key={index}
                type={MoveTypeMap[tag].clientType}
                content={MoveTypeMap[tag].content}
              />
            ))}
          </div>
        )}
      </div>

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
        <Button size="sm" textSize="mobile" text="견적 제출하기" />
        <Button size="sm" textSize="mobile" variant="secondary" text="상세보기" />
      </div>
    </BaseCard>
  );
}
