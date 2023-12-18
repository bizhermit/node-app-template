import { ButtonIcon, ContainerIcon, ElementIcon, ExLinkIcon, FormIcon, FormItemIcon, HomeIcon, HorizontalDividerIcon, LabelIcon, LoadingIcon, NavContainerIcon, PopupIcon, SlideContainerIcon, SmileIcon, SplitContainerIcon, StepperIcon, TabContainerIcon, TextBoxIcon } from "#/client/elements/icon";
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
            ],
          },
          {
            key: "loading",
            icon: <LoadingIcon />,
            label: "Loading",
            pathname: "/dev/elements/loading",
          },
          {
            key: "popup",
            icon: <PopupIcon />,
            label: "Popup",
            pathname: "/dev/elements/popup",
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
          }
        ],
      }
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