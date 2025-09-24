"use client";

import { useState } from "react";
import Modal from "./Modal";
import Tag from "@/components/ui/Tag";
import Input from "../Input";
import Button from "../Button";
import ProfileViewer from "../profile/ProfileViewer";
import Rating from "./Rating";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "review" | "reject"; // 리뷰 작성하기 & 반려하기

  technician?: {
    name: string; // 기사 이름
    profileImageUrl?: string; // 기사 프로필 이미지
    movingDate: string; // 이사일
    estimatePrice: string; // 견적가
  };

  rejectInfo?: {
    customerName: string; // 고객 이름
    movingDate: string; // 이사일
    departure: string; // 출발지
    arrival: string; // 도착지
  };
}

export default function PostModal({
  isOpen,
  onClose,
  type,
  technician,
  rejectInfo,
}: PostModalProps) {
  const [rating, setRating] = useState(0); // 리뷰일 때만 별점
  const [text, setText] = useState("");

  if (!isOpen) return null;

  // 헤더 타이틀
  const title = type === "review" ? "리뷰 작성하기" : "반려 사유 작성하기";

  return (
    <Modal
      type="post"
      title={title}
      onClose={onClose}
      className={(size) => {
        if (size === "sm") {
          return type === "review"
            ? "fixed bottom-[-130px] max-h-[90vh] w-full rounded-t-[32px]"
            : "fixed bottom-[-160px] max-h-[90vh] w-full rounded-t-[32px]";
        }
        return "h-auto w-[600px]";
      }}
    >
      <div className="space-y-6">
        <div className="align-center flex gap-[12px]">
          <Tag type="smallMove" size="default" content="소형 이사" borderType="default" />
          <Tag type="requestQuote" size="default" content="견적 요청" borderType="default" />
        </div>
        {/* 프로필 영역 */}
        <div className="flex items-center rounded-xl border border-gray-200 bg-white p-4">
          {type === "review" && technician ? (
            <>
              {/* 프로필 이미지 */}
              <ProfileViewer initialImageUrl={technician.profileImageUrl || ""} size="sm" />
              {/* 기사 정보 */}
              <div className="ml-4 flex flex-col">
                <span className="text-sm font-semibold md:text-base">{technician.name} 기사님</span>
                <div className="mt-1 flex flex-col gap-1 text-xs text-gray-600 md:flex-row md:flex-wrap md:items-center md:gap-2 md:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="rounded-[4px] bg-[#F4F7FB] px-[6px] py-[4px]">이사일</span>
                    <p className="text-xs font-medium md:text-base">{technician.movingDate}</p>
                  </div>
                  <span className="hidden text-gray-300 md:inline">|</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-[4px] bg-[#F4F7FB] px-[6px] py-[4px]">견적가</span>
                    <p className="text-xs font-medium md:text-base">{technician.estimatePrice}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            rejectInfo && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold md:text-base">
                  {rejectInfo.customerName} 고객님
                </span>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600 md:text-sm">
                  <span className="rounded-[4px] bg-[#F4F7FB] px-[6px] py-[4px]">이사일</span>
                  <p className="text-sm font-medium md:text-base">{rejectInfo.movingDate}</p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600 md:text-sm">
                  <span className="rounded-[4px] bg-[#F4F7FB] px-[6px] py-[4px]">출발</span>
                  <p className="text-sm font-medium md:text-base">{rejectInfo.departure}</p>
                  <span className="text-gray-300">|</span>
                  <span className="rounded-[4px] bg-[#F4F7FB] px-[6px] py-[4px]">도착</span>
                  <p className="text-sm font-medium md:text-base">{rejectInfo.arrival}</p>
                </div>
              </div>
            )
          )}
        </div>
        {/* 별점 영역 (리뷰일 때만) */}
        {type === "review" && <Rating rating={rating} setRating={setRating} />}

        {/* 인풋 영역 */}
        <div className="flex flex-col gap-3">
          <p className="mb-2 text-lg font-bold text-[#373737]">
            {type === "review" ? "상세 후기를 작성해 주세요." : "반려 사유를 입력해 주세요."}
          </p>
          <Input
            type="textArea"
            value={text}
            placeholder="내용을 입력해 주세요."
            onChange={(value) => setText(value)}
            className="w-full"
          />
        </div>
      </div>

      {/* 푸터 영역 */}
      <footer className="mt-6 flex justify-end">
        <Button
          text={type === "review" ? "리뷰 등록" : "반려하기"}
          variant="primary"
          size="md"
          radius="default"
          onClick={() => {
            console.log("제출:", { type, rating, text });
            onClose();
          }}
          disabled={type === "review" ? rating === 0 || !text.trim() : !text.trim()}
          className="w-full"
        />
      </footer>
    </Modal>
  );
}
