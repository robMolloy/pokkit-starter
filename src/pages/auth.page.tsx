import { CenteredItemTemplate } from "@/components/layout/CenteredItemTemplate";
import { AuthNavigationForm } from "@/modules/auth/forms/AuthNavigationForm";
import { UnauthenticatedOnlyRoute } from "@/modules/auth/routeProtectors/UnauthenticatedOnlyRoute";

export default function Page() {
  return (
    <UnauthenticatedOnlyRoute>
      <CenteredItemTemplate>
        <AuthNavigationForm />
      </CenteredItemTemplate>
    </UnauthenticatedOnlyRoute>
  );
}
