import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RoleType = "CONSUMER" | "DRIVER";

interface RoleState {
  role: RoleType;
  setRole: (r: RoleType) => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: "CONSUMER", // 기본값
      setRole: (r) => set({ role: r }),
    }),
    {
      name: "role-store", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
