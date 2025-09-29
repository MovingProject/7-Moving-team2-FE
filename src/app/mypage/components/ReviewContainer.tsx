"use client";

import { useState } from "react";
import ReviewSummary from "./ReviewSummary";
import ReviewList from "./ReviewList";
import Pagination from "./Pagination";

// 목업 리뷰
const MOCK_REVIEWS = [
  ...Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    author: `kim****`,
    date: "2024-07-01",
    rating: 5,
    content:
      "기사님 덕분에 무사히 이사를 마쳤습니다. 항상 친절하시고 꼼꼼하게 신경 써주셔서 감사드려요!",
  })),

  ...Array.from({ length: 23 }, (_, i) => ({
    id: i + 1 + 15,
    author: `park****`,
    date: "2024-07-02",
    rating: 4,
    content:
      "상급 서비스였습니다. 물건 포장에서 약간의 아쉬움은 있었지만, 전반적으로 만족스러웠습니다. 다음에 또 이사를 가게 된다면 다시 이용해도 좋을 것 같네요",
  })),

  ...Array.from({ length: 17 }, (_, i) => ({
    id: i + 1 + 30,
    author: `lee****`,
    date: "2024-07-03",
    rating: 3,
    content: "더도 말고 덜도 말고 딱 3점짜리인 것 같네요. 나쁘진 않았습니다.",
  })),

  ...Array.from({ length: 9 }, (_, i) => ({
    id: i + 1 + 30,
    author: `choi****`,
    date: "2024-05-01",
    rating: 2,
    content: "기사님이 너무 불친절해요. 입에 욕을 너무 달고 사시는 거 같아요. 서비스 정신 부족.",
  })),

  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 1 + 30,
    author: `lee****`,
    date: "2024-07-03",
    rating: 1,
    content: "쌍욕 나올 뻔함 ;",
  })),
];

const REVIEWS_PER_PAGE = 5;

export default function ReviewContainer() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(MOCK_REVIEWS.length / REVIEWS_PER_PAGE);
  const currentReviews = MOCK_REVIEWS.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);

  return (
    <div className="flex w-full flex-col gap-10 bg-white">
      {/* 리뷰 타이틀 */}
      <div className="mb-1">
        <h2 className="text-2xl font-bold text-gray-900">
          리뷰 <span>({MOCK_REVIEWS.length})</span>
        </h2>
      </div>
      {/* 별점 요약 영역 */}
      <ReviewSummary reviews={MOCK_REVIEWS} />

      {/* 리뷰 리스트 */}
      <ReviewList reviews={currentReviews} />

      {/* 페이지네이션 */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
