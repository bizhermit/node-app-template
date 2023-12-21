import LoadingProvider from "#/client/elements/loading/provider";
import LayoutProvider from "#/client/providers/layout/provider";
import MessageProvider from "#/client/providers/message/provider";
import WindowProvider from "#/client/providers/window/provider";
import "#/client/styles/color.scss";
import "#/client/styles/global.scss";
import "#/client/styles/root.scss";
import type { AppProps } from "next/app";
import type { NextPageWithLayout } from "../types/next-component";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const pageLayout = Component.layout ?? ((page) => page);

  return (
    <WindowProvider>
      <LayoutProvider>
        <MessageProvider>
          <LoadingProvider>
            {pageLayout(<Component {...pageProps} />, pageProps)}
          </LoadingProvider>
        </MessageProvider>
      </LayoutProvider>
    </WindowProvider>
  );
};

export default App;