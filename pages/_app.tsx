import "@sera-assets/sera-override.css";
import "@sera-locale/i18n";
import "antd/dist/reset.css";

import Clarity from "@microsoft/clarity";
import ErrorBoundary from "@sera-components/error-boundary";
import { VisibilityProvider } from "@sera-components/layout/layout-context";
import LoadingPage from "@sera-components/loading/loading-page";
import PageTitle from "@sera-components/page-title";
import SharedLayout from "@sera-components/shared-layout";
import ThemeProvider from "@sera-components/theme-provider";
import NextAuthProvider, {
  NextAuthProviderUnprotected,
} from "@sera-libraries/contexts/next-auth-provider";
import IdleHandler from "@sera-libraries/idle-handler";
import RefreshTokenHandler from "@sera-libraries/refresh-token-handler";
import { decryptData } from "@sera-utils/encryptor";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { makeStore, wrapper } from "../redux";

const robotoSans = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto-sans",
});

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  const router = useRouter();
  const { pathname } = router;

  const [interval, setInterval] = useState(0);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [store, setStore] = useState<any>();

  useEffect(() => {
    setStore(makeStore([]));
    Clarity.init(decryptData(process.env.CLARITY_PROJECT_ID) || "");
  }, []);

  useEffect(() => {
    const handleStart = (url: string) => {
      setLoading(url !== router.pathname);
    };

    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
  }, [router.pathname]);

  if (!store) return null;
  if (pathname.includes("auth")) {
    return (
      <SessionProvider session={pageProps.session}>
        <ThemeProvider>
          <PageTitle />
          <NextAuthProviderUnprotected>
            {loading ? (
              <LoadingPage />
            ) : (
              <ErrorBoundary>
                <Component {...pageProps} />
              </ErrorBoundary>
            )}
          </NextAuthProviderUnprotected>
        </ThemeProvider>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider
      session={pageProps.session}
      refetchInterval={interval}
      refetchOnWindowFocus
    >
      <ThemeProvider>
        <VisibilityProvider>
          <PageTitle />
          <NextAuthProvider>
            <IdleHandler>
              <SharedLayout /* showNotificationHandler={showNotificationHandler} */
              >
                {loading ? (
                  <LoadingPage height="40vh" />
                ) : (
                  <ErrorBoundary>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                )}
                {/* <MwMappingUnsubscriber /> */}
                <RefreshTokenHandler setInterval={setInterval} />
                {/* <NotificationBar onClose={hideNotificationDrawerHandler} open={openNotificationDrawer} /> */}
              </SharedLayout>
            </IdleHandler>
          </NextAuthProvider>
        </VisibilityProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default function App(props: AppProps) {
  const { store, props: wrappedProps } = wrapper.useWrappedStore(props);

  return (
    <main className={`${robotoSans.variable}`}>
      <Provider store={store}>
        <MyApp {...wrappedProps} />
      </Provider>
    </main>
  );
}
