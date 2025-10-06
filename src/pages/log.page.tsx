import { useCurrentUserStore } from "@/modules/auth/currentUserStore/currentUserStore";
import { useReactivePocketBaseAuthStore } from "@/modules/auth/reactivePocketBaseAuthStore/reactivePocketBaseAuthStore";
import { useUsersStore } from "@/modules/users/usersStore";

const LogPage = () => {
  const usersStore = useUsersStore();
  const currentUserStore = useCurrentUserStore();
  const reactivePocketBaseAuthStore = useReactivePocketBaseAuthStore();

  return (
    <div>
      <pre>
        {JSON.stringify(
          { usersStore, currentUserStore, reactivePocketBaseAuthStore },
          undefined,
          2,
        )}
      </pre>
    </div>
  );
};

export default LogPage;
