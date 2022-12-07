import { attributesWithoutChildren } from "@/utilities/attributes";
import React, { FC, HTMLAttributes, Key, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import Style from "$/components/elements/tab-container.module.scss";
import LabelText from "@/components/elements/label-text";

export type TabContainerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  $tabPosition?: "top" | "left" | "right" | "bottom";
  $defaultKey?: Key;
  $defaultMount?: boolean;
  $unmountDeselected?: boolean;
  $color?: Color;
  children?: ReactElement | [ReactElement, ...Array<ReactElement>];
};

const TabContainer = React.forwardRef<HTMLDivElement, TabContainerProps>((props, ref) => {
  const color = props.$color || "main";

  const [key, setKey] = useState(() => {
    if (props.$defaultKey != null) return props.$defaultKey;
    const firstContent = Array.isArray(props.children) ? props.children[0] : props.children!;
    return firstContent.key;
  });

  const { tabs, bodys } = (() => {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    const tabs: Array<ReactNode> = [];
    const bodys: Array<ReactNode> = [];
    for (let i = 0, il = children.length; i < il; i++) {
      const child = children[i]!;
      const selected = child.key === key;
      tabs.push(
        <div
          key={child.key}
          className={`${Style.tab} bdc-${color}${selected ? ` c-${color}` : ""}`}
          data-selected={selected}
          onClick={() => setKey(child?.key!)}
        >
          <LabelText>{child?.props.label}</LabelText>
        </div>
      );
      bodys.push(
        <Content
          key={child.key}
          selected={selected}
          defaultMount={props.$defaultMount ?? false}
          unmountDeselected={props.$unmountDeselected ?? false}
        >
          {child}
        </Content>
      );
    }
    return { tabs, bodys };
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
      <div className={`${Style.divider} bgc-${color}`} />
      <div className={Style.body}>
        {bodys}
      </div>
    </div>
  );
});

const Content: FC<{
  selected: boolean;
  defaultMount: boolean;
  unmountDeselected: boolean;
  children: ReactNode;
}> = (props) => {
  const mounted = useRef(props.selected || props.defaultMount);
  const [selected, setSelected] = useState(props.selected);

  useEffect(() => {
    if (props.selected) {
      mounted.current = true;
    } else {
      if (props.unmountDeselected) {
        mounted.current = false;
      }
    }
    setSelected(props.selected);
  }, [props.selected]);

  return (
    <div
      className={Style.content}
      data-preselected={props.selected}
      data-selected={selected}
    >
      {mounted.current && props.children}
    </div>
  );
};

export const TabContent: FC<{
  key: Key;
  label: ReactNode;
  children?: ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export default TabContainer;