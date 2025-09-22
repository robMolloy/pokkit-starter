import { pb } from "@/config/pocketbaseConfig";
import { AuthForm } from "@/modules/auth/AuthForm";
import { UnauthenticatedOnlyRoute } from "@/modules/auth/routeProtectors/UnauthenticatedOnlyRoute";

export default function Page() {
  return (
    <UnauthenticatedOnlyRoute>
      <div className="mt-16 flex justify-center">
        <div className="w-[400px]">
          <AuthForm pb={pb} />
        </div>
      </div>
    </UnauthenticatedOnlyRoute>
  );
}
