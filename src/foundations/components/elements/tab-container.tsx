"use client";

import Style from "#/styles/components/elements/tab-container.module.scss";
import { attributesWithoutChildren } from "#/components/utilities/attributes";
import { type FC, forwardRef, type HTMLAttributes, type Key, type ReactElement, type ReactNode, useEffect, useRef, useState } from "react";

type OmitAttributes = "color" | "children";
export type TabContainerProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $tabPosition?: "top" | "left" | "right" | "bottom";
  $defaultKey?: Key;
  $key?: Key;
  $onChange?: (key: Key) => void;
  $defaultMount?: boolean;
  $unmountDeselected?: boolean;
  $color?: Color;
  $bodyColor?: Color;
  $overlap?: boolean;
  children?: ReactElement | [ReactElement, ...Array<ReactElement>];
};

const TabContainer = forwardRef<HTMLDivElement, TabContainerProps>((props, ref) => {
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
          {child?.props.label}
        </div>
      );
      bodys.push(
        <Content
          key={child.key}
          color={bodyColor}
          selected={selected}
          overlap={child.props?.overlap ?? props.$overlap ?? false}
          defaultMount={child.props.defaultMount ?? props.$defaultMount ?? false}
          unmountDeselected={child.props.unmountDeselected ?? props.$unmountDeselected ?? false}
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
  overlap: boolean;
  children: ReactNode;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null!);
  const [selected, setSelected] = useState(props.selected);
  const [mounted, setMounted] = useState(props.selected || props.defaultMount);

  const transitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.currentTarget.getAttribute("data-selected") !== "true") {
      e.currentTarget.style.visibility = "hidden";
      e.currentTarget.style.removeProperty("top");
      e.currentTarget.style.removeProperty("left");
      if (props.unmountDeselected) {
        setMounted(false);
      }
    }
  };

  useEffect(() => {
    if (props.selected) {
      setMounted(true);
      ref.current?.style.removeProperty("visibility");
    } else {
      if (props.overlap) {
        ref.current.style.top = "0";
        ref.current.style.left = "0";
      }
    }
    setSelected(props.selected);
  }, [props.selected]);

  return (
    <div
      ref={ref}
      className={`${Style.content} c-${props.color}`}
      style={{
        visibility: "hidden",
      }}
      data-preselected={props.selected}
      data-selected={selected}
      data-overlap={props.overlap}
      onTransitionEnd={transitionEnd}
    >
      {mounted && props.children}
    </div>
  );
};

export const TabContent: FC<{
  key: Key;
  label: ReactNode;
  overlap?: boolean;
  defaultMount?: boolean;
  unmountDeselected?: boolean;
  children?: ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export default TabContainer;