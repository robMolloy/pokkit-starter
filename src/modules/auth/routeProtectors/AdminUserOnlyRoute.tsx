import { Error404Screen } from "@/screens/Error404Screen";
import { useCurrentUserStore } from "../authDataStore";
import { ApprovedUserOnlyRoute } from "./ApprovedUserOnlyRoute";
import { useEffect } from "react";

export const AdminUserOnlyRoute = (p: { children: React.ReactNode; onNotAdmin?: () => void }) => {
  const currentUserStore = useCurrentUserStore();

  const isAdmin =
    currentUserStore.data.authStatus === "loggedIn" && currentUserStore.data.user.role === "admin";

  useEffect(() => {
    if (currentUserStore.data.authStatus === "loading") return;

    if (!isAdmin) return p.onNotAdmin?.();
  }, [currentUserStore.data]);

  if (isAdmin) return <ApprovedUserOnlyRoute>{p.children}</ApprovedUserOnlyRoute>;

  return <Error404Screen />;
};
