import { LoadingScreen } from "@/screens/LoadingScreen";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { pb } from "@/config/pocketbaseConfig";
import { AwaitingVerificationScreen } from "@/screens/AwaitingVerificationScreen";
import { useCurrentUserStore } from "../currentUserStore/currentUserStore";

export const VerifiedUserOnlyRoute = (p: { children?: React.ReactNode }) => {
  const currentUserStore = useCurrentUserStore();
  const router = useRouter();

  useEffect(() => {
    if (currentUserStore.data === null) router.push("/auth");
  }, [currentUserStore.data]);

  if (currentUserStore.data === undefined) return <LoadingScreen />;

  if (!!currentUserStore.data && currentUserStore.data.verified)
    return <AwaitingVerificationScreen pb={pb} email={currentUserStore.data.email} />;

  return p.children;
};
