import { ConfirmVerificationScreen } from "@/screens/ConfirmVerificationScreen";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  const token = router.query.token as string;

  if (token === undefined) return <LoadingScreen />;
  return <ConfirmVerificationScreen token={token} />;
}
