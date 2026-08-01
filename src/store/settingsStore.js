import { create } from "zustand";

export const useSettingsStore = create((set) => ({
  name: "مدير النظام",
  email: "admin@serva.com",
  phone: "0550000000",
  language: "ar",
  theme: "light",
  notifications: true,

  setField: (key, value) => set({ [key]: value }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));
