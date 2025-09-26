import { CenteredItemTemplate } from "@/components/layout/CenteredItemTemplate";
import { SimpleCard } from "@/components/uiCustom/SimpleCard";
import { pb } from "@/config/pocketbaseConfig";
import { SigninWithEmailAndPasswordForm } from "@/modules/auth/forms/SigninWithEmailAndPasswordForm";
import { UnauthenticatedOnlyRoute } from "@/modules/auth/routeProtectors/UnauthenticatedOnlyRoute";
import Link from "next/link";

export default function Page() {
  return (
    <UnauthenticatedOnlyRoute>
      <CenteredItemTemplate>
        <SimpleCard
          title="Sign in with Email and Password"
          headerChildrenTop={
            <Link href="/auth" className="text-muted-foreground hover:underline">
              &lt; Back
            </Link>
          }
        >
          <SigninWithEmailAndPasswordForm pb={pb} />
        </SimpleCard>
      </CenteredItemTemplate>
    </UnauthenticatedOnlyRoute>
  );
}
