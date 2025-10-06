import { create } from "zustand";
import { TUser } from "../_pokkit-auth/pokkitAuthUtils";

type TCurrentUserStoreState = TUser | null | undefined;

export const useCurrentUserStore = create<{
  data: TCurrentUserStoreState;
  setData: (x: TCurrentUserStoreState) => void;
}>()((set) => ({
  data: undefined,
  setData: (data) => set(() => ({ data })),
}));
