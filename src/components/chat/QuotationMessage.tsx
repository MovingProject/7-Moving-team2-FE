"use client";

import { useState } from "react";
import { type Quotation } from "@/types/chat";
import useChatStore from "@/store/chatStore";
import ContractModal from "./ContractModal";
import { Contract } from "@/types/contract";
import { generateContractNumber, downloadPDF } from "@/utils/pdfUtils";
import ContractPreview from "./ContractPreview";
import { acceptQuotation } from "@/lib/apis/quotationApi";

interface QuotationMessageProps {
  quotation: Quotation;
  messageId: string;
  otherUserName: string;
  otherUserNickname: string | null;
}

export default function QuotationMessage({
  quotation,
  messageId,
  otherUserName,
  otherUserNickname,
}: QuotationMessageProps) {
  const { currentUser, updateMessage, addMessage, socket } = useChatStore();
  const isDriver = currentUser.role === "driver";
  const isCustomer = currentUser.role === "consumer";
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: { label: "전송됨", color: "bg-blue-100 text-blue-700" },
      CONCLUDED: { label: "계약 체결", color: "bg-green-100 text-green-700" },
      COMPLETED: { label: "완료됨", color: "bg-green-100 text-green-700" },
      REJECTED: { label: "거절됨", color: "bg-red-100 text-red-700" },
      EXPIRED: { label: "만료됨", color: "bg-gray-100 text-gray-700" },
      CANCELLED: { label: "취소됨", color: "bg-gray-100 text-gray-700" },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.PENDING;
  };

  const handleAccept = () => {
    // 계약서 데이터 생성 및 저장
    const newContract = generateContract();
    setContract(newContract);

    // 계약서 모달 열기
    setIsContractModalOpen(true);
  };

  const handleContractConfirm = async () => {
    try {
      // 백엔드 API 호출 - 견적 수락
      await acceptQuotation(quotation.id);

      // 로컬 상태 업데이트: 견적 상태를 CONCLUDED로 변경
      updateMessage(messageId, {
        quotation: { ...quotation, status: "CONCLUDED" },
      });

      // WebSocket으로 상대방에게 견적 수락 알림 (특수 메시지로 전송)
      if (socket) {
        socket.emit("chat:send", {
          roomId: quotation.chattingRoomId,
          messageType: "MESSAGE",
          content: `__QUOTATION_ACCEPTED__:${quotation.id}:${messageId}`,
        });
      }

      // 계약서 모달 닫기
      setIsContractModalOpen(false);
    } catch (error) {
      console.error("견적 수락 중 오류 발생:", error);
      alert("견적 수락 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!contract) return;

    setIsDownloading(true);
    try {
      // PDF 생성을 위해 임시 div 생성
      const tempDiv = document.createElement("div");
      tempDiv.id = "temp-contract-preview";
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      // ContractPreview를 임시 div에 렌더링
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(tempDiv);

      await new Promise<void>((resolve) => {
        root.render(<ContractPreview contract={contract} isCustomerAgreed={true} />);
        setTimeout(resolve, 100); // 렌더링 대기
      });

      // PDF 다운로드
      await downloadPDF(
        "temp-contract-preview",
        `이사계약서_${contract.contractNumber}_${contract.customerName}`
      );

      // 정리
      root.unmount();
      document.body.removeChild(tempDiv);
    } catch (error) {
      alert("PDF 다운로드 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  // 계약서 데이터 생성
  const generateContract = (): Contract => {
    // 이사 날짜에서 시간 제거 (YYYY-MM-DD만)
    const moveDate = quotation.moveAt.split("T")[0];

    return {
      id: `contract-${Date.now()}`,
      quotationId: quotation.id,
      contractNumber: generateContractNumber(),

      // 고객 정보 (Consumer)
      customerName: currentUser.role === "consumer" ? currentUser.name : otherUserName,
      customerPhone: "010-1234-5678", // TODO: 백엔드에서 실제 전화번호 가져오기
      customerAddress: quotation.departureAddress, // 출발지 주소 사용

      // 기사 정보 (Driver)
      driverName: currentUser.role === "driver" ? currentUser.name : otherUserName,
      driverPhone: "010-9876-5432", // TODO: 백엔드에서 실제 전화번호 가져오기
      driverNickname:
        currentUser.role === "driver" ? currentUser.name : otherUserNickname || otherUserName,

      // 이사 정보
      serviceType: quotation.serviceType,
      moveAt: moveDate, // 시간 제거, 날짜만 사용
      departureAddress: quotation.departureAddress,
      departureFloor: quotation.departureFloor,
      departureElevator: quotation.departureElevator,
      arrivalAddress: quotation.arrivalAddress,
      arrivalFloor: quotation.arrivalFloor,
      arrivalElevator: quotation.arrivalElevator,

      // 금액 정보
      estimatedPrice: quotation.price,
      additionalRequirements: quotation.additionalRequirements,

      // 계약 조건
      depositAmount: Math.floor(quotation.price * 0.1), // 계약금 10%
      cancellationPolicy: "이사 3일 전까지 취소 시 계약금 반환, 이후 취소 시 계약금 환불 불가",

      // 날짜
      contractedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),

      // 상태
      status: "PENDING",
    };
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

      {isCustomer && quotation.status === "PENDING" && (
        <button
          onClick={handleAccept}
          className="bg-primary mt-4 w-full rounded-lg py-2 font-medium text-white hover:bg-blue-500"
        >
          견적 수락하기
        </button>
      )}

      {(quotation.status === "CONCLUDED" || quotation.status === "COMPLETED") && (
        <div className="mt-4 space-y-2">
          <div className="rounded-lg bg-green-50 p-2 text-center text-sm text-green-700">
            ✓ 견적이 수락되었습니다
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 disabled:bg-gray-400"
          >
            {isDownloading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                PDF 생성 중...
              </span>
            ) : (
              "📄 계약서 PDF 다운로드"
            )}
          </button>
        </div>
      )}

      {/* 계약서 모달 */}
      {isContractModalOpen && contract && (
        <ContractModal
          isOpen={isContractModalOpen}
          onClose={() => setIsContractModalOpen(false)}
          contract={contract}
          onConfirm={handleContractConfirm}
        />
      )}
    </div>
  );
}
