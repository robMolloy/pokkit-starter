import { CenteredItemTemplate } from "@/components/layout/CenteredItemTemplate";
import { SimpleCard } from "@/components/uiCustom/SimpleCard";
import { pb } from "@/config/pocketbaseConfig";
import { ConfirmPasswordResetForm } from "@/modules/auth/forms/ConfirmPasswordResetForm";
import { UnauthenticatedOnlyRoute } from "@/modules/auth/routeProtectors/UnauthenticatedOnlyRoute";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const token = router.query.token as string;
  const email = router.query.email as string;

  return (
    <UnauthenticatedOnlyRoute>
      <CenteredItemTemplate>
        <SimpleCard
          title="Confirm password reset"
          headerChildrenTop={
            <Link href="/auth" className="text-muted-foreground hover:underline">
              &lt; Back
            </Link>
          }
        >
          <ConfirmPasswordResetForm pb={pb} token={token} email={email} />
        </SimpleCard>
      </CenteredItemTemplate>
    </UnauthenticatedOnlyRoute>
  );
}
