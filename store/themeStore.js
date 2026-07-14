import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "dark",
  background: {
    dark: "#121212",
    light: "#ffffff",
  },
  textColor: {
    dark: "#ffffff",
    light: "#000000",
  },
  toggleTheme: (newTheme) => set((state) => ({ theme: newTheme })),
}));
