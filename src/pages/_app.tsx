import type { AppProps } from "next/app";
import { IconContext } from "react-icons";
import "$/globals.scss";
import "$/color.scss";
import "$/utility.scss";
import { LayoutProvider, WindowSize } from "@/components/providers/layout";
import NavigationContainer from "@/components/elements/navigation-container";
import Menu from "@/components/elements/menu";
import { AiOutlineCodeSandbox } from "react-icons/ai";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { TbComponents } from "react-icons/tb";
import { LoadingBarProvider } from "@/components/elements/loading-bar";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <LayoutProvider initWindowSize={WindowSize.xl}>
      <IconContext.Provider value={{ className: "react-icon", size: "auto" }}>
        <LoadingBarProvider>
          <NavigationContainer
            className="w-100 h-100"
            // $navigationMode="manual"
            // $navigationMode="minimize"
            // $navigationMode="visible"
            // $navigationPosition="right"
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
                    key: "color",
                    icon: "C",
                    label: "Color",
                    pathname: "/sandbox/color",
                  }, {
                    key: "elements",
                    icon: <TbComponents />,
                    label: "Elements",
                    items: [{
                      key: "form",
                      label: "Form",
                      icon: "F",
                      items: [{
                        key: "form",
                        label: "Form",
                        icon: "F",
                        pathname: "/sandbox/elements/form",
                      }, {
                        key: "check-box",
                        label: "CheckBox",
                        icon: "C",
                        pathname: "/sandbox/elements/form-items/check-box",
                      }, {
                        key: "toggle-box",
                        label: "ToggleBox",
                        icon: "T",
                        pathname: "/sandbox/elements/form-items/toggle-box",
                      }, {
                        key: "text-box",
                        label: "TextBox",
                        icon: "T",
                        pathname: "/sandbox/elements/form-items/text-box",
                      }, {
                        key: "radio-buttons",
                        label: "RadioButtons",
                        icon: "R",
                        pathname: "/sandbox/elements/form-items/radio-buttons",
                      }, {
                        key: "text-area",
                        label: "TextArea",
                        icon: "T",
                        pathname: "/sandbox/elements/form-items/text-area",
                      }, {
                        key: "number-box",
                        label: "NumberBox",
                        icon: "N",
                        pathname: "/sandbox/elements/form-items/number-box",
                    }]
                    }, {
                      key: "button",
                      label: "Button",
                      icon: "B",
                      pathname: "/sandbox/elements/button",
                    }, {
                      key: "link",
                      label: "NextLink",
                      icon: "L",
                      pathname: "/sandbox/elements/link",
                    }, {
                      key: "loading-bar",
                      label: "LoadingBar",
                      icon: "L",
                      pathname: "/sandbox/elements/loading-bar",
                    }, {
                      key: "divider",
                      label: "Divider",
                      icon: "D",
                      pathname: "/sandbox/elements/divider"
                    }, {
                      key: "popup",
                      label: "Popup",
                      icon: "P",
                      pathname: "/sandbox/elements/popup",
                    }, {
                      key: "tooltip",
                      label: "Tooltip",
                      icon: "T",
                      pathname: "/sandbox/elements/tooltip",
                    }, {
                      key: "card",
                      label: "Card",
                      icon: "C",
                      pathname: "/sandbox/elements/card",
                    }, {
                      key: "menu",
                      label: "Menu",
                      icon: "M",
                      pathname: "/sandbox/elements/menu",
                    }],
                  }]
                }]}
              />
            </>
            <Component {...pageProps} />
            <div>foot</div>
          </NavigationContainer>
        </LoadingBarProvider>
      </IconContext.Provider>
    </LayoutProvider>
  );
};

export default App;