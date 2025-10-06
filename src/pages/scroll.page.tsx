import { MainFixedLayout, Scroll } from "@/components/layout/LayoutTemplate";
import { H1 } from "@/components/ui/defaultComponents";
import { AuthenticatedOnlyRoute } from "@/modules/auth/routeProtectors/AuthenticatedOnlyRoute";

export default function Page() {
  return (
    <AuthenticatedOnlyRoute>
      <MainFixedLayout>
        <H1>Scrolling page with fixed header</H1>
        <Scroll>
          {[...Array(100)].map((_, j) => (
            <div key={j}>this is how we scroooooolll</div>
          ))}
        </Scroll>
        <H1>Scrolling page with fixed footer</H1>
      </MainFixedLayout>
    </AuthenticatedOnlyRoute>
  );
}
