import { useEffect } from "react";
import { subscribeToUser } from "../_pokkit-auth/dbUsersUtils";
import { PocketBase, TUser, UnsubscribeFunc } from "../_pokkit-auth/pokkitAuthUtils";
import { useReactivePocketBaseAuthStoreSync } from "../reactivePocketBaseAuthStore/reactivePocketBaseAuthStoreSync";
import { useCurrentUserStore } from "./currentUserStore";

export const useCurrentUserStoreSync = (p: {
  pb: PocketBase;
  onIsLoading: () => void;
  onIsLoggedOut: () => void;
  onIsLoggedIn: (user: TUser) => void;
}) => {
  const currentUserStore = useCurrentUserStore();
  let unsubFunction: UnsubscribeFunc | undefined;

  useReactivePocketBaseAuthStoreSync({
    pb: p.pb,
    onIsLoading: () => {
      if (unsubFunction) {
        unsubFunction();
        unsubFunction = undefined;
      }
      currentUserStore.setData(undefined);
    },
    onIsLoggedIn: async (pocketBaseAuthStore) => {
      const resp = await subscribeToUser({
        pb: p.pb,
        id: pocketBaseAuthStore.record.id,
        onChange: (user) => currentUserStore.setData(user),
      });
      if (resp.success) unsubFunction = resp.data;
      else currentUserStore.setData(null);
    },
    onIsLoggedOut: () => {
      if (unsubFunction) {
        unsubFunction();
        unsubFunction = undefined;
      }
      currentUserStore.setData(null);
    },
  });

  useEffect(() => {
    if (currentUserStore.data === undefined) return p.onIsLoading();
    if (currentUserStore.data === null) return p.onIsLoggedOut();
    return p.onIsLoggedIn(currentUserStore.data);
  }, [currentUserStore.data]);
};
