"use client";

import { type Quotation } from "@/app/chat/mock/data";
import useChatStore from "@/store/chatStore";

interface QuotationMessageProps {
  quotation: Quotation;
  messageId: string;
}

export default function QuotationMessage({ quotation, messageId }: QuotationMessageProps) {
  const { currentUser, updateMessage, addMessage } = useChatStore();
  const isDriver = currentUser.role === "driver";
  const isCustomer = currentUser.role === "consumer";

  const getStatusBadge = (status: string) => {
    const statusMap = {
      SUBMITTED: { label: "전송됨", color: "bg-blue-100 text-blue-700" },
      REVISED: { label: "수정됨", color: "bg-yellow-100 text-yellow-700" },
      WITHDRAWN: { label: "철회됨", color: "bg-red-100 text-red-700" },
      SELECTED: { label: "수락됨", color: "bg-green-100 text-green-700" },
      EXPIRED: { label: "만료됨", color: "bg-gray-100 text-gray-700" },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.SUBMITTED;
  };

  const handleAccept = () => {
    // TODO: Replace with real API call
    // await apiClient.post(`/quotations/${quotation.id}/accept`);

    // Mock update: change status to SELECTED
    updateMessage(messageId, {
      quotation: { ...quotation, status: "SELECTED" },
    });

    // Add system message
    addMessage({
      id: `msg-${Date.now()}`,
      chattingRoomId: quotation.chattingRoomId,
      senderId: "system",
      senderName: "시스템",
      messageType: "MESSAGE",
      content: "견적이 수락되었습니다.",
      createdAt: new Date().toISOString(),
    });
  };

  const statusBadge = getStatusBadge(quotation.status);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">💼 견적서</span>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusBadge.color}`}>
            {statusBadge.label}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between border-b pb-2">
          <span className="text-sm text-gray-600">견적 금액 &nbsp;</span>
          <span className="text-2xl font-bold text-blue-500">
            {quotation.price.toLocaleString()}원
          </span>
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">이사 날짜</span>
            <span className="font-medium">{quotation.moveAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">출발지</span>
            <span className="font-medium">{quotation.departureAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">도착지</span>
            <span className="font-medium">{quotation.arrivalAddress}</span>
          </div>

          {/* 고객의 추가 요청사항 */}
          {quotation.additionalRequirements && (
            <div className="mt-2 rounded bg-gray-100 p-2">
              <p className="text-xs font-medium text-gray-600">고객 추가 요청사항</p>
              <p className="mt-1 text-sm text-gray-800">{quotation.additionalRequirements}</p>
            </div>
          )}

          {/* 기사의 견적 추가 설명 */}
          {quotation.quotationMessage && (
            <div className="mt-2 rounded bg-blue-50 p-2">
              <p className="text-xs font-medium text-blue-600">견적 추가 설명</p>
              <p className="mt-1 text-sm text-gray-800">{quotation.quotationMessage}</p>
            </div>
          )}
        </div>
      </div>

      {isCustomer && quotation.status === "SUBMITTED" && (
        <button
          onClick={handleAccept}
          className="bg-primary mt-4 w-full rounded-lg py-2 font-medium text-white hover:bg-blue-500"
        >
          견적 수락하기
        </button>
      )}

      {isDriver && quotation.status === "SELECTED" && (
        <div className="mt-4 rounded-lg bg-green-50 p-2 text-center text-sm text-green-700">
          ✓ 고객이 견적을 수락했습니다
        </div>
      )}
    </div>
  );
}
