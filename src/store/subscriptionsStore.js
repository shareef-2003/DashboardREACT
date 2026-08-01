import { create } from "zustand";

export const useSubscriptionsStore = create((set) => ({
  search: "",
  planFilter: "all",

  setSearch: (value) => set({ search: value }),
  setPlanFilter: (value) => set({ planFilter: value }),
}));
