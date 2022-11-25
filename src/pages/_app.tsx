import type { AppProps } from "next/app";
import { IconContext } from "react-icons";
import "@/styles/globals.scss";
import "@/styles/color.scss";
import "@/styles/utility.scss";
import { LayoutProvider } from "@/components/providers/layout";
import NavigationContainer from "@/components/elements/navigation-container";
import Menu from "@/components/elements/menu";
import { AiOutlineCodeSandbox } from "react-icons/ai";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { TbComponents } from "react-icons/tb";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <LayoutProvider>
      <IconContext.Provider value={{ size: "2rem" }}>
        <NavigationContainer
          className="w-100 h-100"
        // $navigationMode="manual"
        // $navigationPosition="top"
        // $footerVisible="always"
        >
          <div>Header</div>
          {/* <div className="flex-box h-100" style={{ width: 200 }}> */}
          <>
            <Menu
              className="flex-1"
              // $direction="horizontal"
              style={{ width: 200 }}
              $items={[{
                key: "index",
                icon: <MdOutlinePowerSettingsNew />,
                label: "Index",
                pathname: "/",
              }, {
                key: "sandbox",
                icon: <AiOutlineCodeSandbox />,
                label: "SandBox",
                items: [{
                  key: "elements",
                  icon: <TbComponents />,
                  label: "Elements",
                  items: [{
                    key: "button",
                    label: "Button",
                    icon: "B",
                    pathname: "/sandbox/elements/button"
                  }]
                }]
              }]}
            />
          </>
          <Component {...pageProps} />
          <div>foot</div>
        </NavigationContainer>
      </IconContext.Provider>
    </LayoutProvider>
  );
};

export default App;