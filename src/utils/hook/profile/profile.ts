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

/** /users/me 응답: 평면 구조 */
interface RawUserResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  tel?: string;
  role?: "CONSUMER" | "DRIVER";
  profileType?: "CONSUMER" | "DRIVER";
  service?: ServerMoveType[]; // 배열
  region?: AreaType[]; // 배열
  profileId?: string;
  isProfileRegistered?: boolean;
  nickname?: string;
  bio?: string;
  experience?: number;
  description?: string;
  image?: string | null;
  likeCount?: number;
  rating?: number;
  reviewCount?: number;
  confirmedCount?: number;
}

/** PATCH 응답이 평면으로 내려오는 케이스까지 안전하게 커버하기 위한 보조 타입 */
type FlatDriverPatch = ProfileUpdateResponse & {
  nickname?: string;
  oneLiner?: string;
  bio?: string;
  image?: string | null;
  description?: string;

  rating?: number;
  reviewCount?: number;
  experience?: number;
  careerYears?: number;
  confirmedCount?: number;
  likeCount?: number;

  driverServiceTypes?: ServerMoveType[];
  driverServiceAreas?: AreaType[];

  service?: ServerMoveType[]; // 일부 백엔드는 이 키도 씀
  region?: AreaType[];
};

/** ✅ 프로필 조회 (GET /users/me) */
export const getUserProfile = async (): Promise<UserData> => {
  const res = await apiClient.get<{ success: boolean; data: RawUserResponse }>("/users/me");
  const raw = res.data.data;
  const { user: authUser } = useAuthStore.getState();
  const storedRole = authUser?.role;
  const phoneNumber = raw.phoneNumber ?? raw.tel ?? "";

  const role: "DRIVER" | "CONSUMER" =
    raw.role?.toUpperCase?.() === "DRIVER"
      ? "DRIVER"
      : raw.role?.toUpperCase?.() === "CONSUMER"
        ? "CONSUMER"
        : raw.profileType === "DRIVER"
          ? "DRIVER"
          : raw.profileType === "CONSUMER"
            ? "CONSUMER"
            : storedRole === "DRIVER"
              ? "DRIVER"
              : "CONSUMER";

  if (role === "DRIVER") {
    const driverProfile: DriverProfileData = {
      driverId: raw.id,
      nickname: raw.nickname ?? raw.name ?? "",
      oneLiner: raw.bio ?? "",
      image: raw.image ?? null,
      reviewCount: raw.reviewCount ?? 0,
      rating: raw.rating ?? 0,
      careerYears: raw.experience ?? 0,
      confirmedCount: raw.confirmedCount ?? 0,
      description: raw.description ?? "",
      driverServiceTypes: raw.service ?? [],
      driverServiceAreas: raw.region ?? [],
      likes: {
        likedCount: raw.likeCount ?? 0,
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
  const consumerProfile: ConsumerProfileData = {
    consumerId: raw.id,
    image: raw.image ?? null,
    serviceType: raw.service ? raw.service[0] : undefined, // 단일 선택 유지
    areas: raw.region ?? [], // 배열
  };

  return {
    userId: raw.id,
    name: raw.name ?? "",
    role,
    email: raw.email,
    phoneNumber,
    profile: consumerProfile,
  };
};

/** ✅ 프로필 수정 (PATCH /users/me/profile) */
export const updateUserProfile = async (dto: UpdateUserProfileRequest): Promise<UserData> => {
  const res = await apiClient.patch<{ success: boolean; data: ProfileUpdateResponse }>(
    "/users/me/profile",
    dto
  );
  return transformProfileResponse(res.data.data);
};

/** ✅ 기본정보 수정 (PATCH /users/me/profile) */
export const updateBasicInfo = async (dto: UpdateBasicInfoRequest): Promise<UserData> => {
  const res = await apiClient.patch<{ success: boolean; data: ProfileUpdateResponse }>(
    "/users/me/profile",
    dto
  );
  return transformProfileResponse(res.data.data);
};

/** 타입 가드: driverProfile이 존재하는 구조인지 */
function isDriverResponse(
  data: ProfileUpdateResponse
): data is ProfileUpdateResponse & { driverProfile: NonNullable<DriverProfileData> } {
  const record = data as unknown as Record<string, unknown>;
  return typeof record.driverProfile === "object" && record.driverProfile !== null;
}

/** 타입 가드: consumerProfile이 존재하는 구조인지 */
function isConsumerResponse(
  data: ProfileUpdateResponse
): data is ProfileUpdateResponse & { consumerProfile: NonNullable<ConsumerProfileData> } {
  const record = data as unknown as Record<string, unknown>;
  return typeof record.consumerProfile === "object" && record.consumerProfile !== null;
}

/** ✅ 공통 응답 → UserData 변환 (PATCH용) */
const transformProfileResponse = (data: ProfileUpdateResponse): UserData => {
  // DRIVER 응답 (중첩 or 평면 모두 커버)
  const driverData: DriverProfileData | FlatDriverPatch = isDriverResponse(data)
    ? data.driverProfile
    : (data as FlatDriverPatch);

  if ("nickname" in driverData) {
    const driverProfile: DriverProfileData = {
      driverId: data.id,
      nickname: driverData.nickname ?? "",
      oneLiner:
        (driverData as FlatDriverPatch).oneLiner ?? (driverData as FlatDriverPatch).bio ?? "",
      image: (driverData as FlatDriverPatch).image ?? null,
      reviewCount: (driverData as FlatDriverPatch).reviewCount ?? 0,
      rating: (driverData as FlatDriverPatch).rating ?? 0,
      careerYears:
        (driverData as FlatDriverPatch).careerYears ??
        (driverData as FlatDriverPatch).experience ??
        0,
      confirmedCount: (driverData as FlatDriverPatch).confirmedCount ?? 0,
      description: (driverData as FlatDriverPatch).description ?? "",
      driverServiceTypes:
        (driverData as FlatDriverPatch).driverServiceTypes ??
        (driverData as FlatDriverPatch).service ??
        [],
      driverServiceAreas:
        (driverData as FlatDriverPatch).driverServiceAreas ??
        (driverData as FlatDriverPatch).region ??
        [],
      likes: {
        likedCount: (driverData as FlatDriverPatch).likeCount ?? 0,
        isLikedByCurrentUser: false,
      },
    };

    return {
      userId: data.id,
      name: data.name,
      role: "DRIVER",
      email: data.email,
      phoneNumber: (data as FlatDriverPatch).phoneNumber ?? "",
      profile: driverProfile,
    };
  }

  // CONSUMER 응답 (중첩/평면 대응)
  const consumerData = isConsumerResponse(data) ? data.consumerProfile : (data as FlatDriverPatch);

  if (
    "serviceType" in consumerData ||
    "areas" in consumerData ||
    "region" in (consumerData as FlatDriverPatch)
  ) {
    const consumerProfile: ConsumerProfileData = {
      consumerId: data.id,
      image: (consumerData as FlatDriverPatch).image ?? (data as FlatDriverPatch).image ?? null,
      serviceType:
        "serviceType" in consumerData
          ? (consumerData as ConsumerProfileData).serviceType
          : (consumerData as FlatDriverPatch).service
            ? (consumerData as FlatDriverPatch).service![0]
            : undefined,
      areas:
        "areas" in consumerData
          ? (consumerData as ConsumerProfileData).areas
          : ((consumerData as FlatDriverPatch).region ?? []),
    };

    return {
      userId: data.id,
      name: data.name,
      role: "CONSUMER",
      email: data.email,
      phoneNumber: (data as FlatDriverPatch).phoneNumber ?? "",
      profile: consumerProfile,
    };
  }

  throw new Error("Invalid profile response structure");
};
