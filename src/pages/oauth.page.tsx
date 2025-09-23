import { Button } from "@/components/ui/button";
import { pb } from "@/config/pocketbaseConfig";

export default function Page() {
  return (
    <div>
      <Button
        onClick={async () => {
          const resp = await pb
            .collection("users")
            .authWithOAuth2Code("google", "CODE", "VERIFIER", "REDIRECT_URL");
          console.log(resp);
        }}
      >
        Sign in with Google
      </Button>
    </div>
  );
}
