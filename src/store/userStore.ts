import { create } from "zustand";
import { UserData } from "@/types/card";

interface UserState {
  user: UserData | null;
  setUser: (user: UserData | null | ((prev: UserData | null) => UserData | null)) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  // 유저 설정
  setUser: (user) =>
    set((state) => {
      if (typeof user === "function") {
        // 콜백 결과를 UserData로 단언
        const next = user(state.user) as UserData | null;
        return { user: next };
      }
      // 직접 전달된 경우도 UserData 단언
      return { user: user as UserData | null };
    }),
  // 로그아웃/초기화
  clearUser: () => set({ user: null }),
}));
