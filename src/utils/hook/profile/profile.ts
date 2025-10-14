// src/api/profile.ts
import apiClient from "@/lib/apiClient";
import {
  UserData,
  ConsumerProfileData,
  DriverProfileData,
  UpdateUserProfileRequest,
  UpdateBasicInfoRequest,
  ProfileUpdateResponse,
} from "@/types/card";
import { ServerMoveType } from "@/types/moveTypes";
import { AreaType } from "@/types/areaTypes";
import { useAuthStore } from "@/store/authStore";

interface RawUserResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string; // 서버가 phoneNumber 또는 tel 로 줄 수 있음
  tel?: string;
  role?: "CONSUMER" | "DRIVER"; // 서버에서 없을 수도 있어 추론 필요
  service?: string; // consumer용 서비스 타입 (enum string)
  region?: string; // consumer용 지역 (enum string)
  profileImage?: string | null;
  nickname?: string;
  careerYears?: string;

  // driver만 존재
  driverProfile?: {
    nickname: string;
    oneLiner?: string;
    image?: string | null;
    reviewCount: number;
    rating: number;
    careerYears: string;
    confirmedCount: number;
    driverServiceTypes?: Array<{ serviceType: string }>;
    driverServiceAreas?: Array<{ serviceArea: string }>;
    likeCount: number;
  };
}

/**
 * 프로필 조회 (GET /users/me)
 * 서버 응답: { success: boolean, data: RawUserResponse }
 */
export const getUserProfile = async (): Promise<UserData> => {
  const res = await apiClient.get<{ success: boolean; data: RawUserResponse }>("/users/me");
  const raw = res.data.data;

  const { user: authUser } = useAuthStore.getState();
  const storedRole = authUser?.role; // "DRIVER" or "CONSUMER"

  // 우선순위: 서버 role > 저장된 role > 추론
  const hasDriverProfile =
    typeof raw.driverProfile === "object" ||
    typeof (raw as { driver_profile?: unknown }).driver_profile === "object" ||
    typeof raw.nickname === "string" ||
    typeof raw.careerYears === "string";

  const role: "DRIVER" | "CONSUMER" =
    raw.role?.toUpperCase?.() === "DRIVER"
      ? "DRIVER"
      : raw.role?.toUpperCase?.() === "CONSUMER"
        ? "CONSUMER"
        : storedRole === "DRIVER"
          ? "DRIVER"
          : storedRole === "CONSUMER"
            ? "CONSUMER"
            : hasDriverProfile
              ? "DRIVER"
              : "CONSUMER";

  const phoneNumber = raw.phoneNumber ?? raw.tel ?? "";

  if (role === "CONSUMER") {
    return {
      userId: raw.id,
      name: raw.name,
      role,
      email: raw.email,
      phoneNumber,
      profile: {
        consumerId: raw.id,
        image: raw.profileImage ?? null,
        // 서버가 string으로 주므로 enum 캐스팅
        serviceType: raw.service ? (raw.service as ServerMoveType) : undefined,
        areas: raw.region ? (raw.region as AreaType) : undefined,
      } as ConsumerProfileData,
    };
  }

  // DRIVER
  const d = raw.driverProfile;
  return {
    userId: raw.id,
    name: raw.name,
    role,
    email: raw.email,
    phoneNumber,
    profile: {
      driverId: raw.id,
      nickname: d?.nickname ?? "",
      oneLiner: d?.oneLiner,
      image: d?.image ?? null,
      reviewCount: d?.reviewCount ?? 0,
      rating: d?.rating ?? 0,
      careerYears: d?.careerYears ?? "0",
      confirmedCount: d?.confirmedCount ?? 0,
      description: undefined,
      driverServiceTypes: d?.driverServiceTypes?.map((t) => t.serviceType as ServerMoveType) ?? [],
      driverServiceAreas: d?.driverServiceAreas?.map((a) => a.serviceArea as AreaType) ?? [],
      likes: {
        likedCount: d?.likeCount ?? 0,
        isLikedByCurrentUser: false,
      },
    } as DriverProfileData,
  };
};

/**
 * 프로필 수정 (PATCH /users/me/profile)
 * 서버 응답: { success: boolean, data: ProfileUpdateResponse }
 */
export const updateUserProfile = async (dto: UpdateUserProfileRequest): Promise<UserData> => {
  const res = await apiClient.patch<{ success: boolean; data: ProfileUpdateResponse }>(
    "/users/me/profile",
    dto
  );
  return transformProfileResponse(res.data.data);
};

/**
 * 기본정보 수정 (PATCH /users/me/profile)
 * 서버 응답: { success: boolean, data: ProfileUpdateResponse }
 */
export const updateBasicInfo = async (dto: UpdateBasicInfoRequest): Promise<UserData> => {
  const res = await apiClient.patch<{ success: boolean; data: ProfileUpdateResponse }>(
    "/users/me/profile",
    dto
  );
  return transformProfileResponse(res.data.data);
};

/**
 * 공통 응답 → UserData 변환
 * (PATCH 응답은 Driver/Consumer 공용 ProfileUpdateResponse)
 */
const transformProfileResponse = (data: ProfileUpdateResponse): UserData => {
  // DRIVER 응답 (닉네임 유무로 식별)
  if (data.nickname !== undefined) {
    return {
      userId: data.id,
      name: data.name,
      role: "DRIVER",
      email: data.email,
      phoneNumber: data.phoneNumber,
      profile: {
        driverId: data.id,
        nickname: data.nickname ?? "",
        oneLiner: data.oneLiner,
        image: data.image ?? null,
        reviewCount: 0, // 응답 없음 → 기본값
        rating: data.rating ?? 0,
        careerYears: data.careerYears ?? "0",
        confirmedCount: 0, // 응답 없음 → 기본값
        description: data.description ?? "",
        driverServiceTypes: data.driverServiceTypes?.map((t) => t as ServerMoveType) ?? [],
        driverServiceAreas: data.driverServiceAreas?.map((a) => a as AreaType) ?? [],
        likes: {
          likedCount: 0,
          isLikedByCurrentUser: false,
        },
      } as DriverProfileData,
    };
  }

  // CONSUMER 응답 (serviceType 유무로 식별)
  if (data.serviceType !== undefined) {
    return {
      userId: data.id,
      name: data.name,
      role: "CONSUMER",
      email: data.email,
      phoneNumber: data.phoneNumber,
      profile: {
        consumerId: data.id,
        image: data.image ?? null,
        serviceType: data.serviceType ? (data.serviceType as ServerMoveType) : undefined,
        areas: data.areas ? (data.areas as AreaType) : undefined,
      } as ConsumerProfileData,
    };
  }

  throw new Error("Invalid profile response");
};
