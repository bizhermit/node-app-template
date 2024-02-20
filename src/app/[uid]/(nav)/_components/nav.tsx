import { HomeIcon } from "#/client/elements/icon";
import Menu from "#/client/elements/menu";
import { getDynamicUrl } from "#/objects/url/dynamic-url";
import { FC } from "react";

const Nav: FC<{
  user: SignInUser;
}> = ({ user }) => {
  return (
    <Menu
      iconSpace
      items={[
        {
          key: "home",
          pathname: getDynamicUrl("/[uid]", { uid: user.id }),
          label: "Home",
          icon: <HomeIcon />
        }
      ]}
    />
  );
};

export default Nav;
