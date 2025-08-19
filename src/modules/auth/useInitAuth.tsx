import { pb } from "@/config/pocketbaseConfig";
import { subscribeToUser } from "@/modules/users/dbUsersUtils";
import {
  useCurrentUserStore,
  useUnverifiedIsLoggedInStore,
  useUnverifiedIsLoggedInSync,
} from "@/stores/authDataStore";
import { useEffect } from "react";

export const useInitAuth = (p: {
  onIsLoading: () => void;
  onIsLoggedIn: () => void;
  onIsLoggedOut: () => void;
}) => {
  const unverifiedIsLoggedInStore = useUnverifiedIsLoggedInStore();

  const currentUserStore = useCurrentUserStore();

  useUnverifiedIsLoggedInSync({ pb });

  useEffect(() => {
    // use anfn as return value is not cleanup
    (() => {
      if (unverifiedIsLoggedInStore.data.authStatus === "loggedOut")
        return currentUserStore.setData({ authStatus: "loggedOut" });

      if (unverifiedIsLoggedInStore.data.authStatus === "loading")
        return currentUserStore.setData({ authStatus: "loading" });

      if (unverifiedIsLoggedInStore.data.authStatus !== "loggedIn")
        return console.error("should never be hit");

      return subscribeToUser({
        pb,
        id: unverifiedIsLoggedInStore.data.user.record.id,
        onChange: (user) => {
          if (user) currentUserStore.setData({ authStatus: "loggedIn", user });
          else currentUserStore.setData({ authStatus: "loggedOut" });
        },
      });
    })();
  }, [unverifiedIsLoggedInStore.data]);

  useEffect(() => {
    if (currentUserStore.data.authStatus === "loading") return p.onIsLoading();
    if (currentUserStore.data.authStatus === "loggedIn") return p.onIsLoggedIn();
    if (currentUserStore.data.authStatus === "loggedOut") return p.onIsLoggedOut();

    console.error("should never be hit");
  }, [currentUserStore.data]);

  return currentUserStore.data;
};
