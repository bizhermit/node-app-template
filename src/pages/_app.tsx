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
import { LoadingProvider } from "@/components/elements/loading";
import { convertSizeNumToStr } from "@/components/utilities/attributes";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <LayoutProvider initWindowSize={WindowSize.xl}>
      <IconContext.Provider value={{ className: "icon", size: "0" }}>
        <LoadingProvider $appearance="circle">
          <NavigationContainer
            className="w-100 h-100"
          // $navigationMode="manual"
          // $navigationMode="minimize"
          // $navigationMode="visible"
          // $navigationPosition="right"
          // $footerVisible="always"
          >
            <div>Header</div>
            {/* <div className="flex-start h-100" style={{ width: 200 }}> */}
            <>
              <Menu
                className="flex-1"
                // $direction="horizontal"
                style={{ width: convertSizeNumToStr(280) }}
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
                      key: "icons",
                      label: "Icons",
                      icon: "I",
                      pathname: "/sandbox/elements/icons"
                    }, {
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
                      }, {
                        key: "slider",
                        label: "Slider",
                        icon: "S",
                        pathname: "/sandbox/elements/form-items/slider",
                      }, {
                        key: "date-picker",
                        label: "DatePicker",
                        icon: "DP",
                        pathname: "/sandbox/elements/form-items/date-picker",
                      }, {
                        key: "date-box",
                        label: "DateBox",
                        icon: "D",
                        pathname: "/sandbox/elements/form-items/date-box",
                      }, {
                        key: "electronic-signature",
                        label: "ElectronicSignature",
                        icon: "E",
                        pathname: "/sandbox/elements/form-items/electronic-signature"
                      }, {
                        key: "file-drop",
                        label: "FileDrop",
                        icon: "FD",
                        pathname: "/sandbox/elements/form-items/file-drop",
                      }, {
                        key: "file-button",
                        label: "FileButton",
                        icon: "FB",
                        pathname: "/sandbox/elements/form-items/file-button",
                      }, {
                        key: "select-box",
                        label: "SelectBox",
                        icon: "S",
                        pathname: "/sandbox/elements/form-items/select-box",
                      }, {
                        key: "time-picker",
                        label: "TimePicker",
                        icon: "TP",
                        pathname: "/sandbox/elements/form-items/time-picker",
                      }, {
                        key: "time-box",
                        label: "TimeBox",
                        icon: "TB",
                        pathname: "/sandbox/elements/form-items/time-box",
                      }]
                    }, {
                      key: "container",
                      label: "Container",
                      icon: "C",
                      items: [{
                        key: "tab",
                        label: "Tab",
                        icon: "T",
                        pathname: "/sandbox/elements/container/tab-container",
                      }, {
                        key: "slide",
                        label: "Slide",
                        icon: "S",
                        pathname: "/sandbox/elements/container/slide-container",
                      }, {
                        key: "split",
                        label: "Split",
                        icon: "S",
                        pathname: "/sandbox/elements/container/split-container",
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
                      key: "loading",
                      label: "Loading",
                      icon: "L",
                      pathname: "/sandbox/elements/loading",
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
                    }, {
                      key: "stepper",
                      label: "Stepper",
                      icon: "S",
                      pathname: "/sandbox/elements/stepper",
                    }, {
                      key: "badge",
                      label: "Badge",
                      icon: "B",
                      pathname: "/sandbox/elements/badge",
                    }, {
                      key: "group-box",
                      label: "GroupBox",
                      icon: "G",
                      pathname: "/sandbox/elements/group-box",
                    }, {
                      key: "data-table",
                      label: "DataTable",
                      icon: "DT",
                      pathname: "/sandbox/elements/data-table",
                    }, {
                      key: "struct-view",
                      label: "StructView",
                      icon: "SV",
                      pathname: "/sandbox/elements/struct-view",
                    }],
                  }, {
                    key: "message-box",
                    label: "MessageBox",
                    icon: "M",
                    pathname: "/sandbox/message-box",
                  }, {
                    key: "fetch",
                    label: "Fetch",
                    icon: "F",
                    pathname: "/sandbox/fetch",
                  }]
                }]}
              />
            </>
            <Component {...pageProps} />
            <div>foot</div>
          </NavigationContainer>
        </LoadingProvider>
      </IconContext.Provider>
    </LayoutProvider>
  );
};

export default App;