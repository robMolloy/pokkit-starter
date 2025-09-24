import { CenteredItemTemplate } from "@/components/layout/CenteredItemTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { AuthForm } from "@/modules/auth/AuthForm";
import { UnauthenticatedOnlyRoute } from "@/modules/auth/routeProtectors/UnauthenticatedOnlyRoute";

export default function Page() {
  return (
    <UnauthenticatedOnlyRoute>
      <CenteredItemTemplate>
        <AuthForm pb={pb} />
      </CenteredItemTemplate>
    </UnauthenticatedOnlyRoute>
  );
}
