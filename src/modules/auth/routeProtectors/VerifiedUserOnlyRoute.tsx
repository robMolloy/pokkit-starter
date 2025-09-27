import { useRouter } from "next/router";
import { useCurrentUserStore } from "../authDataStore";
import { useEffect } from "react";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { BlockedScreen } from "@/screens/BlockedScreen";

import { AwaitingVerificationScreen } from "@/screens/AwaitingVerificationScreen";
import { pb } from "@/config/pocketbaseConfig";

export const VerifiedUserOnlyRoute = (p: { children?: React.ReactNode }) => {
  const currentUserStore = useCurrentUserStore();
  const router = useRouter();

  useEffect(() => {
    if (currentUserStore.data.authStatus === "loggedOut") router.push("/auth");
  }, [currentUserStore.data]);

  if (currentUserStore.data.authStatus === "loading") return <LoadingScreen />;

  if (
    currentUserStore.data.authStatus === "loggedIn" &&
    currentUserStore.data.user.status === "blocked"
  )
    return <BlockedScreen />;

  if (currentUserStore.data.authStatus === "loggedIn" && !currentUserStore.data.user.verified)
    return <AwaitingVerificationScreen pb={pb} email={currentUserStore.data.user.email} />;

  return p.children;
};
