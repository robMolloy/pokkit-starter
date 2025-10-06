import { CenteredItemTemplate } from "@/components/layout/CenteredItemTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { listAuthMethods } from "@/modules/auth/_pokkit-auth/dbPokkitAuthUtils";
import { AuthNavigationForm } from "@/modules/auth/forms/AuthNavigationForm";
import { UnauthenticatedOnlyRoute } from "@/modules/auth/routeProtectors/UnauthenticatedOnlyRoute";
import { ErrorScreen } from "@/screens/ErrorScreen";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { AuthMethodsList } from "pocketbase";
import { useEffect, useState } from "react";

export default function Page() {
  const [authMethodsList, setAuthMethodsList] = useState<AuthMethodsList | null | undefined>();

  useEffect(() => {
    (async () => {
      const resp = await listAuthMethods({ pb });
      setAuthMethodsList(resp.success ? resp.data : null);
    })();
  }, []);

  if (authMethodsList === null) return <ErrorScreen />;
  if (authMethodsList === undefined) return <LoadingScreen />;
  return (
    <UnauthenticatedOnlyRoute>
      <CenteredItemTemplate>
        <AuthNavigationForm authMethodsList={authMethodsList} />
      </CenteredItemTemplate>
    </UnauthenticatedOnlyRoute>
  );
}
