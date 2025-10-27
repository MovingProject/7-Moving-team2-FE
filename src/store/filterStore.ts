import { create } from "zustand";

interface FilterStore {
  openFilter: string | null;
  toggleFilter: (key: string) => void;
  closeAll: () => void;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  openFilter: null,
  toggleFilter: (key) => {
    const current = get().openFilter;
    set({ openFilter: current === key ? null : key });
  },
  closeAll: () => set({ openFilter: null }),
}));
