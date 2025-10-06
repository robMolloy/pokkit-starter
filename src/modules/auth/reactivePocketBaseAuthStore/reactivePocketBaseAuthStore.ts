import { create } from "zustand";
import { TPocketBaseAuthStore } from "../_pokkit-auth/pokkitAuthUtils";

type TPocketBaseAuthStoreState = TPocketBaseAuthStore | null | undefined;

export const useReactivePocketBaseAuthStore = create<{
  data: TPocketBaseAuthStoreState;
  setData: (x: TPocketBaseAuthStoreState) => void;
}>()((set) => ({
  data: undefined,
  setData: (data) => set(() => ({ data })),
}));
