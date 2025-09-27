import { CustomIcon } from "@/components/CustomIcon";
import { Button } from "@/components/ui/button";
import { pb } from "@/config/pocketbaseConfig";
import { confirmVerificationEmail } from "@/modules/auth/dbAuthUtils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorScreen } from "./ErrorScreen";
import { LoadingScreen } from "./LoadingScreen";

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

export const ConfirmVerificationScreen = (p: { token: string }) => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    (async () => {
      const resp = await confirmVerificationEmail({ pb: pb, token: p.token });
      setStatus(resp.success ? "success" : "error");
    })();
  }, []);

  if (status === "loading") return <LoadingScreen />;
  if (status === "error") return <ErrorScreen />;
  return <ConfirmVerificationSuccessScreen />;
};
