// src/utils/hook/profile/profile.ts
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
  phoneNumber?: string;
  tel?: string;
  role?: "CONSUMER" | "DRIVER";
  service?: string;
  region?: string;
  profileId?: string;
  isProfileRegistered?: boolean;
  nickname?: string;
  careerYears?: string;
  bio?: string;
  experience?: string;
  description?: string;

  driverProfile?: {
    id: string;
    nickname?: string;
    oneLiner?: string;
    image?: string | null;
    reviewCount?: number;
    rating?: number;
    careerYears?: string;
    confirmedCount?: number;
    description?: string;
    driverServiceTypes?: string[];
    driverServiceAreas?: string[];
    likeCount?: number;
  };

  consumerProfile?: {
    id: string;
    image?: string | null;
    serviceType?: string;
    areas?: string[];
  };
}

// 프로필 조회 (GET /users/me)
export const getUserProfile = async (): Promise<UserData> => {
  const res = await apiClient.get<{ success: boolean; data: RawUserResponse }>("/users/me");
  const raw = res.data.data;
  const { user: authUser } = useAuthStore.getState();
  const storedRole = authUser?.role;

  const phoneNumber = raw.phoneNumber ?? raw.tel ?? "";

  let role: "DRIVER" | "CONSUMER" =
    raw.role?.toUpperCase?.() === "DRIVER"
      ? "DRIVER"
      : raw.role?.toUpperCase?.() === "CONSUMER"
        ? "CONSUMER"
        : storedRole === "DRIVER"
          ? "DRIVER"
          : "CONSUMER";

  // role fallback: 서버 role이 잘못 내려온 경우 보정
  // consumerProfile이 존재하거나, driverProfile이 없으면 consumer로 교정
  if (
    role === "DRIVER" &&
    !raw.driverProfile &&
    !Array.isArray(raw.service) &&
    !Array.isArray(raw.region)
  ) {
    console.warn("[getUserProfile] role 교정: DRIVER → CONSUMER");
    role = "CONSUMER";
  }

  // driverProfile이 존재하면 무조건 driver로 교정
  if (role === "CONSUMER" && raw.driverProfile) {
    console.warn("[getUserProfile] role 교정: CONSUMER → DRIVER");
    role = "DRIVER";
  }

  if (role === "DRIVER") {
    const d = (raw.driverProfile ?? {}) as NonNullable<RawUserResponse["driverProfile"]>;

    const driverProfile: DriverProfileData = {
      driverId: raw.id,
      nickname: raw.nickname ?? d.nickname ?? raw.name ?? "",
      oneLiner: d.oneLiner ?? raw.bio ?? "",
      image: d.image ?? null,
      reviewCount: d.reviewCount ?? 0,
      rating: d.rating ?? 0,
      careerYears: d.careerYears ?? raw.experience ?? "0",
      confirmedCount: d.confirmedCount ?? 0,
      description: d.description ?? raw.description ?? "",
      driverServiceTypes: Array.isArray(d.driverServiceTypes)
        ? (d.driverServiceTypes as ServerMoveType[])
        : Array.isArray(raw.service)
          ? (raw.service as ServerMoveType[])
          : raw.service
            ? [raw.service as ServerMoveType]
            : [],
      driverServiceAreas: Array.isArray(d.driverServiceAreas)
        ? (d.driverServiceAreas as AreaType[])
        : Array.isArray(raw.region)
          ? (raw.region as AreaType[])
          : raw.region
            ? [raw.region as AreaType]
            : [],
      likes: {
        likedCount: d.likeCount ?? 0,
        isLikedByCurrentUser: false,
      },
    };

    return {
      userId: raw.id,
      name: raw.name ?? "",
      role,
      email: raw.email,
      phoneNumber,
      profile: driverProfile,
    };
  }

  // CONSUMER
  if (role === "CONSUMER") {
    const consumerProfile: ConsumerProfileData = {
      consumerId: raw.id,
      image: null,
      serviceType: raw.service ? (raw.service as ServerMoveType) : undefined,
      areas: raw.region ? (raw.region as AreaType) : undefined,
    };

    if (!raw.service && !raw.region && raw.profileId) {
      consumerProfile.serviceType = undefined;
      consumerProfile.areas = undefined;
    }

    return {
      userId: raw.id,
      name: raw.name ?? "",
      role,
      email: raw.email,
      phoneNumber,
      profile: consumerProfile,
    };
  }

  throw new Error("Invalid profile response structure");
};

// 프로필 수정 (PATCH /users/me/profile)
export const updateUserProfile = async (dto: UpdateUserProfileRequest): Promise<UserData> => {
  console.log("[DEBUG] PATCH payload:", dto);
  const res = await apiClient.patch<{ success: boolean; data: ProfileUpdateResponse }>(
    "/users/me/profile",
    dto
  );
  return transformProfileResponse(res.data.data);
};

// 기본정보 수정 (PATCH /users/me/profile)
export const updateBasicInfo = async (dto: UpdateBasicInfoRequest): Promise<UserData> => {
  const res = await apiClient.patch<{ success: boolean; data: ProfileUpdateResponse }>(
    "/users/me/profile",
    dto
  );
  return transformProfileResponse(res.data.data);
};

// 타입 가드: driverProfile이 존재하는 구조인지 체크
function isDriverResponse(
  data: ProfileUpdateResponse
): data is ProfileUpdateResponse & { driverProfile: NonNullable<DriverProfileData> } {
  const record = data as unknown as Record<string, unknown>;
  return typeof record.driverProfile === "object" && record.driverProfile !== null;
}

// 타입 가드: consumerProfile이 존재하는 구조인지 체크
function isConsumerResponse(
  data: ProfileUpdateResponse
): data is ProfileUpdateResponse & { consumerProfile: NonNullable<ConsumerProfileData> } {
  const record = data as unknown as Record<string, unknown>;
  return typeof record.consumerProfile === "object" && record.consumerProfile !== null;
}

// ✅ 공통 응답 → UserData 변환
const transformProfileResponse = (data: ProfileUpdateResponse): UserData => {
  // 1️⃣ DRIVER 응답 (중첩 or 평면 구조 모두 커버)
  const driverData = isDriverResponse(data) ? data.driverProfile : data;

  if ("nickname" in driverData) {
    const driverProfile: DriverProfileData = {
      driverId: data.id,
      nickname: driverData.nickname ?? "",
      oneLiner: driverData.oneLiner,
      image: driverData.image ?? null,
      reviewCount: 0,
      rating: driverData.rating ?? 0,
      careerYears: driverData.careerYears ?? "0",
      confirmedCount: 0,
      description: driverData.description ?? "",
      driverServiceTypes: driverData.driverServiceTypes?.map((t) => t as ServerMoveType) ?? [],
      driverServiceAreas: driverData.driverServiceAreas?.map((a) => a as AreaType) ?? [],
      likes: { likedCount: 0, isLikedByCurrentUser: false },
    };

    return {
      userId: data.id,
      name: data.name,
      role: "DRIVER",
      email: data.email,
      phoneNumber: data.phoneNumber,
      profile: driverProfile,
    };
  }

  // 2️⃣ CONSUMER 응답 (중첩/평면 대응)
  const consumerData = isConsumerResponse(data) ? data.consumerProfile : data;

  if ("serviceType" in consumerData || "areas" in consumerData) {
    const consumerProfile: ConsumerProfileData = {
      consumerId: data.id,
      image: consumerData.image ?? null,
      serviceType: consumerData.serviceType as ServerMoveType | undefined,
      areas: consumerData.areas as AreaType | undefined,
    };

    return {
      userId: data.id,
      name: data.name,
      role: "CONSUMER",
      email: data.email,
      phoneNumber: data.phoneNumber,
      profile: consumerProfile,
    };
  }

  throw new Error("Invalid profile response structure");
};
