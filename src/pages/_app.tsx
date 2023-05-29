import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import "#/styles/globals.scss";
import "#/styles/color.scss";
import "#/styles/utility.scss";
import { LayoutProvider } from "#/components/providers/layout";
import { MessageProvider } from "#/components/providers/message";
import LoadingProvider from "#/components/providers/loading";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  layout?: (page: ReactElement, props: P) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const pageLayout = Component.layout ?? ((page) => page);

  return (
    <LayoutProvider>
      <MessageProvider>
        <LoadingProvider>
          {pageLayout(<Component {...pageProps} />, pageProps)}
        </LoadingProvider>
      </MessageProvider>
    </LayoutProvider>
  );
};

export default App;