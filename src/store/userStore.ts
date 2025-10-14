import { create } from "zustand";
import { getUserProfile, updateUserProfile, updateBasicInfo } from "@/utils/hook/profile/profile";
import { UserData, UpdateUserProfileRequest, UpdateBasicInfoRequest } from "@/types/card";

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

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  //  프로필 조회
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getUserProfile();
      set({ user: data, isLoading: false });
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "프로필 불러오기 실패";
      console.error("[userStore] fetchUser 실패:", errorMsg);
      set({ error: errorMsg, isLoading: false });
      return null;
    }
  },

  // 프로필 수정 (Driver/Consumer)
  updateProfile: async (dto: UpdateUserProfileRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await updateUserProfile(dto);
      set({ user: updatedUser, isLoading: false });
      console.log("[userStore] 프로필 수정 완료:", updatedUser);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "프로필 수정 실패";
      console.error("[userStore] updateProfile 실패:", errorMsg);
      set({ error: errorMsg, isLoading: false });
      throw err;
    }
  },

  // 기본정보 + 비밀번호 변경
  updateBasicInfo: async (dto: UpdateBasicInfoRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await updateBasicInfo(dto);
      set({ user: updatedUser, isLoading: false });
      console.log("[userStore] 기본정보 수정 완료:", updatedUser);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "기본정보 수정 실패";
      console.error("[userStore] updateBasicInfo 실패:", errorMsg);
      set({ error: errorMsg, isLoading: false });
      throw err;
    }
  },

  // 프로필 직접 설정
  setUser: (user: UserData) => {
    set({ user, error: null });
  },

  // 프로필 초기화 (로그아웃 등)
  clearUser: () => {
    set({ user: null, error: null, isLoading: false });
  },
}));
