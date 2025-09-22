import { useRouter } from "next/router";
import { useCurrentUserStore } from "./authDataStore";
import { useEffect } from "react";
import { LoadingScreen } from "@/screens/LoadingScreen";

export const AuthenticatedOnlyRoute = (p: { children: React.ReactNode }) => {
  const currentUserStore = useCurrentUserStore();
  const router = useRouter();

  useEffect(() => {
    if (currentUserStore.data === null) router.push("/login");
  }, [currentUserStore.data]);

  if (currentUserStore.data === undefined) return <LoadingScreen />;

  return p.children;
};
