import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import "#/client/styles/root.scss";
import "#/client/styles/global.scss";
import "#/client/styles/color.scss";
import LoadingProvider from "#/client/elements/loading/provider";
import LayoutProvider from "#/client/providers/layout/provider";
import MessageProvider from "#/client/providers/message/provider";

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