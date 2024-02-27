import LoadingProvider from "#/client/elements/loading/provider";
import FetchApiProvider from "#/client/hooks/fetch-api/provider";
import LayoutProvider from "#/client/hooks/layout/provider";
import MessageProvider from "#/client/hooks/message/provider";
import WindowProvider from "#/client/hooks/window/provider";
import "#/client/styles/color.scss";
import "#/client/styles/root.scss";
import "$/client/styles/global.scss";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const pageLayout = Component.layout ?? ((page) => page);

  return (
    <SessionProvider>
      <WindowProvider>
        <LayoutProvider>
          <LoadingProvider>
            <MessageProvider>
              <FetchApiProvider>
                {pageLayout(<Component {...pageProps} />, pageProps)}
              </FetchApiProvider>
            </MessageProvider>
          </LoadingProvider>
        </LayoutProvider>
      </WindowProvider>
    </SessionProvider>
  );
};

export default App;
