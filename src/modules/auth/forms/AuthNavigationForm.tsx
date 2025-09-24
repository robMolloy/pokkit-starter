import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleCard } from "@/components/uiCustom/SimpleCard";
import { useRouter } from "next/router";

export const AuthNavigationForm = () => {
  const router = useRouter();

  return (
    <SimpleCard
      title="Welcome"
      description="Sign in to your account or create a new one"
      footerChildren={
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      }
    >
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin" className="pt-2">
          <div className="flex flex-col gap-4">
            <Button className="w-full" onClick={() => router.push("/auth/signin-with-otp")}>
              Sign in with OTP
            </Button>
            <Button
              className="w-full"
              onClick={async () => router.push("/auth/signin-with-oauth2")}
            >
              Sign in with Google
            </Button>
            <Button
              className="w-full"
              onClick={() => router.push("/auth/signin-with-email-and-password")}
            >
              Sign in with email and password
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="signup" className="pt-2">
          <div className="flex flex-col gap-4">
            <Button
              className="w-full"
              onClick={async () => router.push("/auth/signup-with-oauth2")}
            >
              Sign up with oAuth2
            </Button>
            <Button
              className="w-full"
              onClick={() => router.push("/auth/signup-with-email-and-password")}
            >
              Sign up with email and password
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </SimpleCard>
  );

  // return (
  //   <Card>
  //     <CardHeader>
  //       {scenario !== "init" && (
  //         <Link
  //           href="#"
  //           className="text-muted-foreground hover:underline"
  //           onClick={() => setScenario("init")}
  //         >
  //           &lt; Back
  //         </Link>
  //       )}
  //       {scenario === "init" && (
  //         <>
  //           <CardTitle>Welcome</CardTitle>
  //           <CardDescription>Sign in to your account or create a new one</CardDescription>
  //         </>
  //       )}
  //     </CardHeader>
  //     <CardContent>
  //       {messages && status && <FormFeedbackMessages messages={messages} status={status} />}
  //       {scenario === "init" && (
  //         <Tabs defaultValue="signin" className="w-full">
  //           <TabsList className="grid w-full grid-cols-2">
  //             <TabsTrigger value="signin">Sign In</TabsTrigger>
  //             <TabsTrigger value="signup">Sign Up</TabsTrigger>
  //           </TabsList>
  //           <TabsContent value="signin" className="pt-2">
  //             <div className="flex flex-col gap-4">
  //               <Button className="w-full" onClick={() => setScenario("signinWithOtp")}>
  //                 Sign in with OTP
  //               </Button>
  //               <Button
  //                 className="w-full"
  //                 onClick={async () => {
  //                   const resp = await signinWithOAuth2Google({ pb: p.pb });

  //                   setStatus(resp.success ? "success" : "error");
  //                   setMessages(resp.messages);
  //                 }}
  //               >
  //                 Sign in with Google
  //               </Button>
  //               <Button
  //                 className="w-full"
  //                 onClick={() => setScenario("signinWithEmailAndPassword")}
  //               >
  //                 Sign in with email and password
  //               </Button>
  //             </div>
  //           </TabsContent>
  //           <TabsContent value="signup" className="pt-2">
  //             <div className="flex flex-col gap-4">
  //               <Button
  //                 className="w-full"
  //                 onClick={async () => {
  //                   const resp = await signupWithOAuth2Google({ pb: p.pb });
  //                   const fn = resp.success ? handleSuccessMessages : handleErrorMessages;
  //                   fn(resp.messages);
  //                 }}
  //               >
  //                 Sign up with Google
  //               </Button>
  //               <Button
  //                 className="w-full"
  //                 onClick={() => setScenario("signupWithEmailAndPassword")}
  //               >
  //                 Sign up with email and password
  //               </Button>
  //             </div>
  //           </TabsContent>
  //         </Tabs>
  //       )}
  //       {scenario === "signinWithOtp" && (
  //         <OtpAuthForm
  //           pb={p.pb}
  //           onSignInError={(messages) => handleErrorMessages(messages)}
  //           onSignInSuccess={(messages) => handleSuccessMessages(messages)}
  //         />
  //       )}
  //       {scenario === "signinWithEmailAndPassword" && (
  //         <SigninWithEmailAndPasswordForm
  //           pb={p.pb}
  //           onSignInError={(messages) => handleErrorMessages(messages)}
  //           onSignInSuccess={(messages) => handleSuccessMessages(messages)}
  //         />
  //       )}
  //       {scenario === "signupWithEmailAndPassword" && (
  //         <SignupWithEmailAndPasswordForm
  //           pb={p.pb}
  //           onSignUpError={(messages) => handleErrorMessages(messages)}
  //           onSignUpSuccess={(messages) => handleSuccessMessages(messages)}
  //         />
  //       )}
  //     </CardContent>
  //     <CardFooter className="flex justify-center">
  //       <p className="text-sm text-muted-foreground">
  //         By continuing, you agree to our Terms of Service and Privacy Policy
  //       </p>
  //     </CardFooter>
  //   </Card>
  // );
};
