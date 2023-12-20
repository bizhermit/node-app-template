import { BadgeIcon, ButtonIcon, CardIcon, ContainerIcon, ElementIcon, ExLinkIcon, FormIcon, FormItemIcon, HomeIcon, HorizontalDividerIcon, LabelIcon, LoadingIcon, NavContainerIcon, PopupIcon, SlideContainerIcon, SmileIcon, SplitContainerIcon, StepperIcon, TabContainerIcon, TextBoxIcon, TooltipIcon } from "#/client/elements/icon";
import Menu from "#/client/elements/menu";
import NavigationContainer from "#/client/elements/navigation-container";
import Image from "next/image";

const devMenus = (
  <Menu
    iconSpace
    items={[
      {
        key: "index",
        icon: (
          <Image
            src="/favicons/favicon.ico"
            alt=""
            height={20}
            width={20}
          />
        ),
        label: "Index",
        pathname: "/",
      },
      {
        key: "home",
        icon: <HomeIcon />,
        label: "Home",
        pathname: "/dev",
      },
      {
        key: "color",
        icon: "C",
        label: "Color",
        pathname: "/dev/color",
      },
      {
        key: "elements",
        icon: <ElementIcon />,
        label: "Elements",
        items: [
          {
            key: "icon",
            icon: <SmileIcon />,
            label: "Icon",
            pathname: "/dev/elements/icon",
          },
          {
            key: "button",
            icon: <ButtonIcon />,
            label: "Button",
            pathname: "/dev/elements/button",
          },
          {
            key: "link",
            icon: <ExLinkIcon />,
            label: "NextLink",
            pathname: "/dev/elements/link",
          },
          {
            key: "form",
            icon: <FormIcon />,
            label: "Form",
            pathname: "/dev/elements/form",
          },
          {
            key: "form-items",
            icon: <FormItemIcon />,
            label: "FormItems",
            items: [
              {
                key: "text-box",
                icon: <TextBoxIcon />,
                label: "TextBox",
              }
            ],
          },
          {
            key: "cont",
            icon: <ContainerIcon />,
            label: "Container",
            items: [
              {
                key: "group",
                icon: <ContainerIcon />,
                label: "Group",
                pathname: "/dev/elements/container/group",
              },
              {
                key: "nav",
                icon: <NavContainerIcon />,
                label: "Navigation",
                pathname: "/dev/elements/container/navigation",
              },
              {
                key: "tab",
                icon: <TabContainerIcon />,
                label: "Tab",
                pathname: "/dev/elements/container/tab",
              },
              {
                key: "slide",
                icon: <SlideContainerIcon />,
                label: "Slide",
                pathname: "/dev/elements/container/slide",
              },
              {
                key: "split",
                icon: <SplitContainerIcon />,
                label: "Split",
                pathname: "/dev/elements/container/split"
              },
              {
                key: "popup",
                icon: <PopupIcon />,
                label: "Popup",
                pathname: "/dev/elements/popup",
              },
              {
                key: "card",
                icon: <CardIcon />,
                label: "Card",
                pathname: "/dev/elements/container/card",
              }
            ],
          },
          {
            key: "loading",
            icon: <LoadingIcon />,
            label: "Loading",
            pathname: "/dev/elements/loading",
          },
          {
            key: "label",
            icon: <LabelIcon />,
            label: "Label",
            pathname: "/dev/elements/label",
          },
          {
            key: "stepper",
            icon: <StepperIcon />,
            label: "Stepper",
            pathname: "/dev/elements/stepper",
          },
          {
            key: "divider",
            icon: <HorizontalDividerIcon />,
            label: "Divider",
            pathname: "/dev/elements/divider",
          },
          {
            key: "tooltip",
            icon: <TooltipIcon />,
            label: "Tooltip",
            pathname: "/dev/elements/tooltip",
          },
          {
            key: "badge",
            icon: <BadgeIcon />,
            label: "Badge",
            pathname: "/dev/elements/badge"
          },
          {
            key: "view",
            icon: "V",
            label: "View",
            items: [
              {
                key: "struct",
                icon: "SV",
                label: "StructView",
                pathname: "/dev/elements/view/struct-view",
              },
              {
                key: "data-table",
                icon: "DT",
                label: "DataTable",
                pathname: "/dev/elements/view/data-table",
              },
              {
                key: "data-list",
                icon: "DL",
                label: "DataList",
                pathname: "/dev/elements/view/data-list",
              },
              {
                key: "menu",
                icon: "M",
                label: "Menu",
                pathname: "/dev/elements/view/menu",
              },
            ],
          },
        ],
      },
      {
        key: "routing",
        icon: "R",
        label: "Routing",
        items: [
          {
            key: "apps",
            icon: "A",
            label: "App Route",
            pathname: "/dev/dynamic-route",
          },
          {
            key: "pages",
            icon: "P",
            label: "Pages Route",
            items: [
              {
                key: "pages",
                icon: "P",
                label: "/pages",
                pathname: "/pages",
              },
              {
                key: "root",
                icon: "R",
                label: "/root",
                pathname: "/root",
              },
              {
                key: "sandbox/pages",
                icon: "SP",
                label: "/sandbox/pages",
                pathname: "/sandbox/pages",
              }
            ],
          },
        ]
      },
    ]}
  />
);

const Layout: LayoutFC = ({ children }) => {
  return (
    <NavigationContainer
      $header="Node App Template / Development"
      $footer="&copy; 2023 bizhermit.com"
      $nav={devMenus}
    // $defaultNavMode="minimize"
    >
      {children}
    </NavigationContainer>
  );
};

export default Layout;