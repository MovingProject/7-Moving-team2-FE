import { create } from "zustand";

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
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
