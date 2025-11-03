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
import { rejectRequest } from "@/utils/hook/request/useRejectRequestQuery";

export default function RequestCard({ user, request, quotation }: CommonCardProps) {
  const router = useRouter();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [localStatus, setLocalStatus] = useState(request?.requestStatement ?? "PENDING");
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

  const NON_ACTIVE_STATUSES = ["CANCELLED", "REJECTED", "EXPIRED", "COMPLETED", "COMPLETE"];
  const isDimmed =
    NON_ACTIVE_STATUSES.includes(request?.requestStatement ?? "") ||
    NON_ACTIVE_STATUSES.includes(quotation?.quotationStatement ?? "");

  let stateMessage = "";
  if (quotation?.quotationStatement === "REJECTED") {
    stateMessage = "반려된 견적입니다";
  } else if (
    request?.requestStatement === "COMPLETE" ||
    quotation?.quotationStatement === "COMPLETED"
  ) {
    stateMessage = "이사 완료된 견적이에요.";
  } else if (
    request?.requestStatement === "EXPIRED" ||
    quotation?.quotationStatement === "EXPIRED"
  ) {
    stateMessage = "요청 혹은 견적이 만료되었습니다";
  }

  const handleRejectRequest = async () => {
    if (!request?.requestId) {
      alert("요청 ID가 없습니다.");
      return;
    }

    const confirmReject = confirm("정말 이 요청을 반려하시겠습니까?");
    if (!confirmReject) return;

    const note = prompt("반려 사유를 입력하세요 (선택):") || undefined;

    setIsRejecting(true);
    try {
      await rejectRequest(request.requestId, note);
      setLocalStatus("REJECTED");
      alert("요청이 반려되었습니다.");
      router.refresh();
    } catch (error) {
      console.error("요청 반려 실패:", error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      alert(err.response?.data?.message || "요청 반려에 실패했습니다.");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleCreateChatRoom = async () => {
    if (!request?.requestId || !user?.userId) {
      alert("요청 정보가 부족합니다.");
      return;
    }

    setIsCreatingRoom(true);
    try {
      const { roomId } = await createOrGetChatRoom(request.requestId, user.userId);
      router.push(`/chat/${roomId}`);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      console.error("채팅방 생성 실패:", error);
      alert(err.response?.data?.message || "채팅방 생성에 실패했습니다.");
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
        !isDimmed && (
          <div className="flex gap-2">
            <Button
              text={isCreatingRoom ? "생성 중..." : "채팅방 개설하기"}
              onClick={handleCreateChatRoom}
              disabled={isCreatingRoom}
            />
            <Button
              size="sm"
              textSize="mobile"
              variant="secondary"
              text={isRejecting ? "반려 중..." : "반려"}
              onClick={handleRejectRequest}
              disabled={isRejecting}
            />
          </div>
        )
      )}
      {isDimmed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/50 backdrop-blur-sm transition-all duration-300">
          {localStatus === "REJECTED" && (
            <>
              <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
                 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 
                 17 12 13.41 8.41 17 7 15.59 10.59 12 7 
                 8.41 8.41 7 12 10.59 15.59 7 17 
                 8.41 13.41 12 17 15.59z"
                />
              </svg>
              <span className="mt-2 text-sm font-semibold text-white">반려된 요청입니다</span>
            </>
          )}
          {localStatus === "COMPLETE" && (
            <span className="text-sm font-bold text-white">이사 완료된 견적이에요</span>
          )}
        </div>
      )}
    </BaseCard>
  );
}
