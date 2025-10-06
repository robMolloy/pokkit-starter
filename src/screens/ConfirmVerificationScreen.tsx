import { CustomIcon } from "@/components/CustomIcon";
import { Button } from "@/components/ui/button";
import {
  FormFeedbackMessages,
  useFormFeedbackMessages,
} from "@/components/uiCustom/FormFeedbackMessages";
import { SimpleCard } from "@/components/uiCustom/SimpleCard";
import { pb } from "@/config/pocketbaseConfig";
import { confirmVerificationEmail } from "@/modules/auth/_pokkit-auth/dbPokkitAuthUtils";
import { TUser } from "@/modules/auth/_pokkit-auth/pokkitAuthUtils";
import { useRouter } from "next/router";

export const ConfirmVerificationSuccessScreen = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center px-4 pt-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <CustomIcon iconName="Check" size="4xl" />
        </div>

        <div className="space-y-4 text-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Success!</h2>
            <p className="mt-2 text-muted-foreground">
              You have successfully verified your email address.
            </p>
            <Button onClick={() => router.push("/")}>Go Home</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConfirmVerificationScreen = (p: { user: TUser | null; token: string }) => {
  const formFeedback = useFormFeedbackMessages();

  const router = useRouter();

  return (
    <SimpleCard title="Confirm email verification">
      {formFeedback.status && formFeedback.messages && (
        <FormFeedbackMessages messages={formFeedback.messages} status={formFeedback.status} />
      )}
      {formFeedback.status !== "success" && (
        <Button
          className="w-full"
          onClick={async () => {
            const resp = await confirmVerificationEmail({ pb: pb, token: p.token });

            const showMessagesFn = resp.success ? formFeedback.showSuccess : formFeedback.showError;
            showMessagesFn(resp.messages);
          }}
        >
          Click to confirm email verification
        </Button>
      )}
      {formFeedback.status === "success" && (
        <Button className="w-full" onClick={async () => router.push("/")}>
          Go Home
        </Button>
      )}
    </SimpleCard>
  );
};
