import { CustomIcon } from "@/components/CustomIcon";
import { Button } from "@/components/ui/button";
import {
  FormFeedbackMessages,
  useFormFeedbackMessages,
} from "@/components/uiCustom/FormFeedbackMessages";
import { PocketBase } from "@/config/pocketbaseConfig";
import { requestVerificationEmail } from "@/modules/auth/_pokkit-auth/dbPokkitAuthUtils";

export const AwaitingVerificationScreen = (p: { pb: PocketBase; email: string }) => {
  const formFeedback = useFormFeedbackMessages();
  return (
    <div className="flex flex-col items-center justify-center px-4 pt-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <CustomIcon iconName="Check" size="4xl" />
        </div>

        <div className="space-y-4 text-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Awaiting Verification</h2>
            <p className="mt-2 text-muted-foreground">
              The email address registered to your account is required to be verified before you can
              access the platform.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              You should receive an email when you first sign up. Check your spam folder if you
              don't see it or you can request a new one.
            </p>
            {formFeedback.messages && formFeedback.status && (
              <FormFeedbackMessages messages={formFeedback.messages} status={formFeedback.status} />
            )}
            <div>
              <Button
                onClick={async () => {
                  const resp = await requestVerificationEmail({ pb: p.pb, email: p.email });
                  const showMessagesFn = resp.success
                    ? formFeedback.showSuccess
                    : formFeedback.showError;
                  showMessagesFn(resp.messages);
                }}
              >
                Request Verification Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
