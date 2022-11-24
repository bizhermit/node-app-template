import type { AppProps } from "next/app";
import { IconContext } from "react-icons";
import "@/styles/globals.scss";
import "@/styles/color.scss";
import "@/styles/utility.scss";
import { LayoutProvider } from "@/components/providers/layout";
import NavigationContainer from "@/components/elements/navigation-container";
import Menu from "@/components/elements/menu";
import { AiOutlineCodeSandbox } from "react-icons/ai";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <LayoutProvider>
      <IconContext.Provider value={{ size: "2rem" }}>
        <NavigationContainer
          className="w-100 h-100"
          $navigationMode="manual"
          $navigationPosition="top"
          $footerVisible="always"
        >
          <div>Header</div>
          {/* <div className="flex-box h-100" style={{ width: 200 }}> */}
          <>
            <span className="pt-t">Navigation</span>
            <Menu
              className="flex-1"
              $direction="horizontal"
              style={{ width: 200 }}
              $items={[{
                key: "sandbox",
                label: "SandBox",
                icon: <AiOutlineCodeSandbox />,
                pathname: "/sandbox",
              },
              ...ArrayUtils.generateArray(10, idx => {
                return {
                  key: `item-${idx}`,
                  label: `Item-${idx}`,
                  items: ArrayUtils.generateArray(10, cidx => {
                    return {
                      key: `item-${idx}-${cidx}`,
                      label: `Item-${idx}-${cidx}`,
                    };
                  }),
                };
              })
              ]}
            />
          {/* </div> */}
          </>
          <Component {...pageProps} />
          <div>foot</div>
        </NavigationContainer>
      </IconContext.Provider>
    </LayoutProvider>
  );
};

export default App;