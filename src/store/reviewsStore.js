import { create } from "zustand";

export const useReviewsStore = create((set) => ({
  search: "",
  ratingFilter: "all",

  setSearch: (value) => set({ search: value }),
  setRatingFilter: (value) => set({ ratingFilter: value }),
}));
