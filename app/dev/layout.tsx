import { ButtonIcon, ContainerIcon, ElementIcon, ExLinkIcon, HomeIcon, NavContainerIcon, PopupIcon, SmileIcon } from "#/client/elements/icon";
import Menu from "#/client/elements/menu";
import NavigationContainer from "#/client/elements/navigation-container";
// import NavigationContainer from "#/client/elements/navigation-container/fat";
import Image from "next/image";

const devMenus = (
  <Menu
    style={{
      minWidth: 280
    }}
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
            key: "cont",
            icon: <ContainerIcon />,
            label: "Container",
            items: [
              {
                key: "nav",
                icon: <NavContainerIcon />,
                label: "Navigation",
                pathname: "/dev/elements/container/navigation",
              },
            ],
          },
          {
            key: "popup",
            icon: <PopupIcon />,
            label: "Popup",
            pathname: "/dev/elements/popup",
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