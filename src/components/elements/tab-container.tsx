import { attributesWithoutChildren } from "@/utilities/attributes";
import React, { HTMLAttributes, ReactNode } from "react";
import Style from "$/components/elements/tab-container.module.scss";

export type TabContainerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  $tabPosition?: "top" | "left" | "right" | "bottom";
  children?: ReactNode | [ReactNode, ...Array<ReactNode>];
};

const TabContainer = React.forwardRef<HTMLDivElement, TabContainerProps>((props, ref) => {
  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      data-pos={props.$tabPosition || "top"}
    >
      <div className={Style.header}>

      </div>
      <div className={Style.body}>

      </div>
    </div>
  );
});

export default TabContainer;