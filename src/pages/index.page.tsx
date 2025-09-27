import { MainLayout } from "@/components/layout/LayoutTemplate";
import { H1 } from "@/components/ui/defaultComponents";
import { ApprovedUserOnlyRoute } from "@/modules/auth/routeProtectors/ApprovedUserOnlyRoute";
import { VerifiedUserOnlyRoute } from "@/modules/auth/routeProtectors/VerifiedUserOnlyRoute";

export default function Home() {
  return (
    <VerifiedUserOnlyRoute>
      <ApprovedUserOnlyRoute>
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
      </ApprovedUserOnlyRoute>
    </VerifiedUserOnlyRoute>
  );
}
