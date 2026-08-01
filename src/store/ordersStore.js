import { create } from "zustand";

export const useOrdersStore = create((set) => ({
  search: "",
  statusFilter: "all",

  setSearch: (value) => set({ search: value }),
  setStatusFilter: (value) => set({ statusFilter: value }),
}));
