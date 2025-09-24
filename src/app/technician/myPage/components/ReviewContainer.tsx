"use client";

import { useState } from "react";
import ReviewSummary from "./ReviewSummary";
import ReviewList from "./ReviewList";
import Pagination from "./Pagination";

// 목업 리뷰
const MOCK_REVIEWS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  author: `kim****`,
  date: "2024-07-01",
  rating: 5,
  content:
    "기사님 덕분에 무사히 이사를 마쳤습니다. 항상 친절하시고 꼼꼼하게 신경 써주셔서 감사드려요!",
}));

const REVIEWS_PER_PAGE = 5;

export default function ReviewContainer() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(MOCK_REVIEWS.length / REVIEWS_PER_PAGE);
  const currentReviews = MOCK_REVIEWS.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);

  return (
    <div className="w-full bg-[#FFF]">
      {/* 별점 요약 영역 */}
      <ReviewSummary reviews={MOCK_REVIEWS} />

      {/* 리뷰 리스트 */}
      <ReviewList reviews={currentReviews} />

      {/* 페이지네이션 */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
