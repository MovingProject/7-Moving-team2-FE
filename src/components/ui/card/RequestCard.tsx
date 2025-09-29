"use client";
import React, { useMemo } from "react";
import BaseCard, { CommonCardProps } from "./BaseCard";
import Tag from "../Tag";
import MovingInfoViewer, { MovingInfo } from "../profile/MovingInfoViewer";
import Button from "../Button";
import UserProfileArea from "../profile/UserProfileArea";
import { MoveTypeMap } from "@/types/moveTypes";

export default function RequestCard({ user, request, quotation }: CommonCardProps) {
  const tags = request?.serviceType;
  const requestedAt = request?.createdAt;
  const movingInfo: MovingInfo = useMemo(() => {
    const info: MovingInfo = {
      departureAddress: request?.departureAddress,
      arrivalAddress: request?.arrivalAddress,
      moveAt: request?.moveAt,
    };

    return info;
  }, [request?.moveAt, request?.moveAt, request?.moveAt]);

  const NON_ACTIVE_STATUSES = ["CANCELLED", "REJECTED", "EXPIRED", "COMPLETED"];
  const isDimmed =
    NON_ACTIVE_STATUSES.includes(request?.requestStatement ?? "") ||
    NON_ACTIVE_STATUSES.includes(quotation?.quotationStatement ?? "");
  let stateMessage = "";
  if (request?.requestStatement === "CANCELLED" || quotation?.quotationStatement === "REJECTED") {
    stateMessage = "반려된 요청입니다";
  } else if (request?.requestStatement === "COMPLETED") {
    stateMessage = "이사가 완료되었습니다";
  } else if (request?.requestStatement === "EXPIRED") {
    stateMessage = "요청이 만료되었습니다";
  }
  return (
    <BaseCard className="relative gap-4 border border-gray-300 bg-white px-[14px] py-4 lg:gap-4 lg:px-6 lg:py-5">
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
        {requestedAt && <span className="text-sm text-gray-400">{requestedAt}</span>}
      </div>
      <UserProfileArea user={user} request={request} quotation={quotation} show={["name"]} />
      <MovingInfoViewer info={movingInfo} infoType="route" />

      {isDimmed ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/50 backdrop-blur-sm">
          {stateMessage && (
            <span className="text-sm font-bold text-white lg:text-base">{stateMessage}</span>
          )}
          {request?.requestStatement === "COMPLETED" && (
            <Button
              size="sm"
              textSize="mobile"
              variant="secondary"
              text="견적 상세보기"
              className="max-w-[140px] px-3 py-2 text-sm"
            />
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          {quotation && <Button text="견적 보내기" />}
          <Button size="sm" textSize="mobile" variant="secondary" text="반려" />
        </div>
      )}
    </BaseCard>
  );
}
