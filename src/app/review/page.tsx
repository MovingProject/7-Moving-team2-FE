"use client";

import { useState, useEffect } from "react";
import ReviewCard from "@/components/ui/card/ReviewCard";
import Pagination from "@/app/mypage/components/Pagination";
import ReviewModal from "@/components/ui/Modal/ReviewModal";
import { DriverUser, RequestData, QuotationData, ReviewData } from "@/types/card";
import {
  getWritableReviews,
  getWrittenReviews,
  createReview,
  ReviewItem,
} from "@/lib/apis/reviewApi";

const ITEMS_PER_PAGE = 6;

type TabType = "writable" | "written";

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState<TabType>("writable");
  const [writablePage, setWritablePage] = useState(1);
  const [writtenPage, setWrittenPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState<ReviewItem | null>(null);

  const [writableReviews, setWritableReviews] = useState<ReviewItem[]>([]);
  const [writtenReviews, setWrittenReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (activeTab === "writable") {
          const data = await getWritableReviews();
          setWritableReviews(data);
        } else {
          const data = await getWrittenReviews();
          setWrittenReviews(data);
        }
      } catch (err) {
        console.error("리뷰 목록 조회 실패:", err);
        setError("리뷰 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [activeTab]);

  const currentData = activeTab === "writable" ? writableReviews : writtenReviews;
  const currentPage = activeTab === "writable" ? writablePage : writtenPage;
  const setCurrentPage = activeTab === "writable" ? setWritablePage : setWrittenPage;

  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const paginatedData = currentData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleReviewClick = (item: ReviewItem) => {
    setSelectedReviewItem(item);
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async (rating: number, content: string) => {
    if (!selectedReviewItem) return;

    try {
      await createReview({
        quotationId: selectedReviewItem.quotation.quotationId,
        rating,
        content,
      });

      alert("리뷰가 작성되었습니다!");
      setIsModalOpen(false);
      setSelectedReviewItem(null);

      // 작성 가능한 리뷰 목록 새로고침
      const updatedWritable = await getWritableReviews();
      setWritableReviews(updatedWritable);

      // 작성한 리뷰 목록도 새로고침 (작성한 리뷰 탭에서 볼 수 있도록)
      const updatedWritten = await getWrittenReviews();
      setWrittenReviews(updatedWritten);
    } catch (err) {
      console.error("리뷰 작성 실패:", err);
      alert("리뷰 작성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "writable") {
      setWritablePage(1);
    } else {
      setWrittenPage(1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mx-auto min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
      {/* 탭 */}
      <div className="mx-auto mb-6 max-w-[1200px] border-b border-gray-200 md:mb-8">
        <div className="flex gap-8 md:gap-12">
          <button
            onClick={() => handleTabChange("writable")}
            className={`pb-3 text-sm font-medium transition-colors md:pb-4 md:text-base lg:text-lg ${
              activeTab === "writable"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            작성 가능한 리뷰
          </button>
          <button
            onClick={() => handleTabChange("written")}
            className={`pb-3 text-sm font-medium transition-colors md:pb-4 md:text-base lg:text-lg ${
              activeTab === "written"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            내가 작성한 리뷰
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && !isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* 리뷰 카드 목록 */}
      {!isLoading && !error && (
        <div className="mx-auto mb-6 max-w-[1200px] md:mb-8">
          {paginatedData.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-2">
              {paginatedData.map((item) => (
                <ReviewCard
                  key={item.id}
                  user={item.user}
                  request={item.request}
                  quotation={item.quotation}
                  review={item.review}
                  onReviewClick={
                    activeTab === "writable" ? () => handleReviewClick(item) : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-200 bg-white">
              <p className="text-gray-400">
                {activeTab === "writable"
                  ? "작성 가능한 리뷰가 없습니다."
                  : "작성한 리뷰가 없습니다."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 페이지네이션 */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="mx-auto max-w-[1200px]">
          <Pagination
            hasNext={currentPage < totalPages}
            hasPrev={currentPage > 1}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>
      )}

      {/* 리뷰 작성 모달 */}
      {selectedReviewItem && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          driver={selectedReviewItem.user}
          request={selectedReviewItem.request}
          quotation={selectedReviewItem.quotation}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}
