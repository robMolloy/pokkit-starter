import { ErrorScreen404 } from "@/screens/Error404Screen";
import { useCurrentUserStore } from "../authDataStore";

export const AdminUserOnlyRoute = (p: { children?: React.ReactNode }) => {
  const currentUserStore = useCurrentUserStore();

  if (
    currentUserStore.data.authStatus === "loggedIn" &&
    currentUserStore.data.user.role === "admin"
  )
    return p.children;

  return <ErrorScreen404 />;
};
