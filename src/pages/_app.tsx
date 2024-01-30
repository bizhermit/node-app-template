import LoadingProvider from "#/client/elements/loading/provider";
import LayoutProvider from "#/client/hooks/layout/provider";
import MessageProvider from "#/client/hooks/message/provider";
import WindowProvider from "#/client/hooks/window/provider";
import "#/client/styles/color.scss";
import "#/client/styles/global.scss";
import "#/client/styles/root.scss";
import type { AppProps } from "next/app";

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