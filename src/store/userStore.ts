import { create } from "zustand";
import apiClient from "@/lib/apiClient";
import { UserData } from "@/types/card";
import { UpdateUserProfileDto } from "@/types/profile";

interface UserState {
  user: UserData | null;
  fetchUser: () => Promise<UserData | null>;
  patchUserProfile: (dto: UpdateUserProfileDto) => Promise<void>;
  setUser: (user: UserData) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  fetchUser: async () => {
    try {
      const res = await apiClient.get<UserData>("/users/me");
      set({ user: res.data });
      return res.data;
    } catch (err) {
      console.error("[userStore] 프로필 불러오기 실패:", err);
      return null;
    }
  },

  patchUserProfile: async (dto) => {
    try {
      const res = await apiClient.patch<UserData>("/users/me/profile", dto);
      set({ user: res.data });
      console.log("[userStore] 프로필 수정 완료");
    } catch (err) {
      console.error("[userStore] 프로필 수정 실패:", err);
      throw err;
    }
  },

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
