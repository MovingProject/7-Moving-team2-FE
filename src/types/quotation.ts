import { DriverProfileData, QuotationData, RequestData } from "./card";
import { MoveType, ServerMoveType } from "./moveTypes";
import { QuotationStatement, RequestStatus } from "./statement";

export interface ApiResponseWrapper<T> {
  success: boolean;
  data: T; // T는 실제 데이터 (여기서는 CustomerAllRequestsResponse 배열)
}

// API 응답에 포함된 견적 상세 정보 (이전 답변의 Quotation 인터페이스)
export interface ApiQuotation {
  id: string;
  driverNickname: string;
  price: number;
  serviceType: ServerMoveType; // API 응답의 serviceType (단일 문자열)
  status: QuotationStatement;
  chattingRoomId: string | null;
  isLiked: boolean; // 좋아요 여부
  isInvited: boolean;
  driverProfile: {
    id: string;
    nickname: string;
    oneLiner: string;
    likeCount: number;
    reviewCount: number;
    phoneNumber: string;
    email: string;
    rating: number;
    careerYears: number;
    confirmedCount: number;
    image: string;
  };
}

/**
 * 고객의 모든 요청 목록 항목 (API 응답의 단일 Request 객체)
 * RequestData와 필드명이 불일치하는 부분을 오버라이드하여 명확하게 정의합니다.
 */
export interface ApiCustomerRequestWithQuotations {
  id: string;
  serviceType: ServerMoveType[];
  departureAddress: string;
  arrivalAddress: string;
  createdAt: string;
  moveAt: string;
  requestStatus: RequestStatus;
  additionalRequirements: string;
  quotations: ApiQuotation[];
}

// 최종 API 응답 타입 (배열)
export type CustomerAllRequestsResponse = ApiCustomerRequestWithQuotations[];

// ----------------------------------------------------------------------------------
// 기존 types/card.ts의 CustomerRequestWithQuotations 타입은
// 클라이언트 내부에서 RequestData와 QuotationData를 포함한 타입을 원하므로
// API 응답 타입으로 대체하거나, 사용하지 않도록 처리해야 합니다.
// 여기서는 API 응답 타입을 위와 같이 정의하고, 어댑터에서 RequestData로 매핑합니다.
// ----------------------------------------------------------------------------------

export interface ApiDriverQuotationItem {
  id: string; // 견적 ID (be7186a1-ac7d-4c18-8939-2d7a63e16d14)
  consumerName: string; // 고객 이름
  moveAt: string; // 이사 날짜 (2025-12-05T...)
  departureAddress: string;
  arrivalAddress: string;
  price: number;
  serviceType: ServerMoveType; // HOME_MOVE (단일 문자열)
  isInvited: boolean;
  quotationStatus: QuotationStatement;
}

// 훅에서 최종적으로 반환받는 배열 타입
export type DriverQuotationListResponse = ApiDriverQuotationItem[];

export interface DriverQuotationListItem {
  quotationId: string;
  price: number;
  serviceType: ServerMoveType[]; // UI 표기를 위해 배열로 유지
  quotationStatement: QuotationStatement; // UI에서 사용하기 위한 표준 상태

  // 견적이 속한 요청의 요약 정보
  requestSummary: {
    requestId: string; // 요청 ID (API에 없으므로 견적 ID 재활용 또는 Mock)
    consumerName: string; // 고객 이름
    departureAddress: string;
    arrivalAddress: string;
    moveAt: string;
  };

  isCustomerSeen: boolean; // 고객 응답/조회 여부 (API에 없으므로 Mock)
}
