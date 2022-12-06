import { attributesWithoutChildren } from "@/utilities/attributes";
import React, { FC, HTMLAttributes, Key, ReactElement, ReactNode, useState } from "react";
import Style from "$/components/elements/tab-container.module.scss";
import LabelText from "@/components/elements/label-text";

export type TabContainerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  $tabPosition?: "top" | "left" | "right" | "bottom";
  $defaultKey?: Key;
  children?: ReactElement | [ReactElement, ...Array<ReactElement>];
};

const TabContainer = React.forwardRef<HTMLDivElement, TabContainerProps>((props, ref) => {
  const [key, setKey] = useState(() => {
    if (props.$defaultKey != null) return props.$defaultKey;
    const firstContent = Array.isArray(props.children) ? props.children[0] : props.children!;
    return firstContent.key;
  });

  const { tabs, body } = (() => {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    return {
      tabs: children.map(child => {
        const selected = child?.key === key;
        const color: Color = child?.props.color || "main";
        return (
          <div
            className={`${Style.tab} bdc-${color}${selected ? "" : ` c-${color}`}`}
            data-selected={selected}
            onClick={() => setKey(child?.key!)}
          >
            <LabelText>{child?.props.label}</LabelText>
          </div>
        );
      }),
      body: children.find(child => child?.key === key),
    };
  })();

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      data-pos={props.$tabPosition || "top"}
    >
      <div className={Style.header}>
        {tabs}
      </div>
      <div className={Style.body}>
        {body}
      </div>
    </div>
  );
});

export const TabContent: FC<{
  key: Key;
  label: ReactNode;
  color?: Color;
  children?: ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export default TabContainer;