import type { AppProps } from "next/app";
import "@/styles/globals.scss";
import "@/styles/color.scss";
import "@/styles/utility.scss";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Component {...pageProps} />
  );
};

export default App;