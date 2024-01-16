import NextLink from "#/client/elements/link";
import { FC } from "react";
import UserControlButton from "./header-user-control";
import Style from "./header.module.scss";

const NavHeader: FC<{
  user: SignInUser;
}> = ({ user }) => {
  return (
    <div className={Style.wrap}>
      <div className={Style.title}>
        <NextLink
          href="/[uid]"
          params={{ uid: user.id }}
          aria-disabled
        >
          Node App Template
        </NextLink>
      </div>
      <div className={Style.user}>
        <div className={Style.name}>
          {user.name}
        </div>
        <UserControlButton />
      </div>
    </div>
  );
};

export default NavHeader;