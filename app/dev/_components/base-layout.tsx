import { FC, ReactNode } from "react";
import Style from "./base-layout.module.scss";

const BaseLayout: FC<{
  title: ReactNode;
  children: ReactNode;
}> = (props) => {
  return (
    <div className={Style.base}>
      <h1 className={Style.title}>
        {props.title}
      </h1>
      <div className={Style.contents}>
        {props.children}
      </div>
    </div>
  );
};

export const BaseSheet: FC<{
  children: ReactNode
}> = (props) => {
  return (
    <div className={Style.sheet}>
      {props.children}
    </div>
  );
};

export default BaseLayout;