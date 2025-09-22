import { useRouter } from "next/router";
import { useCurrentUserStore } from "../authDataStore";
import { useEffect } from "react";
import { LoadingScreen } from "@/screens/LoadingScreen";

export const UnauthenticatedOnlyRoute = (p: { children: React.ReactNode }) => {
  const currentUserStore = useCurrentUserStore();
  const router = useRouter();

  useEffect(() => {
    if (currentUserStore.data.authStatus === "loggedIn") router.push("/");
  }, [currentUserStore.data]);

  if (currentUserStore.data.authStatus === "loading") return <LoadingScreen />;

  return p.children;
};
