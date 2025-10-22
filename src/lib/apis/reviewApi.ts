import apiClient from "@/lib/apiClient";
import { ReviewData } from "@/types/card";

// 리뷰 작성 요청 타입
export interface CreateReviewRequest {
  rating: number;
  content: string;
  quotationId: string;
}

// 리뷰 작성 응답 타입
export interface CreateReviewResponse {
  id: string;
  consumerId: string;
  driverId: string;
  content: string;
  rating: number;
  quotationId: string;
  createdAt: string;
  updatedAt: string;
}

// 리뷰 목록 조회 응답 타입 (임시 - BE API가 구현되면 수정 필요)
export interface GetReviewsResponse {
  reviews: Array<{
    id: string;
    user: any; // DriverUser 타입
    request: any; // RequestData 타입
    quotation: any; // QuotationData 타입
    review?: ReviewData;
  }>;
  totalCount: number;
  page: number;
  totalPages: number;
}

/**
 * 리뷰 작성
 */
export const createReview = async (data: CreateReviewRequest): Promise<CreateReviewResponse> => {
  const response = await apiClient.post<CreateReviewResponse>("/reviews", data);
  return response.data;
};

/**
 * 작성 가능한 리뷰 목록 조회
 * TODO: BE API가 구현되면 실제 API 연동 필요
 */
export const getWritableReviews = async (
  page: number = 1,
  limit: number = 5
): Promise<GetReviewsResponse> => {
  // 임시로 빈 배열 반환
  // 실제 구현 시 아래와 같은 형태로 작성
  // const response = await apiClient.get<GetReviewsResponse>('/reviews/writable', {
  //   params: { page, limit }
  // });
  // return response.data;

  return {
    reviews: [],
    totalCount: 0,
    page,
    totalPages: 0,
  };
};

/**
 * 내가 작성한 리뷰 목록 조회
 * TODO: BE API가 구현되면 실제 API 연동 필요
 */
export const getWrittenReviews = async (
  page: number = 1,
  limit: number = 5
): Promise<GetReviewsResponse> => {
  // 임시로 빈 배열 반환
  // 실제 구현 시 아래와 같은 형태로 작성
  // const response = await apiClient.get<GetReviewsResponse>('/reviews/written', {
  //   params: { page, limit }
  // });
  // return response.data;

  return {
    reviews: [],
    totalCount: 0,
    page,
    totalPages: 0,
  };
};

/**
 * 특정 기사의 리뷰 목록 조회
 * TODO: BE API가 구현되면 실제 API 연동 필요
 */
export const getDriverReviews = async (
  driverId: string,
  page: number = 1,
  limit: number = 5
): Promise<GetReviewsResponse> => {
  // 임시로 빈 배열 반환
  // 실제 구현 시 아래와 같은 형태로 작성
  // const response = await apiClient.get<GetReviewsResponse>(`/reviews/driver/${driverId}`, {
  //   params: { page, limit }
  // });
  // return response.data;

  return {
    reviews: [],
    totalCount: 0,
    page,
    totalPages: 0,
  };
};
