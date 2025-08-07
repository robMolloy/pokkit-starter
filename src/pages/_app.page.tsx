import { Layout } from "@/components/layout/Layout";
import { pb } from "@/config/pocketbaseConfig";
import { AuthForm } from "@/modules/auth/AuthForm";
import { smartSubscribeToUsers, subscribeToUser } from "@/modules/users/dbUsersUtils";
import { useUsersStore } from "@/modules/users/usersStore";
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
      if (unverifiedIsLoggedInStore.data.status === "loggedOut")
        return currentUserStore.setData({ status: "loggedOut" });

      if (unverifiedIsLoggedInStore.data.status === "loading")
        return currentUserStore.setData({ status: "loading" });

      if (unverifiedIsLoggedInStore.data.status !== "loggedIn")
        return console.error("should never be hit");

      return subscribeToUser({
        pb,
        id: unverifiedIsLoggedInStore.data.auth.record.id,
        onChange: (user) => {
          if (user) currentUserStore.setData({ status: "loggedIn", user });
          else currentUserStore.setData({ status: "loggedOut" });
        },
      });
    })();
  }, [unverifiedIsLoggedInStore.data]);

  useEffect(() => {
    if (currentUserStore.data.status === "loading") return p.onIsLoading();
    if (currentUserStore.data.status === "loggedIn") return p.onIsLoggedIn();
    if (currentUserStore.data.status === "loggedOut") return p.onIsLoggedOut();

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
      <Layout
        showLeftSidebar={
          currentUserStore.data.status === "loggedIn" &&
          ["approved", "admin"].includes(currentUserStore.data.user.role)
        }
      >
        {(() => {
          if (currentUserStore.data.status === "loading") return <LoadingScreen />;

          if (currentUserStore.data.status === "loggedOut")
            return (
              <div className="mt-16 flex justify-center">
                <AuthForm />
              </div>
            );

          // should not be required
          if (currentUserStore.data.status !== "loggedIn") {
            console.error(`this line should never be hit`);
            return;
          }

          if (currentUserStore.data.user.role === "pending") return <div>awaiting approval</div>;

          if (currentUserStore.data.user.role === "denied") return <div>blocked</div>;

          return <Component {...pageProps} />;
        })()}
      </Layout>
    </>
  );
}
