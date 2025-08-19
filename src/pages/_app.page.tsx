import { LayoutTemplate } from "@/components/layout/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { AuthForm } from "@/modules/auth/AuthForm";
import { Header } from "@/modules/Layout/Header";
import { LeftSidebar } from "@/modules/Layout/LeftSidebar";
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
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

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
      <LayoutTemplate
        Header={<Header />}
        LeftSidebar={currentUserStore.data.authStatus === "loggedIn" && <LeftSidebar />}
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
      </LayoutTemplate>
    </>
  );
}
