import { LayoutTemplate } from "@/components/layout/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { useCurrentUserStore } from "@/modules/auth/authDataStore";
import { useInitAuth } from "@/modules/auth/useInitAuth";
import { Header } from "@/modules/Layout/Header";
import { LeftSidebar } from "@/modules/Layout/LeftSidebar";
import { smartSubscribeToUsers } from "@/modules/users/dbUsersUtils";
import { useUsersStore } from "@/modules/users/usersStore";
import { useThemeStore } from "@/stores/themeStore";
import "@/styles/globals.css";
import "@/styles/markdown.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const themeStore = useThemeStore();
  const usersStore = useUsersStore();
  const currentUserStore = useCurrentUserStore();

  themeStore.useThemeStoreSideEffect();

  useInitAuth({
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
        <Component {...pageProps} />
      </LayoutTemplate>
    </>
  );
}
