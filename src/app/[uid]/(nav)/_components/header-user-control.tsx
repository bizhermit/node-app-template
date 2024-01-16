"use client";

import Button from "#/client/elements/button";
import { MenuIcon } from "#/client/elements/icon";
import Popup from "#/client/elements/popup";
import { useState } from "react";
import { useUser } from "../../_components/signed-in-provider";
import Style from "./header.module.scss";

const UserControlButton = () => {
  const [showed, setShowed] = useState(false);
  const user = useUser();

  return (
    <div>
      <Button
        className={Style.menu}
        $icon={<MenuIcon />}
        $size="s"
        $text
        onClick={() => {
          if (!showed) setShowed(true);
        }}
      />
      <Popup
        className={Style.popup}
        $anchor="parent"
        $show={showed}
        $onToggle={setShowed}
        $closeWhenClick
        $position={{
          x: "inner-right",
          y: "outer-bottom",
        }}
      >
        <Button onClick={user.signOut}>
          SignOut
        </Button>
      </Popup>
    </div>
  );
};

export default UserControlButton;