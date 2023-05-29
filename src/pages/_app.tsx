import type { AppProps } from "next/app";
import "#/styles/globals.scss";
import "#/styles/color.scss";
import "#/styles/utility.scss";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { LayoutProvider } from "#/components/providers/layout";
import { MessageProvider } from "#/components/providers/message";
import LoadingProvider from "#/components/providers/loading";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const pageLayout = Component.getLayout ?? ((page) => page);

  return (
    <LayoutProvider>
      <MessageProvider>
        <LoadingProvider>
          {pageLayout(<Component {...pageProps} />)}
        </LoadingProvider>
      </MessageProvider>
    </LayoutProvider>
  );
};

export default App;