import { CenteredItemTemplate } from "@/components/layout/CenteredItemTemplate";
import { Button } from "@/components/ui/button";
import {
  FormFeedbackMessages,
  useFormFeedbackMessages,
} from "@/components/uiCustom/FormFeedbackMessages";
import { SimpleCard } from "@/components/uiCustom/SimpleCard";
import { pb } from "@/config/pocketbaseConfig";
import { signupWithOAuth2Google } from "@/modules/auth/_pokkit-auth/dbPokkitAuthUtils";
import { UnauthenticatedOnlyRoute } from "@/modules/auth/routeProtectors/UnauthenticatedOnlyRoute";
import Link from "next/link";

export default function Page() {
  const formFeedback = useFormFeedbackMessages();

  return (
    <UnauthenticatedOnlyRoute>
      <CenteredItemTemplate>
        <SimpleCard
          title="Sign up with OAuth2"
          headerChildrenTop={
            <Link href="/auth" className="text-muted-foreground hover:underline">
              &lt; Back
            </Link>
          }
        >
          <div className="flex flex-col gap-4">
            {formFeedback.messages && formFeedback.status && (
              <FormFeedbackMessages messages={formFeedback.messages} status={formFeedback.status} />
            )}

            <Button
              className="w-full"
              onClick={async () => {
                const resp = await signupWithOAuth2Google({ pb });

                const fn = resp.success ? formFeedback.showSuccess : formFeedback.showError;
                fn(resp.messages);
              }}
            >
              Sign up with Google
            </Button>
          </div>
        </SimpleCard>
      </CenteredItemTemplate>
    </UnauthenticatedOnlyRoute>
  );
}
