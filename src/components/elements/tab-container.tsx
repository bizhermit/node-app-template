import { attributesWithoutChildren } from "@/utilities/attributes";
import React, { FC, HTMLAttributes, Key, ReactElement, ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/tab-container.module.scss";
import LabelText from "@/components/elements/label-text";

export type TabContainerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  $tabPosition?: "top" | "left" | "right" | "bottom";
  $defaultKey?: Key;
  $key?: Key;
  $onChange?: (key: Key) => void;
  $defaultMount?: boolean;
  $unmountDeselected?: boolean;
  $color?: Color;
  $bodyColor?: Color;
  children?: ReactElement | [ReactElement, ...Array<ReactElement>];
};

const TabContainer = React.forwardRef<HTMLDivElement, TabContainerProps>((props, ref) => {
  const color = props.$color || "main";
  const bodyColor = props.$bodyColor || "base";

  const [key, setKey] = useState(() => {
    if (props.$key != null) return props.$key;
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
          color={bodyColor}
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

  useEffect(() => {
    if (props.$key != null) {
      setKey(props.$key);
    }
  }, [props.$key]);

  useEffect(() => {
    props.$onChange?.(key!);
  }, [key]);

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
      <div className={`${Style.body} c-${bodyColor}`}>
        {bodys}
      </div>
    </div>
  );
});

const Content: FC<{
  selected: boolean;
  defaultMount: boolean;
  unmountDeselected: boolean;
  color: Color;
  children: ReactNode;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null!);
  const [selected, setSelected] = useState(props.selected);
  const [mounted, setMounted] = useState(props.selected || props.defaultMount);

  const transitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.currentTarget.getAttribute("data-selected") !== "true") {
      e.currentTarget.style.visibility = "hidden";
      e.currentTarget.style.opacity = "0";
      if (props.unmountDeselected) {
        setMounted(false);
      }
    }
  };

  useEffect(() => {
    if (props.selected) {
      setMounted(true);
      ref.current?.style.removeProperty("opacity");
      ref.current?.style.removeProperty("visibility");
    }
    setSelected(props.selected);
  }, [props.selected]);

  return (
    <div
      ref={ref}
      className={`${Style.content} c-${props.color}`}
      data-preselected={props.selected}
      data-selected={selected}
      onTransitionEnd={transitionEnd}
    >
      {mounted && props.children}
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