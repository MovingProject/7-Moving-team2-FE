import { create } from "zustand";
import { UserProfileResponse } from "@/types/profile";

interface UserState {
  user: UserProfileResponse | null;
  setUser: (user: UserProfileResponse | null) => void;
  updateUser: (data: Partial<UserProfileResponse>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  updateUser: (data) =>
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...data } as UserProfileResponse;
      return { user: updatedUser } as Partial<UserState>;
    }),

  clearUser: () => set({ user: null }),
}));
