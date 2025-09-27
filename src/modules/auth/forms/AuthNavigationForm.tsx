import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/components/uiCustom/Link";
import { SimpleCard } from "@/components/uiCustom/SimpleCard";
import { useRouter } from "next/router";
import { AuthMethodsList } from "pocketbase";

export const AuthNavigationForm = (p: { authMethodsList: AuthMethodsList }) => {
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
            {p.authMethodsList.otp.enabled && (
              <Button className="w-full" onClick={() => router.push("/auth/signin-with-otp")}>
                Sign in with OTP
              </Button>
            )}
            {p.authMethodsList.oauth2.enabled && (
              <Button
                className="w-full"
                onClick={async () => router.push("/auth/signin-with-oauth2")}
              >
                Sign in with oAuth2
              </Button>
            )}
            {p.authMethodsList.password.enabled && (
              <Button
                className="w-full"
                onClick={() => router.push("/auth/signin-with-email-and-password")}
              >
                Sign in with email and password
              </Button>
            )}
            <Link className="text-sm text-muted-foreground" href="/auth/request-password-reset">
              Forgot your password?
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="signup" className="pt-2">
          <div className="flex flex-col gap-4">
            {p.authMethodsList.oauth2.enabled && (
              <Button
                className="w-full"
                onClick={async () => router.push("/auth/signup-with-oauth2")}
              >
                Sign up with oAuth2
              </Button>
            )}
            {p.authMethodsList.password.enabled && (
              <Button
                className="w-full"
                onClick={() => router.push("/auth/signup-with-email-and-password")}
              >
                Sign up with email and password
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </SimpleCard>
  );
};
