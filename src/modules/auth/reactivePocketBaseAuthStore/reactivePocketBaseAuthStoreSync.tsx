import PocketBase from "pocketbase";
import { useEffect } from "react";
import { useReactivePocketBaseAuthStore } from "./reactivePocketBaseAuthStore";
import { pocketBaseAuthStoreSchema, TPocketBaseAuthStore } from "../_pokkit-auth/pokkitAuthUtils";

export const useReactivePocketBaseAuthStoreSync = (p: {
  pb: PocketBase;
  onIsLoading: () => void;
  onIsLoggedIn: (user: TPocketBaseAuthStore) => void;
  onIsLoggedOut: () => void;
}) => {
  const reactiveBaseAuthStore = useReactivePocketBaseAuthStore();
  useEffect(() => {
    if (!p.pb.authStore.isValid) return reactiveBaseAuthStore.setData(null);

    const resp = pocketBaseAuthStoreSchema.safeParse(p.pb.authStore);
    reactiveBaseAuthStore.setData(resp.success ? resp.data : null);
  }, []);

  useEffect(() => {
    p.pb.authStore.onChange(() => {
      if (!p.pb.authStore.isValid) return reactiveBaseAuthStore.setData(null);

      const resp = pocketBaseAuthStoreSchema.safeParse(p.pb.authStore);
      reactiveBaseAuthStore.setData(resp.success ? resp.data : null);
    });
  }, []);

  useEffect(() => {
    if (reactiveBaseAuthStore.data === undefined) p.onIsLoading();
    if (reactiveBaseAuthStore.data === null) p.onIsLoggedOut();
    if (!!reactiveBaseAuthStore.data) p.onIsLoggedIn(reactiveBaseAuthStore.data);
  }, [reactiveBaseAuthStore.data]);
};
