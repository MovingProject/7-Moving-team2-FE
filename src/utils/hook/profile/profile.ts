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
  service?: string; // consumer용 서비스 타입 (enum string)
  region?: string; // consumer용 지역 (enum string)
  profileId?: string;
  isProfileRegistered?: boolean;
  nickname?: string;
  careerYears?: string;

  // driver
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
}

// 프로필 조회 (GET /users/me)
export const getUserProfile = async (): Promise<UserData> => {
  const res = await apiClient.get<{ success: boolean; data: RawUserResponse }>("/users/me");
  const raw = res.data.data;

  const { user: authUser } = useAuthStore.getState();
  const storedRole = authUser?.role; // "DRIVER" or "CONSUMER"

  // 우선순위: 서버 role > 저장된 role > 추론
  const hasDriverProfile =
    !!raw.driverProfile ||
    !!raw.nickname ||
    !!raw.careerYears ||
    raw.role?.toUpperCase() === "DRIVER";

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
    const consumerProfile: ConsumerProfileData = {
      consumerId: raw.id,
      image: null,
      serviceType: raw.service ? (raw.service as ServerMoveType) : undefined,
      areas: raw.region ? (raw.region as AreaType) : undefined,
    };

    // 백엔드가 consumerProfile 대신 profileId만 준 경우
    if (!raw.service && !raw.region && raw.profileId) {
      consumerProfile.serviceType = undefined;
      consumerProfile.areas = undefined;
    }

    return {
      userId: raw.id,
      name: raw.name,
      role,
      email: raw.email,
      phoneNumber,
      profile: consumerProfile,
    };
  }

  // DRIVER
  const d = (raw.driverProfile ?? {}) as NonNullable<RawUserResponse["driverProfile"]>;
  const driverProfile: DriverProfileData = {
    driverId: raw.id,
    nickname: d.nickname ?? "",
    oneLiner: d.oneLiner ?? "",
    image: d.image ?? null,
    reviewCount: d.reviewCount ?? 0,
    rating: d.rating ?? 0,
    careerYears: d.careerYears ?? "0",
    confirmedCount: d.confirmedCount ?? 0,
    description: d.description ?? "",
    driverServiceTypes: Array.isArray(d.driverServiceTypes)
      ? (d.driverServiceTypes as ServerMoveType[])
      : [],
    driverServiceAreas: Array.isArray(d.driverServiceAreas)
      ? (d.driverServiceAreas as AreaType[])
      : [],
    likes: {
      likedCount: d.likeCount ?? 0,
      isLikedByCurrentUser: false,
    },
  };

  return {
    userId: raw.id,
    name: raw.name,
    role,
    email: raw.email,
    phoneNumber,
    profile: driverProfile,
  };
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

// 공통 응답 → UserData 변환
const transformProfileResponse = (data: ProfileUpdateResponse): UserData => {
  // DRIVER 응답 (닉네임 유무로 식별)
  if (data.nickname !== undefined) {
    const driverProfile: DriverProfileData = {
      driverId: data.id,
      nickname: data.nickname ?? "",
      oneLiner: data.oneLiner,
      image: data.image ?? null,
      reviewCount: 0,
      rating: data.rating ?? 0,
      careerYears: data.careerYears ?? "0",
      confirmedCount: 0,
      description: data.description ?? "",
      driverServiceTypes: data.driverServiceTypes?.map((t) => t as ServerMoveType) ?? [],
      driverServiceAreas: data.driverServiceAreas?.map((a) => a as AreaType) ?? [],
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

  // CONSUMER 응답 (serviceType 유무로 식별)
  const consumerProfileData = (
    data as unknown as { consumerProfile?: Partial<ConsumerProfileData> }
  ).consumerProfile;

  const serviceType = data.serviceType ?? consumerProfileData?.serviceType ?? undefined;
  const areas = data.areas ?? consumerProfileData?.areas ?? undefined;
  const image = data.image ?? consumerProfileData?.image ?? null;

  if (serviceType !== undefined || areas !== undefined) {
    const consumerProfile: ConsumerProfileData = {
      consumerId: data.id,
      image,
      serviceType: serviceType as ServerMoveType | undefined,
      areas: areas as AreaType | undefined,
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
