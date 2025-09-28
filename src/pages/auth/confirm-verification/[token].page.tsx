import { CenteredItemTemplate } from "@/components/layout/CenteredItemTemplate";
import { useCurrentUserStore } from "@/modules/auth/authDataStore";
import { ConfirmVerificationScreen } from "@/screens/ConfirmVerificationScreen";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const currentUserStore = useCurrentUserStore();

  const token = router.query.token as string;

  if (token === undefined) return <LoadingScreen />;
  if (currentUserStore.data.authStatus === "loading") return <LoadingScreen />;

  return (
    <CenteredItemTemplate>
      <ConfirmVerificationScreen
        token={token}
        user={currentUserStore.data.authStatus === "loggedIn" ? currentUserStore.data.user : null}
      />
    </CenteredItemTemplate>
  );
}
