import { CenteredItemTemplate } from "@/components/layout/CenteredItemTemplate";
import { SimpleCard } from "@/components/uiCustom/SimpleCard";
import { pb } from "@/config/pocketbaseConfig";
import { SignInWithOtpForm } from "@/modules/auth/forms/SignInWithOtpForm";
import { UnauthenticatedOnlyRoute } from "@/modules/auth/routeProtectors/UnauthenticatedOnlyRoute";

export default function Page() {
  return (
    <UnauthenticatedOnlyRoute>
      <CenteredItemTemplate>
        <SimpleCard title="Sign in with OTP">
          <SignInWithOtpForm pb={pb} />
        </SimpleCard>
      </CenteredItemTemplate>
    </UnauthenticatedOnlyRoute>
  );
}
