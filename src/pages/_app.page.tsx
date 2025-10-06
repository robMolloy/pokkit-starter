import { LayoutTemplate } from "@/components/layout/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { useCurrentUserStore } from "@/modules/auth/currentUserStore/currentUserStore";
import { useCurrentUserStoreSync } from "@/modules/auth/currentUserStore/currentUserStoreSync";
import { Header } from "@/modules/Layout/Header";
import { LeftSidebar } from "@/modules/Layout/LeftSidebar";
import { useThemeStore } from "@/stores/themeStore";
import "@/styles/globals.css";
import "@/styles/markdown.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const themeStore = useThemeStore();
  const currentUserStore = useCurrentUserStore();

  themeStore.useThemeStoreSideEffect();

  useCurrentUserStoreSync({
    pb,
    onIsLoading: () => {},
    onIsLoggedOut: () => {},
    onIsLoggedIn: () => {},
  });

  return (
    <>
      <Head>
        <title>pokkit Starter</title>
      </Head>
      <LayoutTemplate Header={<Header />} LeftSidebar={!!currentUserStore.data && <LeftSidebar />}>
        <Component {...pageProps} />
      </LayoutTemplate>
    </>
  );
}
