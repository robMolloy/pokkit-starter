import { CenteredItemTemplate } from "@/components/layout/CenteredItemTemplate";
import { Button } from "@/components/ui/button";
import {
  FormFeedbackMessages,
  useFormFeedbackMessages,
} from "@/components/uiCustom/FormFeedbackMessages";
import { SimpleCard } from "@/components/uiCustom/SimpleCard";
import { pb } from "@/config/pocketbaseConfig";
import { signinWithOAuth2Google } from "@/modules/auth/_pokkit-auth/dbPokkitAuthUtils";
import { UnauthenticatedOnlyRoute } from "@/modules/auth/routeProtectors/UnauthenticatedOnlyRoute";
import Link from "next/link";

export default function Page() {
  const formFeedback = useFormFeedbackMessages();

  return (
    <UnauthenticatedOnlyRoute>
      <CenteredItemTemplate>
        <SimpleCard
          title="Sign in with oAuth2"
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
                const resp = await signinWithOAuth2Google({ pb });

                const fn = resp.success ? formFeedback.showSuccess : formFeedback.showError;
                fn(resp.messages);
              }}
            >
              Sign in with Google
            </Button>
          </div>
        </SimpleCard>
      </CenteredItemTemplate>
    </UnauthenticatedOnlyRoute>
  );
}
