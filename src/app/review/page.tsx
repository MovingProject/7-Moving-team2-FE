"use client";

import { useState } from "react";
import ReviewCard from "@/components/ui/card/ReviewCard";
import Pagination from "@/app/mypage/components/Pagination";
import ReviewModal from "@/components/ui/Modal/ReviewModal";
import { DriverUser, RequestData, QuotationData, ReviewData } from "@/types/card";

interface ReviewItem {
  id: string;
  user: DriverUser;
  request: RequestData;
  quotation: QuotationData;
  review?: ReviewData;
}

// 임시 모의 데이터
const MOCK_WRITABLE_REVIEWS: ReviewItem[] = [
  {
    id: "1",
    user: {
      userId: "driver1",
      name: "김코드 기사님",
      email: "driver1@test.com",
      phoneNumber: "010-1234-5678",
      role: "DRIVER" as const,
      profile: {
        driverId: "driver1",
        nickname: "김코드 기사님",
        image: null,
        reviewCount: 123,
        rating: 4.8,
        careerYears: 10,
        confirmedCount: 200,
        likes: {
          likedCount: 50,
          isLikedByCurrentUser: false,
        },
      },
    },
    request: {
      requestId: "req1",
      serviceType: ["SMALL_MOVE" as const],
      departureAddress: "서울시 강남구",
      arrivalAddress: "서울시 송파구",
      requestStatement: "CONFIRMED" as const,
      moveAt: "2024.07.01",
      createdAt: "2024.06.15",
    },
    quotation: {
      quotationId: "quot1",
      departureAddress: "서울시 강남구",
      arrivalAddress: "서울시 송파구",
      quotationStatement: "ACCEPTED" as const,
      price: 210000,
      moveAt: "2024.07.01",
      createdAt: "2024.06.20",
    },
  },
  {
    id: "2",
    user: {
      userId: "driver2",
      name: "김코드 기사님",
      email: "driver2@test.com",
      phoneNumber: "010-1234-5679",
      role: "DRIVER" as const,
      profile: {
        driverId: "driver2",
        nickname: "김코드 기사님",
        image: null,
        reviewCount: 87,
        rating: 4.5,
        careerYears: 5,
        confirmedCount: 150,
        likes: {
          likedCount: 30,
          isLikedByCurrentUser: true,
        },
      },
    },
    request: {
      requestId: "req2",
      serviceType: ["SMALL_MOVE" as const],
      departureAddress: "서울시 강남구",
      arrivalAddress: "서울시 송파구",
      requestStatement: "CONFIRMED" as const,
      moveAt: "2024.07.01",
      createdAt: "2024.06.15",
    },
    quotation: {
      quotationId: "quot2",
      departureAddress: "서울시 강남구",
      arrivalAddress: "서울시 송파구",
      quotationStatement: "ACCEPTED" as const,
      price: 210000,
      moveAt: "2024.07.01",
      createdAt: "2024.06.20",
    },
  },
  {
    id: "3",
    user: {
      userId: "driver3",
      name: "박이사 기사님",
      email: "driver3@test.com",
      phoneNumber: "010-2345-6789",
      role: "DRIVER" as const,
      profile: {
        driverId: "driver3",
        nickname: "박이사 기사님",
        image: null,
        reviewCount: 95,
        rating: 4.6,
        careerYears: 7,
        confirmedCount: 180,
        likes: {
          likedCount: 42,
          isLikedByCurrentUser: false,
        },
      },
    },
    request: {
      requestId: "req3",
      serviceType: ["HOME_MOVE" as const],
      departureAddress: "서울시 마포구",
      arrivalAddress: "서울시 용산구",
      requestStatement: "CONFIRMED" as const,
      moveAt: "2024.06.15",
      createdAt: "2024.06.01",
    },
    quotation: {
      quotationId: "quot3",
      departureAddress: "서울시 마포구",
      arrivalAddress: "서울시 용산구",
      quotationStatement: "ACCEPTED" as const,
      price: 350000,
      moveAt: "2024.06.15",
      createdAt: "2024.06.05",
    },
  },
  {
    id: "4",
    user: {
      userId: "driver4",
      name: "이무빙 기사님",
      email: "driver4@test.com",
      phoneNumber: "010-3456-7890",
      role: "DRIVER" as const,
      profile: {
        driverId: "driver4",
        nickname: "이무빙 기사님",
        image: null,
        reviewCount: 210,
        rating: 4.9,
        careerYears: 15,
        confirmedCount: 350,
        likes: {
          likedCount: 120,
          isLikedByCurrentUser: true,
        },
      },
    },
    request: {
      requestId: "req4",
      serviceType: ["OFFICE_MOVE" as const],
      departureAddress: "서울시 서초구",
      arrivalAddress: "경기도 성남시",
      requestStatement: "CONFIRMED" as const,
      moveAt: "2024.08.01",
      createdAt: "2024.07.15",
    },
    quotation: {
      quotationId: "quot4",
      departureAddress: "서울시 서초구",
      arrivalAddress: "경기도 성남시",
      quotationStatement: "ACCEPTED" as const,
      price: 800000,
      moveAt: "2024.08.01",
      createdAt: "2024.07.20",
    },
  },
  {
    id: "5",
    user: {
      userId: "driver5",
      name: "정빠른 기사님",
      email: "driver5@test.com",
      phoneNumber: "010-4567-8901",
      role: "DRIVER" as const,
      profile: {
        driverId: "driver5",
        nickname: "정빠른 기사님",
        image: null,
        reviewCount: 156,
        rating: 4.7,
        careerYears: 12,
        confirmedCount: 270,
        likes: {
          likedCount: 85,
          isLikedByCurrentUser: false,
        },
      },
    },
    request: {
      requestId: "req5",
      serviceType: ["SMALL_MOVE" as const, "HOME_MOVE" as const],
      departureAddress: "서울시 동작구",
      arrivalAddress: "서울시 관악구",
      requestStatement: "CONFIRMED" as const,
      moveAt: "2024.05.20",
      createdAt: "2024.05.05",
    },
    quotation: {
      quotationId: "quot5",
      departureAddress: "서울시 동작구",
      arrivalAddress: "서울시 관악구",
      quotationStatement: "ACCEPTED" as const,
      price: 280000,
      moveAt: "2024.05.20",
      createdAt: "2024.05.10",
    },
  },
  {
    id: "6",
    user: {
      userId: "driver6",
      name: "최안전 기사님",
      email: "driver6@test.com",
      phoneNumber: "010-5678-9012",
      role: "DRIVER" as const,
      profile: {
        driverId: "driver6",
        nickname: "최안전 기사님",
        image: null,
        reviewCount: 78,
        rating: 4.4,
        careerYears: 6,
        confirmedCount: 130,
        likes: {
          likedCount: 38,
          isLikedByCurrentUser: true,
        },
      },
    },
    request: {
      requestId: "req6",
      serviceType: ["HOME_MOVE" as const],
      departureAddress: "인천시 남동구",
      arrivalAddress: "서울시 강서구",
      requestStatement: "CONFIRMED" as const,
      moveAt: "2024.09.10",
      createdAt: "2024.08.25",
    },
    quotation: {
      quotationId: "quot6",
      departureAddress: "인천시 남동구",
      arrivalAddress: "서울시 강서구",
      quotationStatement: "ACCEPTED" as const,
      price: 420000,
      moveAt: "2024.09.10",
      createdAt: "2024.08.30",
    },
  },
  {
    id: "7",
    user: {
      userId: "driver7",
      name: "강믿음 기사님",
      email: "driver7@test.com",
      phoneNumber: "010-6789-0123",
      role: "DRIVER" as const,
      profile: {
        driverId: "driver7",
        nickname: "강믿음 기사님",
        image: null,
        reviewCount: 189,
        rating: 4.8,
        careerYears: 13,
        confirmedCount: 310,
        likes: {
          likedCount: 95,
          isLikedByCurrentUser: false,
        },
      },
    },
    request: {
      requestId: "req7",
      serviceType: ["OFFICE_MOVE" as const, "SMALL_MOVE" as const],
      departureAddress: "서울시 영등포구",
      arrivalAddress: "서울시 구로구",
      requestStatement: "CONFIRMED" as const,
      moveAt: "2024.07.25",
      createdAt: "2024.07.10",
    },
    quotation: {
      quotationId: "quot7",
      departureAddress: "서울시 영등포구",
      arrivalAddress: "서울시 구로구",
      quotationStatement: "ACCEPTED" as const,
      price: 550000,
      moveAt: "2024.07.25",
      createdAt: "2024.07.15",
    },
  },
  {
    id: "8",
    user: {
      userId: "driver8",
      name: "윤친절 기사님",
      email: "driver8@test.com",
      phoneNumber: "010-7890-1234",
      role: "DRIVER" as const,
      profile: {
        driverId: "driver8",
        nickname: "윤친절 기사님",
        image: null,
        reviewCount: 142,
        rating: 4.6,
        careerYears: 9,
        confirmedCount: 230,
        likes: {
          likedCount: 68,
          isLikedByCurrentUser: true,
        },
      },
    },
    request: {
      requestId: "req8",
      serviceType: ["SMALL_MOVE" as const],
      departureAddress: "경기도 고양시",
      arrivalAddress: "서울시 은평구",
      requestStatement: "CONFIRMED" as const,
      moveAt: "2024.06.05",
      createdAt: "2024.05.20",
    },
    quotation: {
      quotationId: "quot8",
      departureAddress: "경기도 고양시",
      arrivalAddress: "서울시 은평구",
      quotationStatement: "ACCEPTED" as const,
      price: 320000,
      moveAt: "2024.06.05",
      createdAt: "2024.05.25",
    },
  },
];

const MOCK_WRITTEN_REVIEWS: ReviewItem[] = [
  {
    id: "3",
    user: {
      userId: "driver3",
      name: "김코드 기사님",
      email: "driver3@test.com",
      phoneNumber: "010-1234-5680",
      role: "DRIVER" as const,
      profile: {
        driverId: "driver3",
        nickname: "김코드 기사님",
        image: null,
        reviewCount: 200,
        rating: 4.9,
        careerYears: 15,
        confirmedCount: 300,
        likes: {
          likedCount: 80,
          isLikedByCurrentUser: false,
        },
      },
    },
    request: {
      requestId: "req3",
      serviceType: ["OFFICE_MOVE" as const, "HOME_MOVE" as const],
      departureAddress: "서울시 강남구",
      arrivalAddress: "서울시 송파구",
      requestStatement: "CONFIRMED" as const,
      moveAt: "2024.07.01",
      createdAt: "2024.06.15",
    },
    quotation: {
      quotationId: "quot3",
      departureAddress: "서울시 강남구",
      arrivalAddress: "서울시 송파구",
      quotationStatement: "ACCEPTED" as const,
      price: 210000,
      moveAt: "2024.07.01",
      createdAt: "2024.06.20",
    },
    review: {
      rating: 5,
      content:
        "기사님 덕분에 무사히 이사를 마쳤습니다. 항상 친절하시고 꼼꼼하게 신경 써주셔서 감사드려요!",
      createdAt: "2024.07.05",
    },
  },
  {
    id: "4",
    user: {
      userId: "driver4",
      name: "김코드 기사님",
      email: "driver4@test.com",
      phoneNumber: "010-1234-5681",
      role: "DRIVER" as const,
      profile: {
        driverId: "driver4",
        nickname: "김코드 기사님",
        image: null,
        reviewCount: 150,
        rating: 4.7,
        careerYears: 8,
        confirmedCount: 220,
        likes: {
          likedCount: 65,
          isLikedByCurrentUser: true,
        },
      },
    },
    request: {
      requestId: "req4",
      serviceType: ["SMALL_MOVE" as const],
      departureAddress: "서울시 강남구",
      arrivalAddress: "서울시 송파구",
      requestStatement: "CONFIRMED" as const,
      moveAt: "2024.07.01",
      createdAt: "2024.06.15",
    },
    quotation: {
      quotationId: "quot4",
      departureAddress: "서울시 강남구",
      arrivalAddress: "서울시 송파구",
      quotationStatement: "ACCEPTED" as const,
      price: 210000,
      moveAt: "2024.07.01",
      createdAt: "2024.06.20",
    },
    review: {
      rating: 4,
      content:
        "상급 서비스였습니다. 물건 포장에서 약간의 아쉬움은 있었지만, 전반적으로 만족스러웠습니다.",
      createdAt: "2024.07.03",
    },
  },
];

const ITEMS_PER_PAGE = 6;

type TabType = "writable" | "written";

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState<TabType>("writable");
  const [writablePage, setWritablePage] = useState(1);
  const [writtenPage, setWrittenPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState<ReviewItem | null>(null);

  const currentData = activeTab === "writable" ? MOCK_WRITABLE_REVIEWS : MOCK_WRITTEN_REVIEWS;
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
    // TODO: API 호출로 리뷰 작성
    console.log("리뷰 작성:", {
      quotationId: selectedReviewItem?.quotation.quotationId,
      rating,
      content,
    });

    // 임시로 alert 표시
    alert(`리뷰가 작성되었습니다!\n평점: ${rating}점\n내용: ${content}`);
  };

  return (
    <div className="mx-auto min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
      {/* 탭 */}
      <div className="mx-auto mb-6 max-w-[1200px] border-b border-gray-200 md:mb-8">
        <div className="flex gap-8 md:gap-12">
          <button
            onClick={() => setActiveTab("writable")}
            className={`pb-3 text-sm font-medium transition-colors md:pb-4 md:text-base lg:text-lg ${
              activeTab === "writable"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            작성 가능한 리뷰
          </button>
          <button
            onClick={() => setActiveTab("written")}
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

      {/* 리뷰 카드 목록 */}
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
                onReviewClick={activeTab === "writable" ? () => handleReviewClick(item) : undefined}
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mx-auto max-w-[1200px]">
          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
