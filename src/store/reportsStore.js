import { create } from "zustand";

export const useReportsStore = create((set) => ({
  dateFrom: "",
  dateTo: "",

  setDateFrom: (value) => set({ dateFrom: value }),
  setDateTo: (value) => set({ dateTo: value }),
}));
