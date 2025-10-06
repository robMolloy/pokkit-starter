import { useEffect } from "react";
import { subscribeToUser } from "../_pokkit-auth/dbUsersUtils";
import { PocketBase, TUser } from "../_pokkit-auth/pokkitAuthUtils";
import { useReactivePocketBaseAuthStoreSync } from "../reactivePocketBaseAuthStore/reactivePocketBaseAuthStoreSync";
import { useCurrentUserStore } from "./currentUserStore";

export const useCurrentUserStoreSync = (p: {
  pb: PocketBase;
  onIsLoading: () => void;
  onIsLoggedOut: () => void;
  onIsLoggedIn: (user: TUser) => void;
}) => {
  const currentUserStore = useCurrentUserStore();

  useReactivePocketBaseAuthStoreSync({
    pb: p.pb,
    onIsLoading: () => {
      currentUserStore.setData(undefined);
    },
    onIsLoggedIn: async (pocketBaseAuthStore) => {
      const resp = await subscribeToUser({
        pb: p.pb,
        id: pocketBaseAuthStore.record.id,
        onChange: (user) => currentUserStore.setData(user),
      });
      if (!resp.success) currentUserStore.setData(null);
    },
    onIsLoggedOut: () => {
      currentUserStore.setData(null);
    },
  });

  useEffect(() => {
    if (currentUserStore.data === undefined) p.onIsLoading();
    if (currentUserStore.data === null) p.onIsLoggedOut();
    if (!!currentUserStore.data) p.onIsLoggedIn(currentUserStore.data);
  }, [currentUserStore.data]);
};
