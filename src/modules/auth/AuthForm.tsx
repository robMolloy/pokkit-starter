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
import { useState } from "react";
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

const classMap: Record<string, string> = {
  error: "bg-destructive/75",
  success: "bg-green-500/50",
};

export const AuthForm = (p: { pb: PocketBase }) => {
  const router = useRouter();
  const [messages, setMessages] = useState<string[] | null>(null);
  const [status, setStatus] = useState<"error" | "success" | "init">("init");

  const [scenario, setScenario] = useState<"init" | "signinWithOtp" | "signinWithEmailAndPassword">(
    "init",
  );

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
        {messages &&
          (() => {
            const [title, ...otherMessages] = messages;

            return (
              <div
                className={`mb-4 rounded-md p-3 text-center text-sm text-white ${classMap[status] ?? ""}`}
              >
                <div className="text-lg font-bold">{title}</div>
                {otherMessages && otherMessages.map((message, i) => <div key={i}>{message}</div>)}
              </div>
            );
          })()}
        {scenario === "init" && (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="flex flex-col gap-4 pt-2">
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

              <Button className="w-full" onClick={() => setScenario("signinWithEmailAndPassword")}>
                Sign in with email and password
              </Button>
            </TabsContent>
            <TabsContent value="signup">
              <br />
              <Button
                className="w-full"
                onClick={async () => {
                  const resp = await signupWithOAuth2Google({ pb: p.pb });

                  setStatus(resp.success ? "success" : "error");
                  setMessages(resp.messages);
                }}
              >
                Sign up with Google
              </Button>
              <br />
              <br />

              <SignupWithEmailAndPasswordForm
                pb={p.pb}
                onSignUpError={(messages) => {
                  setMessages(messages);
                  setStatus("error");
                }}
                onSignUpSuccess={(messages) => {
                  setMessages(messages);
                  setStatus("success");
                  router.push("/");
                }}
              />
            </TabsContent>
          </Tabs>
        )}
        {scenario === "signinWithOtp" && (
          <OtpAuthForm
            pb={p.pb}
            onSignInError={(messages) => {
              setMessages(messages);
              setStatus("error");
            }}
            onSignInSuccess={(messages) => {
              setMessages(messages);
              setStatus("success");
            }}
          />
        )}

        {scenario === "signinWithEmailAndPassword" && (
          <SigninWithEmailAndPasswordForm
            pb={p.pb}
            onSignInError={(messages) => {
              setMessages(messages);
              setStatus("error");
            }}
            onSignInSuccess={(messages) => {
              setMessages(messages);
              setStatus("success");
            }}
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
