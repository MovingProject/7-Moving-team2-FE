"use client";

import { useState } from "react";
import { Contract } from "@/types/contract";
import ContractPreview from "./ContractPreview";

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
  onConfirm?: () => void;
}

export default function ContractModal({
  isOpen,
  onClose,
  contract,
  onConfirm,
}: ContractModalProps) {
  const [isCustomerAgreed, setIsCustomerAgreed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col rounded-lg bg-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">계약서 미리보기</h2>
            <p className="text-sm text-gray-500">
              계약 내용을 확인하시고 PDF로 다운로드하실 수 있습니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 계약서 내용 (스크롤 가능) */}
        <div className="flex-1 overflow-y-auto p-4">
          <ContractPreview
            contract={contract}
            isCustomerAgreed={isCustomerAgreed}
            onCustomerAgreeChange={setIsCustomerAgreed}
          />
        </div>

        {/* 푸터 버튼 */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          {/* 모바일: 세로 스택, 데스크탑(sm+): 우측 정렬된 가로 버튼 */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
            {onConfirm && (
              <button
                onClick={handleConfirm}
                disabled={!isCustomerAgreed}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-44"
              >
                ✓ 계약 확정
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-28"
            >
              닫기
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-gray-500 sm:text-right">
            💡 계약 내용에 동의하시면 체크박스를 선택해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
