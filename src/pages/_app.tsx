import type { AppProps } from "next/app";
import { IconContext } from "react-icons";
import "@/styles/globals.scss";
import "@/styles/color.scss";
import "@/styles/utility.scss";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <IconContext.Provider value={{ size: "2rem" }}>
      <Component {...pageProps} />
    </IconContext.Provider>
  );
};

export default App;