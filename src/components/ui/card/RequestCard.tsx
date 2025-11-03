"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BaseCard, { CommonCardProps } from "./BaseCard";
import Tag from "../Tag";
import MovingInfoViewer, { MovingInfo } from "../profile/MovingInfoViewer";
import Button from "../Button";
import UserProfileArea from "../profile/UserProfileArea";
import { MoveTypeMap, ServerMoveType } from "@/types/moveTypes";
import { formatDate, simplifyAreaName } from "@/utils/formatRequestData";
import CardText from "./CardText";
import { createOrGetChatRoom } from "@/lib/apis/chatApi";

export default function RequestCard({ user, request, quotation }: CommonCardProps) {
  const router = useRouter();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const tags = request?.serviceType;
  const isInvited = request?.isInvited;
  const requestedAt = request?.createdAt ? formatDate(request.createdAt) : "";
  const moveDate = request?.moveAt ? formatDate(request.moveAt) : "";
  const movingInfo: MovingInfo = useMemo(() => {
    return {
      departureAddress: simplifyAreaName(request?.departureAddress ?? ""),
      arrivalAddress: simplifyAreaName(request?.arrivalAddress ?? ""),
      moveAt: moveDate,
    };
  }, [request?.departureAddress, request?.arrivalAddress, moveDate]);

  const NON_ACTIVE_STATUSES = ["CANCELLED", "REJECTED", "EXPIRED", "COMPLETED"];
  const isDimmed =
    NON_ACTIVE_STATUSES.includes(request?.requestStatement ?? "") ||
    NON_ACTIVE_STATUSES.includes(quotation?.quotationStatement ?? "");

  let stateMessage = "";
  if (request?.requestStatement === "CANCELLED" || quotation?.quotationStatement === "REJECTED") {
    stateMessage = "반려된 요청입니다";
  } else if (request?.requestStatement === "COMPLETE") {
    stateMessage = "이사 완료된 견적이에요.";
  } else if (request?.requestStatement === "EXPIRED") {
    stateMessage = "요청이 만료되었습니다";
  }

  const handleCreateChatRoom = async () => {
    if (!request?.requestId || !user?.userId) {
      alert("요청 정보가 부족합니다.");
      return;
    }

    setIsCreatingRoom(true);
    try {
      const { roomId } = await createOrGetChatRoom(request.requestId, user.userId);
      router.push(`/chat/${roomId}`);
    } catch (error: any) {
      console.error("채팅방 생성 실패:", error);
      alert(error.response?.data?.message || "채팅방 생성에 실패했습니다.");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  return (
    <BaseCard className="relative justify-between gap-4 border border-gray-300 bg-white px-[14px] py-4 lg:gap-4 lg:px-6 lg:py-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex gap-2">
            {isInvited && <Tag type="requestQuote" content="지정 견적 요청" />}
            {tags?.map((tag, index) => (
              <Tag
                key={index}
                type={MoveTypeMap[tag].clientType}
                content={MoveTypeMap[tag].content}
              />
            ))}
          </div>
          {requestedAt && <span className="text-sm text-gray-400">{requestedAt}</span>}
        </div>
        <UserProfileArea user={user} request={request} quotation={quotation} show={["name"]} />
        <MovingInfoViewer info={movingInfo} infoType="route" />
      </div>
      {quotation?.price ? (
        <div className="flex justify-end">
          <CardText className="text-lg lg:text-xl">
            견적 금액 <span className="font-semibold">{quotation.price.toLocaleString()}원</span>
          </CardText>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            text={isCreatingRoom ? "생성 중..." : "채팅방 개설하기"}
            onClick={handleCreateChatRoom}
            disabled={isCreatingRoom}
          />
          <Button size="sm" textSize="mobile" variant="secondary" text="반려" />
        </div>
      )}
      {isDimmed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/50 backdrop-blur-sm">
          {stateMessage && (
            <span className="text-sm font-bold text-white lg:text-base">{stateMessage}</span>
          )}
          {request?.requestStatement === "CONCLUDED" && (
            <Button
              size="sm"
              textSize="mobile"
              variant="secondary"
              text="견적 상세보기"
              className="max-w-[140px] px-3 py-2 text-sm"
            />
          )}
        </div>
      )}
    </BaseCard>
  );
}
