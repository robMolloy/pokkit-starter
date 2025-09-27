import { pb } from "@/config/pocketbaseConfig";
import { confirmVerificationEmail } from "@/modules/auth/dbAuthUtils";
import { ErrorScreen } from "@/screens/ErrorScreen";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const token = router.query.token as string;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    (async () => {
      if (status !== "loading" || token === undefined) return;

      const resp = await confirmVerificationEmail({ pb: pb, token });
      setStatus(resp.success ? "success" : "error");
    })();
  }, [token]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "success") return <div>success</div>;
  return <ErrorScreen />;
}
