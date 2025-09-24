import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useState } from "react";
import { requestSigninWithOtp, signinWithOtp } from "../dbAuthUtils";
import {
  FormFeedbackMessages,
  useFormFeedbackMessages,
} from "@/components/uiCustom/FormFeedbackMessages";

export const SignInWithOtpForm = (p: { pb: PocketBase }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState("");

  const formFeedback = useFormFeedbackMessages();

  return (
    <div className="flex flex-col gap-4">
      {formFeedback.messages && formFeedback.status && (
        <FormFeedbackMessages messages={formFeedback.messages} status={formFeedback.status} />
      )}
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
      <Button
        type="button"
        className="w-full"
        disabled={isLoading}
        onClick={async () => {
          if (isLoading) return;
          setIsLoading(true);

          const resp = await requestSigninWithOtp({ pb: p.pb, email });

          setOtpId(resp.success ? resp.data.otpId : "");
          if (resp.success) formFeedback.clear();
          if (!resp.success) formFeedback.showError(resp.messages);

          setIsLoading(false);
        }}
      >
        Request {otpId && "new"} OTP
      </Button>
      <div>
        <Label htmlFor="signinWithOtp-otp-input">OTP</Label>
        <TextInput
          id="signinWithOtp-otp-input"
          value={otp}
          onInput={setOtp}
          name="otp"
          placeholder="Enter your OTP"
          required
        />
      </div>
      <Button
        type="button"
        className="w-full"
        disabled={isLoading || !otpId}
        onClick={async () => {
          if (isLoading) return;
          setIsLoading(true);

          const resp = await signinWithOtp({ pb, data: { otpId, otp } });

          const fn = resp.success ? formFeedback.showSuccess : formFeedback.showError;
          fn(resp.messages);

          setIsLoading(false);
        }}
      >
        Submit OTP
      </Button>
    </div>
  );
};
