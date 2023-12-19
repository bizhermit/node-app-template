"use client";

import Menu from "#/client/elements/menu";
import NavigationContainer from "#/client/elements/navigation-container";
import { FC, ReactNode } from "react";
import { replaceDynamicPathname } from "../../../foundations/client/elements/link";

const SandboxLayoutProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <NavigationContainer
      $header={"Header"}
      $nav={<Navigation />}
      // $navHeader={
      //   <div style={{ fontWeight: "bold", padding: "0 var(--b-m)" }}>
      //     SandBox
      //   </div>
      // }
      $footer={"Footer"}
    >
      {children}
    </NavigationContainer>
  );
};

const Navigation: FC = () => {
  // const navigation = useNavigation();

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
      }}
    >
      <Menu
        direction="vertical"
        // style={{ width: "100%" }}
        items={[{
          key: "index",
          icon: "I",
          label: "Index",
          pathname: "/",
        }, {
          key: "Dynmic",
          icon: "D",
          label: "Dynamic",
          pathname: replaceDynamicPathname("/sandbox/dynamic/[id]", { id: 4 }),
        }, {
          key: "pages",
          icon: "P",
          label: "Pages Directory",
          items: [{
            key: "pages",
            icon: "P",
            label: "Pages",
            pathname: "/pages",
          }, {
            key: "root",
            icon: "R",
            label: "Root",
            pathname: "/root",
          }, {
            key: "sandbox/pages",
            icon: "SP",
            label: "SandBox/Pages",
            pathname: "/sandbox/pages",
          }],
        }, {
          key: "sandbox",
          icon: "S",
          label: "SandBox",
          items: [{
            key: "index",
            icon: "I",
            label: "Index",
            pathname: "/sandbox",
          }, {
            key: "color",
            icon: "C",
            label: "Color",
            pathname: "/sandbox/color",
          }, {
            key: "env",
            icon: "E",
            label: "Env",
            pathname: "/sandbox/env",
          }, {
            key: "elements",
            icon: "E",
            label: "Elements",
            items: [{
              key: "form",
              label: "Form",
              icon: "F",
              items: [{
                key: "check-box",
                label: "CheckBox",
                icon: "C",
                pathname: "/sandbox/elements/form-items/check-box",
              }, {
                key: "check-list",
                label: "CheckList",
                icon: "CL",
                pathname: "/sandbox/elements/form-items/check-list",
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
                key: "password-box",
                label: "PasswordBox",
                icon: "P",
                pathname: "/sandbox/elements/form-items/password-box",
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
              }, {
                key: "hidden",
                label: "Hidden",
                icon: "H",
                pathname: "/sandbox/elements/form-items/hidden",
              }, {
                key: "credit-card-number-box",
                label: "CreditCardNumberBox",
                icon: "CC",
                pathname: "/sandbox/elements/form-items/credit-card-number-box"
              }]
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
              key: "badge",
              label: "Badge",
              icon: "B",
              pathname: "/sandbox/elements/badge",
            }, {
              key: "data-table",
              label: "DataTable",
              icon: "DT",
              pathname: "/sandbox/elements/data-table",
            }, {
              key: "data-list",
              label: "DataList",
              icon: "DL",
              pathname: "/sandbox/elements/data-list",
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
          }, {
            key: "storage",
            label: "Storage",
            icon: "S",
            pathname: "/sandbox/storage"
          }, {
            key: "process",
            label: "Process",
            icon: "P",
            pathname: "/sandbox/process"
          }, {
            key: "dynamic",
            label: "Dynamic",
            icon: "D",
            pathname: "/sandbox/dynamic",
          }, {
            key: "window",
            label: "Window",
            icon: "W",
            pathname: "/sandbox/window",
          }, {
            key: "post",
            label: "Post",
            icon: "P",
            pathname: "/sandbox/post/sender",
          }],
        }]}
      />
    </div>
  );
};

export default SandboxLayoutProvider;