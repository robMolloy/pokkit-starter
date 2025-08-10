import { Layout } from "@/components/layout/Layout";
import { pb } from "@/config/pocketbaseConfig";
import { AuthForm } from "@/modules/auth/AuthForm";
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
import React, { useEffect } from "react";

const PreserveScroll = (p: {
  children: React.ReactNode;
  className?: HTMLDivElement["className"];
}) => <div className={`flex h-full flex-col ${p.className ?? ""}`}>{p.children}</div>;

const CustomLeftSidebar = (p: {
  top: React.ReactNode;
  middle: React.ReactNode;
  bottom: React.ReactNode;
}) => {
  return (
    <PreserveScroll className="border-r">
      <div className="border-b p-4">{p.top}</div>
      <div className="flex-1 overflow-y-auto p-4">{p.middle}</div>
      <div className="border-t p-4">{p.bottom}</div>
    </PreserveScroll>
  );
};

const CustomLayout = () => {
  return (
    <div className="flex h-screen max-h-screen flex-col">
      <header className="h-16 bg-blue-600 p-4 text-white">
        <h1 className="text-2xl font-bold">Header Title</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <PreserveScroll>
          <CustomLeftSidebar
            top={<h2 className="text-lg font-semibold">Fixed Title</h2>}
            middle={[...Array(100)].map((_, j) => (
              <div key={j}>{j}</div>
            ))}
            bottom={<h2 className="text-lg font-semibold">Fixed Bottom</h2>}
          />
        </PreserveScroll>

        <div className="flex-1 overflow-y-auto">
          {[...Array(100)].map((_, j) => (
            <div key={j}>{j}</div>
          ))}
        </div>
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

  return <CustomLayout />;

  return (
    <>
      <Head>
        <title>pokkit Starter</title>
      </Head>
      <Layout
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
      </Layout>
    </>
  );
}
