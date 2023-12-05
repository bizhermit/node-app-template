import { FC, ReactNode } from "react";
import Style from "./control-layout.module.scss";

const ControlLayout: FC<{
  children?: ReactNode;
}> = (props) => {
  return (
    <div className={Style.wrap}>
      {props.children}
    </div>
  );
};

export const ControlItem: FC<{
  caption: ReactNode;
  children: ReactNode;
}> = (props) => {
  return (
    <div className={Style.item}>
      <div className={Style.caption}>
        {props.caption}
      </div>
      <div className={Style.content}>
        {props.children}
      </div>
    </div>
  );
};

export default ControlLayout;