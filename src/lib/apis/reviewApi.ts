import apiClient from "@/lib/apiClient";
import { DriverUser, QuotationData, RequestData, ReviewData } from "@/types/card";
import { ServerMoveType } from "@/types/moveTypes";

/**
 * 공통 API 응답 래퍼 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * 리뷰 작성 요청 타입
 */
export interface CreateReviewRequest {
  rating: number;
  content: string;
  quotationId: string;
}

/**
 * 리뷰 작성 응답 타입
 */
export interface CreateReviewResponse {
  id: string;
  consumerId: string;
  driverId: string;
  content: string;
  rating: number;
  quotationId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/**
 * 개별 리뷰 응답 타입
 */
export interface ReviewResponseDto {
  id: string;
  rating: number;
  content: string;
  consumerName: string;
  createdAt: string;
}

/**
 * 기사별 리뷰 목록 조회 응답 타입 (커서 기반 페이지네이션)
 */
export interface GetDriverReviewsData {
  reviews: ReviewResponseDto[];
  nextCursor: string | null;
}

/**
 * 기사 평점 분포 응답 타입
 */
export interface DriverRatingDistributionResponse {
  driverId: string;
  totalReviews: number;
  averageRating: number;
  ratings: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/**
 * Consumer의 견적 정보 (백엔드 응답)
 */
export interface ConsumerQuotationDto {
  quotationId: string;
  driverId: string;
  driverName: string;
  driverNickname: string;
  driverImage: string | null;
  driverReviewCount: number;
  driverRating: number;
  driverCareerYears: number;
  driverConfirmedCount: number;
  requestId: string;
  serviceType: ServerMoveType[];
  departureAddress: string;
  arrivalAddress: string;
  price: number;
  quotationStatus: "PENDING" | "CONCLUDED" | "COMPLETED" | "REJECTED" | "EXPIRED" | "CANCELLED";
  moveAt: string;
  createdAt: string;
  hasReview: boolean;
  review?: {
    id: string;
    rating: number;
    content: string;
    createdAt: string;
  } | null;
}

/**
 * ReviewItem 타입 (프론트엔드에서 사용)
 */
export interface ReviewItem {
  id: string;
  user: DriverUser;
  request: RequestData;
  quotation: QuotationData;
  review?: ReviewData;
}

interface NestedApiResponse<T> {
  success: boolean;
  data: T | { success: boolean; data: T };
}

/**
 * 백엔드 응답을 프론트엔드 타입으로 변환
 */
const mapConsumerQuotationToReviewItem = (dto: ConsumerQuotationDto): ReviewItem => {
  return {
    id: dto.quotationId,
    user: {
      userId: dto.driverId,
      name: dto.driverName,
      nickname: dto.driverNickname,
      email: "", // 백엔드에서 제공하지 않음
      phoneNumber: "", // 백엔드에서 제공하지 않음
      role: "DRIVER",
      profile: {
        driverId: dto.driverId,
        nickname: dto.driverNickname,
        image: dto.driverImage,
        reviewCount: dto.driverReviewCount,
        rating: dto.driverRating,
        careerYears: dto.driverCareerYears,
        confirmedCount: dto.driverConfirmedCount,
        likes: {
          likedCount: 0,
          isLikedByCurrentUser: false,
        },
      },
    },
    request: {
      requestId: dto.requestId,
      serviceType: dto.serviceType,
      departureAddress: dto.departureAddress,
      arrivalAddress: dto.arrivalAddress,
      requestStatement: "CONCLUDED",
      moveAt: new Date(dto.moveAt)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ".")
        .replace(/\.$/, ""),
      createdAt: new Date(dto.createdAt)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ".")
        .replace(/\.$/, ""),
    },
    quotation: {
      quotationId: dto.quotationId,
      departureAddress: dto.departureAddress,
      arrivalAddress: dto.arrivalAddress,
      quotationStatement: dto.quotationStatus,
      price: dto.price,
      moveAt: new Date(dto.moveAt)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ".")
        .replace(/\.$/, ""),
      createdAt: new Date(dto.createdAt)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ".")
        .replace(/\.$/, ""),
      serviceType: dto.serviceType[0],
    },
    review: dto.review
      ? {
          rating: dto.review.rating,
          content: dto.review.content,
          createdAt: new Date(dto.review.createdAt)
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\. /g, ".")
            .replace(/\.$/, ""),
        }
      : undefined,
  };
};

/**
 * 리뷰 작성
 */
export const createReview = async (data: CreateReviewRequest): Promise<CreateReviewResponse> => {
  const response = await apiClient.post<ApiResponse<CreateReviewResponse>>("/reviews", data);
  return response.data.data;
};

/**
 * Consumer의 견적 목록 조회 (CONCLUDED, COMPLETED 모두 포함)
 * 프론트엔드에서 리뷰 작성 여부에 따라 필터링
 */
export const getConsumerQuotations = async (): Promise<ReviewItem[]> => {
  const response = await apiClient.get<NestedApiResponse<ConsumerQuotationDto[]>>(
    "/quotations/consumer/quotations"
  );
  const nestedData = response.data?.data;
  const quotations = Array.isArray(nestedData)
    ? nestedData
    : Array.isArray(nestedData?.data)
      ? nestedData.data
      : [];

  return quotations.map(mapConsumerQuotationToReviewItem);
};

/**
 * 작성 가능한 리뷰 목록 조회
 * COMPLETED 상태 + 리뷰 없음
 */
export const getWritableReviews = async (): Promise<ReviewItem[]> => {
  const allQuotations = await getConsumerQuotations();
  return allQuotations.filter(
    (item) => item.quotation.quotationStatement === "COMPLETED" && !item.review
  );
};

/**
 * 내가 작성한 리뷰 목록 조회
 * COMPLETED 상태 + 리뷰 있음
 */
export const getWrittenReviews = async (): Promise<ReviewItem[]> => {
  const allQuotations = await getConsumerQuotations();
  return allQuotations.filter(
    (item) => item.quotation.quotationStatement === "COMPLETED" && item.review
  );
};

/**
 * 특정 기사의 리뷰 목록 조회 (커서 기반 페이지네이션)
 */
export const getDriverReviews = async (
  driverId: string,
  limit: number = 5,
  cursor?: string
): Promise<GetDriverReviewsData> => {
  const params: { limit: number; cursor?: string } = { limit };
  if (cursor) {
    params.cursor = cursor;
  }

  const response = await apiClient.get<ApiResponse<GetDriverReviewsData>>(
    `/reviews/drivers/${driverId}`,
    { params }
  );
  return response.data.data;
};

/**
 * 특정 기사의 평점 분포 조회
 */
export const getDriverRatingDistribution = async (
  driverId: string
): Promise<DriverRatingDistributionResponse> => {
  const response = await apiClient.get<ApiResponse<DriverRatingDistributionResponse>>(
    `/reviews/drivers/${driverId}/rating`
  );
  return response.data.data;
};
