import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { useCurrentUserStore } from "../currentUserStore/currentUserStore";

export const UnauthenticatedOnlyRoute = (p: { children: React.ReactNode }) => {
  const currentUserStore = useCurrentUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!!currentUserStore.data) router.push("/");
  }, [currentUserStore.data]);

  if (currentUserStore.data === undefined) return <LoadingScreen />;

  return p.children;
};
