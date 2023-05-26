import type { AppProps } from "next/app";
import "#/styles/globals.scss";
import "#/styles/color.scss";
import "#/styles/utility.scss";
import RootProvider from "@/provider";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <RootProvider>
      <Component {...pageProps} />
    </RootProvider>
  );
};

export default App;