import { useRouter } from "next/router";
import { useCurrentUserStore } from "../authDataStore";
import { useEffect } from "react";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { BlockedScreen } from "@/screens/BlockedScreen";
import { AwaitingApprovalScreen } from "@/screens/AwaitingApprovalScreen";

export const ApprovedUserOnlyRoute = (p: { children?: React.ReactNode }) => {
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

  if (
    currentUserStore.data.authStatus === "loggedIn" &&
    currentUserStore.data.user.status === "pending"
  )
    return <AwaitingApprovalScreen />;

  return p.children;
};
