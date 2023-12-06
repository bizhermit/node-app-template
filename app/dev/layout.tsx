import { HomeIcon } from "#/client/elements/icon";
import Menu from "#/client/elements/menu";
import NavigationContainer from "#/client/elements/navigation-container";
import Image from "next/image";

const Layout: LayoutFC = ({ children }) => {
  return (
    <NavigationContainer
      $header="Node App Template / Development"
      $footer="&copy; 2023 bizhermit.com"
      $nav={
        <Menu
          $items={[
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
              icon: "E",
              label: "Elements",
              items: [
                {
                  key: "icon",
                  icon: "I",
                  label: "Icon",
                  pathname: "/dev/elements/icon",
                },
                {
                  key: "cont",
                  icon: "C",
                  label: "Container",
                  items: [
                    {
                      key: "nav",
                      icon: "N",
                      label: "Navigation",
                      pathname: "/dev/elements/container/navigation",
                    },
                  ],
                },
                {
                  key: "popup",
                  icon: "P",
                  label: "Popup",
                  pathname: "/dev/elements/popup",
                }
              ],
            }
          ]}
        />
      }
    >
      {children}
    </NavigationContainer>
  );
};

export default Layout;