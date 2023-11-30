"use client";

import { ForwardedRef, forwardRef, useEffect, useRef, useState, type FC, type FunctionComponent, type HTMLAttributes, type Key, type ReactElement, type ReactNode } from "react";
import { appendedColorStyle, attributesWithoutChildren } from "../../utilities/attributes";
import Style from "./index.module.scss";

type OmitAttributes = "color" | "children";
export type TabContainerProps<K extends Key = Key> =
  Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
    $tabPosition?: "top" | "left" | "right" | "bottom";
    $defaultKey?: K;
    $key?: K;
    $onChange?: (key: K) => void;
    $defaultMount?: boolean;
    $unmountDeselected?: boolean;
    $color?: Color;
    $preventAnimation?: boolean;
    $overlap?: boolean;
    children?: ReactElement | [ReactElement, ...Array<ReactElement>];
  };

interface TabContainerFC extends FunctionComponent<TabContainerProps> {
  <K extends Key = Key>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, TabContainerProps<K>>
  ): ReactElement<any> | null;
}

const TabContainer = forwardRef<HTMLDivElement, TabContainerProps>(<
  K extends Key = Key
>(props: TabContainerProps<K>, ref: ForwardedRef<HTMLDivElement>) => {
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
      const preventAnimation = (child.props.preventAnimation ?? props.$preventAnimation) === true;
      tabs.push(
        <div
          key={child.key}
          className={Style.tab}
          data-selected={selected}
          onClick={() => setKey(child?.key!)}
        >
          {child?.props.label}
        </div>
      );
      bodys.push(
        <Content
          key={child.key}
          selected={selected}
          preventAnimation={preventAnimation}
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
    props.$onChange?.(key! as K);
  }, [key]);

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      data-pos={props.$tabPosition || "top"}
    >
      <div
        className={Style.header}
        style={appendedColorStyle({ $color: props.$color })}
      >
        {tabs}
      </div>
      <div
        className={Style.divider}
        style={appendedColorStyle({ $color: props.$color })}
      />
      <div className={Style.body}>
        {bodys}
      </div>
    </div>
  );
}) as TabContainerFC;

const Content: FC<{
  selected: boolean;
  defaultMount: boolean;
  unmountDeselected: boolean;
  preventAnimation: boolean;
  overlap: boolean;
  children: ReactNode;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null!);
  const [selected, setSelected] = useState(props.selected);
  const [mounted, setMounted] = useState(props.selected || props.defaultMount);

  const animationEnd = (target: HTMLDivElement) => {
    if (target.getAttribute("data-selected") !== "true") {
      target.style.visibility = "hidden";
      target.style.removeProperty("top");
      target.style.removeProperty("left");
      if (props.unmountDeselected) {
        setMounted(false);
      }
    }
  };

  const transitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    animationEnd(e.currentTarget);
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

  useEffect(() => {
    if (props.preventAnimation) {
      animationEnd(ref.current);
    }
  }, [selected]);

  return (
    <div
      ref={ref}
      className={Style.content}
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

export default TabContainer;