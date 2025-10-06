import { PreserveScrollAbility } from "@/components/layout/LayoutTemplate";
import { LeftSidebarTemplate, SidebarButton } from "@/components/layout/LeftSidebarTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { useRouter } from "next/router";
import { useState } from "react";
import { logout } from "../auth/_pokkit-auth/dbPokkitAuthUtils";
import { useCurrentUserStore } from "../auth/currentUserStore/currentUserStore";

export function LeftSidebar() {
  const router = useRouter();
  const [scrollItemIndex, setScrollItemIndex] = useState(0);

  const currentUserStore = useCurrentUserStore();

  const isLoggedIn = !!currentUserStore.data;
  return (
    <PreserveScrollAbility className="w-64">
      <LeftSidebarTemplate
        top={
          isLoggedIn && (
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
          isLoggedIn && (
            <>
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
