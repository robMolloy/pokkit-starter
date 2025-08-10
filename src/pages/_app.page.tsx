import { CustomIcon } from "@/components/CustomIcon";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { pb } from "@/config/pocketbaseConfig";
import { AuthForm } from "@/modules/auth/AuthForm";
import { logout } from "@/modules/auth/dbAuthUtils";
import { smartSubscribeToUsers, subscribeToUser } from "@/modules/users/dbUsersUtils";
import { useUsersStore } from "@/modules/users/usersStore";
import { AwaitingApprovalScreen } from "@/screens/AwaitingApprovalScreen";
import { BlockedScreen } from "@/screens/BlockedScreen";
import { LoadingScreen } from "@/screens/LoadingScreen";
import {
  useCurrentUserStore,
  useUnverifiedIsLoggedInStore,
  useUnverifiedIsLoggedInSync,
} from "@/stores/authDataStore";
import { useThemeStore } from "@/stores/themeStore";
import "@/styles/globals.css";
import "@/styles/markdown.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const SidebarButtonWrapper = (p: {
  children: React.ReactNode;
  href?: string;
  disabled?: boolean;
}) => {
  return p.href ? (
    <Link href={p.disabled ? "#" : p.href} className={p.disabled ? "pointer-events-none" : ""}>
      {p.children}
    </Link>
  ) : (
    p.children
  );
};

const PossibleTooltipWrapper = (p: {
  children: React.ReactNode;
  tooltipContent?: React.ReactNode;
}) => {
  return p.tooltipContent ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{p.children}</TooltipTrigger>
        <TooltipContent>{p.tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <>{p.children}</>
  );
};

const SidebarButton = (p: {
  href?: string;
  iconName?: React.ComponentProps<typeof CustomIcon>["iconName"];
  children: React.ReactNode;
  isHighlighted: boolean;
  onClick?: () => void;
  badgeCount?: number;
  disabled?: boolean;
  tooltipContent?: React.ReactNode;
}) => {
  return (
    <SidebarButtonWrapper href={p.href} disabled={p.disabled}>
      <PossibleTooltipWrapper tooltipContent={p.tooltipContent}>
        <Button
          variant={p.isHighlighted ? "secondary" : "ghost"}
          className={`w-full ${p.disabled ? "pointer-events-none" : ""}`}
          onClick={p.onClick}
          disabled={p.disabled}
        >
          <span className="flex w-full items-center gap-2 text-left">
            {p.iconName && (
              <CustomIcon
                iconName={p.iconName}
                size="sm"
                className={p.disabled ? "text-muted-foreground" : ""}
              />
            )}

            {p.children}

            {p.badgeCount !== undefined && p.badgeCount > 0 && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
                {p.badgeCount}
              </span>
            )}
          </span>
        </Button>
      </PossibleTooltipWrapper>
    </SidebarButtonWrapper>
  );
};

const PreserveScroll = (p: {
  children: React.ReactNode;
  className?: HTMLDivElement["className"];
}) => <div className={`flex h-full flex-col ${p.className ?? ""}`}>{p.children}</div>;

const CustomLeftSidebarTemplate = (p: {
  top: React.ReactNode;
  middle: React.ReactNode;
  bottom: React.ReactNode;
}) => {
  return (
    <PreserveScroll className="border-r">
      <div className="flex flex-col gap-1 border-b p-2">{p.top}</div>
      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">{p.middle}</div>
      <div className="flex flex-col gap-1 border-t p-2">{p.bottom}</div>
    </PreserveScroll>
  );
};
const CustomLeftSidebar = () => {
  const router = useRouter();

  const currentUserStore = useCurrentUserStore();
  const usersStore = useUsersStore();
  const pendingUsersCount = usersStore.data.filter((user) => user.status === "pending").length;

  const isAdmin =
    currentUserStore.data.authStatus === "loggedIn" &&
    currentUserStore.data.user.status === "approved" &&
    currentUserStore.data.user.role === "admin";
  return (
    <CustomLeftSidebarTemplate
      top={
        <SidebarButton href="/" iconName={"Home"} isHighlighted={router.pathname === "/"}>
          Home
        </SidebarButton>
      }
      middle={
        <>
          {[...Array(100)].map((_, j) => (
            <SidebarButton iconName="Ban" key={j} isHighlighted={j === 2}>
              do summit {j}
            </SidebarButton>
          ))}
        </>
      }
      bottom={
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
      }
    />
  );
};

const CustomLayout = (p: { children: React.ReactNode; showLeftSidebar: boolean }) => {
  return (
    <div className="flex h-screen max-h-screen flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {p.showLeftSidebar && (
          <PreserveScroll className="w-64">
            <CustomLeftSidebar />
          </PreserveScroll>
        )}

        <div className="flex-1 overflow-y-auto">{p.children}</div>
      </div>
    </div>
  );
};

const useAuth = (p: {
  onIsLoading: () => void;
  onIsLoggedIn: () => void;
  onIsLoggedOut: () => void;
}) => {
  const unverifiedIsLoggedInStore = useUnverifiedIsLoggedInStore();

  const currentUserStore = useCurrentUserStore();

  useUnverifiedIsLoggedInSync({ pb });

  useEffect(() => {
    // use anfn as return value is not cleanup
    (() => {
      if (unverifiedIsLoggedInStore.data.authStatus === "loggedOut")
        return currentUserStore.setData({ authStatus: "loggedOut" });

      if (unverifiedIsLoggedInStore.data.authStatus === "loading")
        return currentUserStore.setData({ authStatus: "loading" });

      if (unverifiedIsLoggedInStore.data.authStatus !== "loggedIn")
        return console.error("should never be hit");

      return subscribeToUser({
        pb,
        id: unverifiedIsLoggedInStore.data.user.record.id,
        onChange: (user) => {
          if (user) currentUserStore.setData({ authStatus: "loggedIn", user });
          else currentUserStore.setData({ authStatus: "loggedOut" });
        },
      });
    })();
  }, [unverifiedIsLoggedInStore.data]);

  useEffect(() => {
    if (currentUserStore.data.authStatus === "loading") return p.onIsLoading();
    if (currentUserStore.data.authStatus === "loggedIn") return p.onIsLoggedIn();
    if (currentUserStore.data.authStatus === "loggedOut") return p.onIsLoggedOut();

    console.error("should never be hit");
  }, [currentUserStore.data]);

  return currentUserStore.data;
};

export default function App({ Component, pageProps }: AppProps) {
  const themeStore = useThemeStore();
  const usersStore = useUsersStore();
  const currentUserStore = useCurrentUserStore();

  themeStore.useThemeStoreSideEffect();

  useAuth({
    onIsLoading: () => {},
    onIsLoggedIn: () => {
      smartSubscribeToUsers({ pb, onChange: (x) => usersStore.setData(x) });
    },
    onIsLoggedOut: () => {},
  });

  return (
    <>
      <Head>
        <title>pokkit Starter</title>
      </Head>
      <CustomLayout
        showLeftSidebar={
          currentUserStore.data.authStatus === "loggedIn" &&
          ["approved", "admin"].includes(currentUserStore.data.user.status)
        }
      >
        {(() => {
          if (currentUserStore.data.authStatus === "loading") return <LoadingScreen />;

          if (currentUserStore.data.authStatus === "loggedOut")
            return (
              <div className="mt-16 flex justify-center">
                <AuthForm />
              </div>
            );

          // should not be required
          if (currentUserStore.data.authStatus !== "loggedIn") {
            console.error(`this line should never be hit`);
            return;
          }

          if (currentUserStore.data.user.status === "pending") return <AwaitingApprovalScreen />;

          if (currentUserStore.data.user.status === "blocked") return <BlockedScreen />;

          return <Component {...pageProps} />;
        })()}
      </CustomLayout>
    </>
  );

  // return (
  //   <>
  //     <Head>
  //       <title>pokkit Starter</title>
  //     </Head>
  //     <Layout
  //       showLeftSidebar={
  //         currentUserStore.data.authStatus === "loggedIn" &&
  //         ["approved", "admin"].includes(currentUserStore.data.user.status)
  //       }
  //     >
  //       {(() => {
  //         if (currentUserStore.data.authStatus === "loading") return <LoadingScreen />;

  //         if (currentUserStore.data.authStatus === "loggedOut")
  //           return (
  //             <div className="mt-16 flex justify-center">
  //               <AuthForm />
  //             </div>
  //           );

  //         // should not be required
  //         if (currentUserStore.data.authStatus !== "loggedIn") {
  //           console.error(`this line should never be hit`);
  //           return;
  //         }

  //         if (currentUserStore.data.user.status === "pending") return <AwaitingApprovalScreen />;

  //         if (currentUserStore.data.user.status === "blocked") return <BlockedScreen />;

  //         return <Component {...pageProps} />;
  //       })()}
  //     </Layout>
  //   </>
  // );
}
