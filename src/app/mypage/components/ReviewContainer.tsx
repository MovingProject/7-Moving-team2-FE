"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getDriverReviews,
  getDriverRatingDistribution,
  type GetDriverReviewsData,
  type DriverRatingDistributionResponse,
} from "@/lib/apis/reviewApi";
import ReviewSummary from "./ReviewSummary";
import ReviewList from "./ReviewList";
import Pagination from "./Pagination";

interface ReviewContainerProps {
  driverId: string;
}

const REVIEWS_PER_PAGE = 5;

export default function ReviewContainer({ driverId }: ReviewContainerProps) {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [cursorStack, setCursorStack] = useState<string[]>([]);

  const {
    data: reviewData,
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useQuery<GetDriverReviewsData>({
    queryKey: ["driverReviews", driverId, cursor],
    queryFn: () => getDriverReviews(driverId, REVIEWS_PER_PAGE, cursor),
    placeholderData: (prev) => prev,
  });

  const {
    data: ratingData,
    isLoading: ratingLoading,
    isError: ratingError,
  } = useQuery<DriverRatingDistributionResponse>({
    queryKey: ["driverRating", driverId],
    queryFn: () => getDriverRatingDistribution(driverId),
  });

  if (reviewsLoading || ratingLoading) {
    return <p className="py-10 text-center text-gray-500">로딩 중...</p>;
  }

  if (reviewsError || ratingError) {
    return (
      <p className="py-10 text-center text-red-500">리뷰를 불러오는 중 오류가 발생했습니다.</p>
    );
  }

  const reviews = reviewData?.reviews ?? [];
  const nextCursor = reviewData?.nextCursor ?? null;

  const handleNext = () => {
    if (nextCursor) {
      setCursorStack((prev) => [...prev, nextCursor]);
      setCursor(nextCursor);
    }
  };

  const handlePrev = () => {
    setCursorStack((prev) => {
      const newStack = [...prev];
      newStack.pop();
      setCursor(newStack[newStack.length - 1]);
      return newStack;
    });
  };

  return (
    <div className="flex w-full flex-col gap-10 bg-white">
      {/* 리뷰 타이틀 */}
      <div className="mb-1">
        <h2 className="text-2xl font-bold text-gray-900">
          리뷰 <span>({ratingData?.totalReviews ?? 0})</span>
        </h2>
      </div>
      {/* 별점 요약 영역 */}
      {ratingData && <ReviewSummary ratingData={ratingData} />}

      {/* 리뷰 리스트 */}
      <ReviewList reviews={reviews} />

      {/* 페이지네이션 */}
      <Pagination
        hasNext={!!nextCursor}
        hasPrev={cursorStack.length > 0}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
