"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal/Modal";
import ReviewRating from "@/components/ui/Modal/ReviewRating";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ReviewCard from "@/components/ui/card/ReviewCard";
import { DriverUser, QuotationData, RequestData } from "@/types/card";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: DriverUser;
  request: RequestData;
  quotation: QuotationData;
  onSubmit: (rating: number, content: string) => void | Promise<void>;
}

export default function ReviewModal({
  isOpen,
  onClose,
  driver,
  request,
  quotation,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_CONTENT_LENGTH = 500;

  const handleContentChange = (value: string) => {
    if (value.length <= MAX_CONTENT_LENGTH) {
      setContent(value);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("평점을 선택해주세요.");
      return;
    }

    if (content.trim().length < 10) {
      alert("리뷰 내용은 최소 10자 이상 작성해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, content);
      handleClose();
    } catch (error) {
      console.error("리뷰 작성 실패:", error);
      alert("리뷰 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setContent("");
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      type="default"
      title="리뷰 쓰기"
      onClose={handleClose}
      className={(size) => (size === "md" ? "w-[600px] max-w-[90vw]" : "mx-4 w-full max-w-[90vw]")}
      footer={(size) => (
        <div className="flex w-full gap-3">
          <Button
            text="리뷰 등록"
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0 || content.trim().length < 10}
            loading={isSubmitting}
            className="w-full"
          />
        </div>
      )}
    >
      <div className="flex flex-col gap-6">
        {/* 기사 정보 카드 */}
        <ReviewCard user={driver} request={request} quotation={quotation} hideButton />

        {/* 평점 선택 */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold text-gray-900">평점을 선택해 주세요</p>
          <div className="flex items-center justify-center gap-2">
            <ReviewRating rate={rating} setRate={setRating} max={5} />
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold text-gray-900">상세 후기를 작성해 주세요</p>
          <Input
            type="textArea"
            value={content}
            onChange={handleContentChange}
            placeholder="최소 10자 이상 입력해주세요"
            className="h-[160px] md:h-[200px]"
          />
          <p className="text-right text-sm text-gray-400">
            {content.length} / {MAX_CONTENT_LENGTH}자
          </p>
        </div>
      </div>
    </Modal>
  );
}
