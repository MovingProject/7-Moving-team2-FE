import { AreaType } from "./areaTypes";
import { ServerMoveType } from "./moveTypes";

export interface DriverProfileData {
  driverId: string;
  nickname: string;
  oneLiner?: string;
  image: string;
  reviewCount: number;
  rating: number;
  careerYears: number;
  confirmedCount: number;
  driverServiceTypes?: ServerMoveType[];
  driverServiceAreas?: AreaType[];
  likes: {
    likedCount?: number;
    isLikedByCurrentUser?: boolean;
  };
}
export interface ConsumerProfileData {
  consumerId: string;
  image?: string;
  serviceType?: ServerMoveType[];
  areas?: AreaType;
}

export interface DriverUser {
  userId: string;
  name: string;
  role: "DRIVER";
  email?: string;
  phoneNumber?: string;
  profile: DriverProfileData | null;
}

export interface ConsumerUser {
  userId: string;
  name: string;
  role: "CONSUMER";
  email?: string;
  phoneNumber?: string;
  profile?: ConsumerProfileData | null;
}

// 최종 유저 데이터 타입
export type UserData = DriverUser | ConsumerUser;

// 요청 (Request)
export interface RequestData {
  requestId: string;
  serviceType: ServerMoveType[];
  departureAddress: string;
  arrivalAddress: string;
  requestStatement: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED" | "COMPLETED";
  moveAt: string;
  createdAt: string;
}

// 견적 (Quotation)
export interface QuotationData {
  quotationId: string;
  departureAddress: string;
  arrivalAddress: string;
  quotationStatement: "SUBMITTED" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  price: number;
  moveAt: string;
  createdAt: string;
}

// 리뷰 (Review)
export interface ReviewData {
  rating: number;
  content: string;
  createdAt: string;
}
