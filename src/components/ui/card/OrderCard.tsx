"use client";

import { DriverProfileData, DriverUser } from "@/types/card";
import { MoveTypeMap } from "@/types/moveTypes";
import { QUOTATION_STATEMENT } from "@/types/statement";
import { isDriverUser } from "@/utils/type-guards";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import Button from "../Button";
import UserProfileArea from "../profile/UserProfileArea";
import Tag from "../Tag";
import BaseCard, { CommonCardProps } from "./BaseCard";
import CardText from "./CardText";

export default function OrderCard({ user, request, quotation }: CommonCardProps) {
  const router = useRouter();
  const isDriver = isDriverUser(user);
  if (!isDriver) {
    return null;
  }
  const driverUser = user as DriverUser;
  const profileData = driverUser.profile;
  const isInvited = quotation?.isInvited;
  const { nickname, oneLiner, rating, confirmedCount, driverServiceTypes, ...restProfileData } =
    profileData as DriverProfileData;
  const price = quotation?.price;
  const tags = quotation?.serviceType;

  const isRendingOrConcluded =
    quotation?.quotationStatement === "CONCLUDED" || quotation?.quotationStatement === "PENDING";

  const isConcludedOrCompleted =
    quotation?.quotationStatement === "CONCLUDED" || quotation?.quotationStatement === "COMPLETED";
  const quotationStatusKey = quotation?.quotationStatement;
  const quotationStatusLabel = quotationStatusKey
    ? QUOTATION_STATEMENT[quotationStatusKey].label
    : null;

  return (
    <BaseCard
      className={clsx(
        "gap-2 border border-gray-300 px-3 py-5 md:gap-[14px] md:py-[22px] lg:gap-4 lg:px-6 lg:py-7",
        { "border-primary": isConcludedOrCompleted }
      )}
    >
      <div className="flex justify-between">
        {tags && (
          <div className="flex gap-2">
            {isInvited && <Tag type="requestQuote" content="지정 견적 요청" />}
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
        variant="detail"
        className="rounded-lg border border-gray-300 p-[10px]"
      />

      {price && (
        <div className="flex justify-end">
          <CardText className="flex items-center gap-2 text-lg lg:text-xl">
            {isConcludedOrCompleted && (
              <span className="border-primary bg-primary-lightest text-primary flex rounded-3xl border px-2.5 py-1 text-sm font-semibold">
                {quotationStatusLabel}
              </span>
            )}
            견적 금액 <span className="font-semibold">{price.toLocaleString()}원</span>
          </CardText>
        </div>
      )}

      {isRendingOrConcluded && (
        <div className="flex gap-2">
          <Button
            size="sm"
            textSize="mobile"
            text="채팅방 바로가기"
            onClick={
              quotation?.chattingRoomId
                ? () => {
                    router.push(`/chat/${quotation.chattingRoomId}`);
                  }
                : undefined
            }
          />
        </div>
      )}
    </BaseCard>
  );
}
