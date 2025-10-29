import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RequestFormData, RequestDraftStore } from "@/types/request";

const initialDraftState: RequestFormData = {
  serviceType: null,
  moveAt: "",

  departureAddress: "",
  departureFloor: null,
  departureElevator: false,
  departurePyeong: null,

  arrivalAddress: "",
  arrivalFloor: null,
  arrivalElevator: false,
  arrivalPyeong: null,

  additionalRequirements: "",
};

export const useRequestDraftStore = create<RequestDraftStore>()(
  persist(
    (set) => ({
      ...initialDraftState,

      updateField: (key, value) => {
        set(() => ({ [key]: value }));
      },

      resetDraft: () => {
        set(initialDraftState);
      },
    }),
    {
      name: "request-draft-storage",
      storage: createJSONStorage(() => localStorage),

      // Hydration 오류 추적 및 디버깅
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.error("Draft hydration failed:", error);
          }
        };
      },
    }
  )
);
