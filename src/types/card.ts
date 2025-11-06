// types/card.ts
// profile.ts의 모든 타입을 이 파일에 통합

import { AreaType } from "./areaTypes";
import { ServerMoveType } from "./moveTypes";

// ===== 기본 프로필 데이터 타입 =====

export interface DriverProfileData {
  driverId: string;
  nickname: string;
  oneLiner?: string;
  image: string | null;
  reviewCount: number;
  rating: number;
  careerYears: number;
  confirmedCount: number;
  description?: string;
  driverServiceTypes?: ServerMoveType[];
  driverServiceAreas?: AreaType[];
  likes: {
    likedCount?: number;
    isLikedByCurrentUser?: boolean;
  };
}

export interface ConsumerProfileData {
  consumerId: string;
  image?: string | null;
  serviceType?: ServerMoveType;
  areas?: AreaType[];
}

export interface DriverUser {
  userId: string;
  name: string;
  nickname?: string;
  email: string;
  phoneNumber: string;
  role: "DRIVER";
  profile: DriverProfileData | null;
}

export interface ConsumerUser {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "CONSUMER";
  profile?: ConsumerProfileData | null;
}

export type UserData = DriverUser | ConsumerUser;

// ===== 프로필 수정 요청 타입 =====

export interface UpdateDriverProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;

  driverProfile: {
    nickname?: string;
    careerYears?: number;
    oneLiner?: string;
    description?: string;
    image?: string;
    rating?: number;
    driverServiceAreas?: string[]; // Area enum 값
    driverServiceTypes?: string[]; // MoveType enum 값
  };
}

export interface UpdateConsumerProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;

  consumerProfile: {
    serviceType?: string; // MoveType enum 값
    areas?: string; // Area enum 값
    image?: string;
  };
}

export type UpdateUserProfileRequest = UpdateDriverProfileRequest | UpdateConsumerProfileRequest;

export interface UpdateBasicInfoRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string;
  currentPassword?: string;
  newPassword?: string;
}

// 하위 호환성을 위한 별칭
export type UpdateUserProfileDto = UpdateUserProfileRequest;

// ===== 프로필 수정 응답 타입 =====

export interface ProfileUpdateResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;

  // Driver 프로필 필드
  nickname?: string;
  careerYears?: number;
  oneLiner?: string;
  description?: string;
  rating?: number;
  driverServiceAreas?: string[];
  driverServiceTypes?: string[];

  // Consumer 프로필 필드
  serviceType?: string;
  areas?: string;
  image?: string | null;
}

// ===== 요청 (Request) =====
export interface RequestData {
  requestId: string;
  serviceType: ServerMoveType[];
  departureAddress: string;
  arrivalAddress: string;
  requestStatement:
    | "PENDING"
    | "CONCLUDED"
    | "COMPLETE"
    | "CANCELLED"
    | "EXPIRED"
    | "WITHDRAWN"
    | "REJECTED";
  moveAt: string;
  createdAt: string;
  isInvited?: boolean;
}

// ===== 견적 (Quotation) =====
export interface QuotationData {
  quotationId: string;
  departureAddress: string;
  arrivalAddress: string;
  quotationStatement: "PENDING" | "CONCLUDED" | "COMPLETED" | "REJECTED" | "EXPIRED" | "CANCELLED";
  price: number;
  chattingRoomId?: string | null;
  moveAt: string;
  isLiked?: boolean;
  isInvited?: boolean;
  createdAt?: string | null;
  serviceType?: ServerMoveType;
}

// ===== 리뷰 (Review) =====
export interface ReviewData {
  rating: number;
  content: string;
  createdAt: string;
}
