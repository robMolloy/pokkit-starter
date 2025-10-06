import { MainLayout } from "@/components/layout/LayoutTemplate";
import { H1 } from "@/components/ui/defaultComponents";
import { VerifiedUserOnlyRoute } from "@/modules/auth/routeProtectors/VerifiedUserOnlyRoute";

export default function Home() {
  return (
    <VerifiedUserOnlyRoute>
      <MainLayout>
        <H1>Welcome to pokkit Starter</H1>
        <br />
        <p className="text-muted-foreground">
          This is your dashboard. Start adding your content here.
        </p>
        {[...Array(100)].map((_, j) => (
          <div key={j}>this is how we scroooooolll</div>
        ))}
      </MainLayout>
    </VerifiedUserOnlyRoute>
  );
}
