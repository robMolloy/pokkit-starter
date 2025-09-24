import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TextInput } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SigninWithEmailAndPasswordForm } from "./forms/SigninWithEmailAndPasswordForm";
import { SignupWithEmailAndPasswordForm } from "./forms/SignupWithEmailAndPasswordForm";
import {
  requestSigninWithOtp,
  signinWithOAuth2Google,
  signinWithOtp,
  signupWithOAuth2Google,
} from "./dbAuthUtils";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FormFeedbackMessages } from "@/components/uiCustom/FormFeedbackMessages";

const OtpAuthForm = (p: {
  pb: PocketBase;
  onSignInSuccess: (messages: string[]) => void;
  onSignInError: (messages: string[]) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState("");

  return (
    <div className="flex flex-col gap-4">
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

          const resp = await requestSigninWithOtp({ pb, email });
          console.log(`AuthForm.tsx:${/*LL*/ 55}`, { resp });

          setOtpId(resp.success ? resp.data.otpId : "");
          if (!resp.success) p.onSignInError(resp.messages);

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

          const fn = resp.success ? p.onSignInSuccess : p.onSignInError;
          fn(resp.messages);

          setIsLoading(false);
        }}
      >
        Submit OTP
      </Button>
    </div>
  );
};

export const AuthForm = (p: { pb: PocketBase }) => {
  const router = useRouter();
  const [messages, setMessages] = useState<string[] | null>(null);
  const [status, setStatus] = useState<"error" | "success">();

  const [scenario, setScenario] = useState<
    "init" | "signinWithOtp" | "signinWithEmailAndPassword" | "signupWithEmailAndPassword"
  >("init");

  useEffect(() => {
    setMessages(null);
    setStatus(undefined);
  }, [scenario]);

  const handleErrorMessages = (messages: string[]) => {
    setMessages(messages);
    setStatus("error");
  };
  const handleSuccessMessages = (messages: string[]) => {
    setMessages(messages);
    setStatus("success");
    router.push("/");
  };

  return (
    <Card>
      <CardHeader>
        {scenario !== "init" && (
          <Link
            href="#"
            className="text-muted-foreground hover:underline"
            onClick={() => setScenario("init")}
          >
            &lt; Back
          </Link>
        )}
        {scenario === "init" && (
          <>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        {messages && status && <FormFeedbackMessages messages={messages} status={status} />}
        {scenario === "init" && (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="pt-2">
              <div className="flex flex-col gap-4">
                <Button className="w-full" onClick={() => setScenario("signinWithOtp")}>
                  Sign in with OTP
                </Button>
                <Button
                  className="w-full"
                  onClick={async () => {
                    const resp = await signinWithOAuth2Google({ pb: p.pb });

                    setStatus(resp.success ? "success" : "error");
                    setMessages(resp.messages);
                  }}
                >
                  Sign in with Google
                </Button>
                <Button
                  className="w-full"
                  onClick={() => setScenario("signinWithEmailAndPassword")}
                >
                  Sign in with email and password
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="signup" className="pt-2">
              <div className="flex flex-col gap-4">
                <Button
                  className="w-full"
                  onClick={async () => {
                    const resp = await signupWithOAuth2Google({ pb: p.pb });
                    const fn = resp.success ? handleSuccessMessages : handleErrorMessages;
                    fn(resp.messages);
                  }}
                >
                  Sign up with Google
                </Button>
                <Button
                  className="w-full"
                  onClick={() => setScenario("signupWithEmailAndPassword")}
                >
                  Sign up with email and password
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
        {scenario === "signinWithOtp" && (
          <OtpAuthForm
            pb={p.pb}
            onSignInError={(messages) => handleErrorMessages(messages)}
            onSignInSuccess={(messages) => handleSuccessMessages(messages)}
          />
        )}
        {scenario === "signinWithEmailAndPassword" && (
          <SigninWithEmailAndPasswordForm
            pb={p.pb}
            onSignInError={(messages) => handleErrorMessages(messages)}
            onSignInSuccess={(messages) => handleSuccessMessages(messages)}
          />
        )}
        {scenario === "signupWithEmailAndPassword" && (
          <SignupWithEmailAndPasswordForm
            pb={p.pb}
            onSignUpError={(messages) => handleErrorMessages(messages)}
            onSignUpSuccess={(messages) => handleSuccessMessages(messages)}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardFooter>
    </Card>
  );
};
