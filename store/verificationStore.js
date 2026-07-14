import { create } from "zustand";

export const useVerificationStore = create((set) => ({
  isVerifying: false,
  setIsVerifying: (value) => set({ isVerifying: value }),
}));