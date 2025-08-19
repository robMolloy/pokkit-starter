import { PreserveScrollAbility } from "@/components/layout/LayoutTemplate";
import { LeftSidebarTemplate, SidebarButton } from "@/components/layout/LeftSidebarTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { logout } from "@/modules/auth/dbAuthUtils";
import { useUsersStore } from "@/modules/users/usersStore";
import { useCurrentUserStore } from "@/stores/authDataStore";
import { useRouter } from "next/router";
import { useState } from "react";

export function LeftSidebar() {
  const router = useRouter();
  const [scrollItemIndex, setScrollItemIndex] = useState(0);

  const currentUserStore = useCurrentUserStore();
  const usersStore = useUsersStore();
  const pendingUsersCount = usersStore.data.filter((user) => user.status === "pending").length;

  const isAdmin =
    currentUserStore.data.authStatus === "loggedIn" &&
    currentUserStore.data.user.status === "approved" &&
    currentUserStore.data.user.role === "admin";
  const isApproved =
    currentUserStore.data.authStatus === "loggedIn" &&
    currentUserStore.data.user.status === "approved";

  return (
    <PreserveScrollAbility className="w-64">
      <LeftSidebarTemplate
        top={
          isApproved && (
            <>
              <SidebarButton href="/" iconName="Home" isHighlighted={router.pathname === "/"}>
                Home
              </SidebarButton>
              <SidebarButton
                href="/scroll"
                iconName="Ban"
                isHighlighted={router.pathname === "/scroll"}
              >
                Scroll
              </SidebarButton>
            </>
          )
        }
        middle={[...Array(100)].map((_, j) => (
          <SidebarButton
            iconName="Ban"
            key={j}
            isHighlighted={j === scrollItemIndex}
            onClick={() => setScrollItemIndex(j)}
          >
            do summit {j} {j === scrollItemIndex && <>(selected)</>}
          </SidebarButton>
        ))}
        bottom={
          currentUserStore.data.authStatus === "loggedIn" && (
            <>
              {isAdmin && (
                <SidebarButton
                  href="/users"
                  iconName="Users"
                  isHighlighted={router.pathname === "/users"}
                  badgeCount={pendingUsersCount}
                >
                  Users
                </SidebarButton>
              )}
              <SidebarButton iconName="LogOut" isHighlighted={false} onClick={() => logout({ pb })}>
                Log Out
              </SidebarButton>
            </>
          )
        }
      />
    </PreserveScrollAbility>
  );
}
