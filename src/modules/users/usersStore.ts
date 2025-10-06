import { create } from "zustand";
import { TUser } from "../auth/_pokkit-auth/pokkitAuthUtils";

type TState = TUser[];

export const useUsersStore = create<{
  data: TState;
  setData: (x: TState) => void;
  clear: () => void;
}>()((set) => ({
  data: [],
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: [] })),
}));
