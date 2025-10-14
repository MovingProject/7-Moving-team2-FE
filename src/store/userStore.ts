import { create } from "zustand";
import apiClient from "@/lib/apiClient";
import {
  UserData,
  DriverProfileData,
  ConsumerProfileData,
  UpdateUserProfileRequest,
  UpdateBasicInfoRequest,
  ProfileUpdateResponse,
} from "@/types/card";

interface UserState {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;

  // 조회
  fetchUser: () => Promise<UserData | null>;

  // 수정
  updateProfile: (dto: UpdateUserProfileRequest) => Promise<void>;
  updateBasicInfo: (dto: UpdateBasicInfoRequest) => Promise<void>;

  // 관리
  setUser: (user: UserData) => void;
  clearUser: () => void;
}

/**
 * 백엔드 응답(PartialUserProfile)을 프론트 타입(UserData)으로 변환
 */
const transformProfileResponse = (
  data: ProfileUpdateResponse,
  currentUser: UserData | null
): UserData => {
  // Driver 필드 감지
  if (data.nickname !== undefined) {
    const driverProfile: DriverProfileData = {
      driverId: data.id,
      nickname: data.nickname || "",
      oneLiner: data.oneLiner,
      image: data.image ?? null, // undefined → null 로 통일
      rating: data.rating ?? 0,
      careerYears: data.careerYears ?? "0",
      reviewCount:
        currentUser?.role === "DRIVER" ? ((currentUser.profile as any)?.reviewCount ?? 0) : 0,
      confirmedCount:
        currentUser?.role === "DRIVER" ? ((currentUser.profile as any)?.confirmedCount ?? 0) : 0,
      driverServiceTypes: data.driverServiceTypes as any,
      driverServiceAreas: data.driverServiceAreas as any,
      likes:
        currentUser?.role === "DRIVER"
          ? (currentUser.profile as any)?.likes
          : { likedCount: 0, isLikedByCurrentUser: false },
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

  // Consumer 필드 감지
  if (data.serviceType !== undefined) {
    const consumerProfile: ConsumerProfileData = {
      consumerId: data.id,
      image: data.image ?? undefined, // null → undefined 로 통일
      serviceType: data.serviceType as any,
      areas: data.areas as any,
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

  throw new Error("프로필 변환 실패: 유효한 필드가 없습니다");
};

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  /**
   * 프로필 조회
   * GET /users/me
   */
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.get<UserData>("/users/me");
      set({ user: res.data, isLoading: false });
      return res.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "프로필 불러오기 실패";
      console.error("[userStore] fetchUser 실패:", errorMsg);
      set({ error: errorMsg, isLoading: false });
      return null;
    }
  },

  /**
   * 프로필 수정 (Driver/Consumer)
   * PATCH /users/me/profile
   *
   * @param dto - driverProfile 또는 consumerProfile 포함
   */
  updateProfile: async (dto: UpdateUserProfileRequest) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.patch<ProfileUpdateResponse>("/users/me/profile", dto);

      const currentUser = get().user;
      const updatedUser = transformProfileResponse(res.data, currentUser);

      set({ user: updatedUser, isLoading: false });
      console.log("[userStore] 프로필 수정 완료:", updatedUser);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "프로필 수정 실패";
      console.error("[userStore] updateProfile 실패:", errorMsg);
      set({ error: errorMsg, isLoading: false });
      throw err;
    }
  },

  /**
   * 기본정보 + 비밀번호 변경
   * PATCH /users/me/profile
   *
   * @param dto - name, phoneNumber, currentPassword, newPassword 등
   */
  updateBasicInfo: async (dto: UpdateBasicInfoRequest) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.patch<ProfileUpdateResponse>("/users/me/profile", dto);

      const currentUser = get().user;
      const updatedUser = transformProfileResponse(res.data, currentUser);

      set({ user: updatedUser, isLoading: false });
      console.log("[userStore] 기본정보 수정 완료:", updatedUser);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "기본정보 수정 실패";
      console.error("[userStore] updateBasicInfo 실패:", errorMsg);
      set({ error: errorMsg, isLoading: false });
      throw err;
    }
  },

  /**
   * 프로필 직접 설정
   */
  setUser: (user: UserData) => {
    set({ user, error: null });
  },

  /**
   * 프로필 초기화 (로그아웃 등)
   */
  clearUser: () => {
    set({ user: null, error: null, isLoading: false });
  },
}));
