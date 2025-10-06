import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormFeedbackMessages,
  useFormFeedbackMessages,
} from "@/components/uiCustom/FormFeedbackMessages";
import { PocketBase } from "@/config/pocketbaseConfig";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { requestPasswordReset } from "../_pokkit-auth/dbPokkitAuthUtils";

export const RequestPasswordResetForm = (p: { pb: PocketBase }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");

  const formFeedback = useFormFeedbackMessages();

  return (
    <div className="flex flex-col gap-4">
      {formFeedback.messages && formFeedback.status && (
        <FormFeedbackMessages messages={formFeedback.messages} status={formFeedback.status} />
      )}
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (isLoading) return;
          setIsLoading(true);

          const resp = await requestPasswordReset({ pb: p.pb, email });

          const successMessageFn = resp.success ? formFeedback.showSuccess : formFeedback.showError;
          successMessageFn(resp.messages);

          setIsLoading(false);
        }}
      >
        {formFeedback.status !== "success" && (
          <>
            <div>
              <Label htmlFor="signinWithOtp-email-input">Email</Label>
              <TextInput
                id="signinWithOtp-email-input"
                value={email}
                onInput={setEmail}
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Request Password Reset
            </Button>
          </>
        )}
        {formFeedback.status === "success" && (
          <>
            <div>
              You have successfully requested a password reset. Check your email for instructions.
            </div>
            <div>
              If you didn't receive an email, check your spam folder or{" "}
              <Link
                className="underline decoration-muted-foreground hover:decoration-primary hover:underline-offset-2"
                href="#"
                onClick={() => router.reload()}
              >
                refresh
              </Link>{" "}
              the page and try again.
            </div>
            <div>Also make sure to check that you entered the correct email address: {email}</div>
          </>
        )}
      </form>
    </div>
  );
};
