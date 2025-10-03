import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RoleType = "CONSUMER" | "DRIVER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  createdAt: string;
  isProfileRegistered?: boolean;
  profileId?: string;
}

interface AuthState {
  user: User | null;
  _hasHydrated: boolean; // hydration 완료 여부
  setUser: (user: User) => void;
  clearUser: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      // localStorage 복원 완료 시 호출
      onRehydrateStorage: () => (state) => {
        console.log("[AuthStore] Hydration 완료, user:", state?.user);
        state?.setHasHydrated(true);
      },
      // user만 localStorage에 저장 (_hasHydrated는 제외)
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Hydration 완료 여부를 확인하는 훅
export const useHasHydrated = () => {
  return useAuthStore((state) => state._hasHydrated);
};
