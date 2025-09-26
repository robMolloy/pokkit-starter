import { CenteredItemTemplate } from "@/components/layout/CenteredItemTemplate";
import { SimpleCard } from "@/components/uiCustom/SimpleCard";
import { pb } from "@/config/pocketbaseConfig";
import { SignupWithEmailAndPasswordForm } from "@/modules/auth/forms/SignupWithEmailAndPasswordForm";
import { UnauthenticatedOnlyRoute } from "@/modules/auth/routeProtectors/UnauthenticatedOnlyRoute";
import Link from "next/link";

export default function Page() {
  return (
    <UnauthenticatedOnlyRoute>
      <CenteredItemTemplate>
        <SimpleCard
          title="Sign up with Email and Password"
          headerChildrenTop={
            <Link href="/auth" className="text-muted-foreground hover:underline">
              &lt; Back
            </Link>
          }
        >
          <SignupWithEmailAndPasswordForm pb={pb} />
        </SimpleCard>
      </CenteredItemTemplate>
    </UnauthenticatedOnlyRoute>
  );
}
