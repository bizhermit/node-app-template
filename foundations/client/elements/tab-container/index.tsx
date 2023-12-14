"use client";

import type { TabContentProps } from "#/client/elements/tab-container/content";
import { ForwardedRef, forwardRef, useEffect, useRef, useState, type FC, type FunctionComponent, type HTMLAttributes, type Key, type ReactElement, type ReactNode } from "react";
import { attrs } from "../../utilities/attributes";
import Style from "./index.module.scss";

type TabContainerOptions<K extends Key = Key> = {
  $tabPosition?: "top" | "left" | "right" | "bottom";
  $defaultKey?: K;
  $key?: K;
  $defaultMount?: boolean;
  $unmountDeselected?: boolean;
  $color?: Color;
  $preventAnimation?: boolean;
  $overlap?: boolean;
  $onChange?: (key: K) => void;
  children?: ReactElement | [ReactElement, ...Array<ReactElement>];
};

export type TabContainerProps<K extends Key = Key> =
  OverwriteAttrs<HTMLAttributes<HTMLDivElement>, TabContainerOptions<K>>;

interface TabContainerFC extends FunctionComponent<TabContainerProps> {
  <K extends Key = Key>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, TabContainerProps<K>>
  ): ReactElement<any> | null;
}

const TabContainer = forwardRef(<K extends Key = Key>({
  $tabPosition,
  $defaultKey,
  $key,
  $defaultMount,
  $unmountDeselected,
  $color,
  $preventAnimation,
  $overlap,
  $onChange,
  children,
  ...props
}: TabContainerProps<K>, ref: ForwardedRef<HTMLDivElement>) => {
  const contents = Array.isArray(children) ? children : [children];

  const [key, setKey] = useState(() => {
    if ($key != null) return $key;
    if ($defaultKey != null) return $defaultKey;
    return contents[0]?.key;
  });

  const { tabs, bodys } = (() => {
    const tabs: Array<ReactNode> = [];
    const bodys: Array<ReactNode> = [];
    for (let i = 0, il = contents.length; i < il; i++) {
      const content = contents[i]!;
      const { $label, $color, ...cProps } = content.props as Omit<TabContentProps, "key">;
      const selected = content.key === key;

      tabs.push(
        <div
          key={content.key!}
          className={Style.tab}
          role="button"
          data-selected={selected}
          data-color={$color}
          onClick={() => setKey(content.key)}
        >
          {$label}
        </div>
      );
      bodys.push(
        <Content
          $overlap={$overlap}
          $defaultMount={$defaultMount}
          $preventAnimation={$preventAnimation}
          $unmountDeselected={$unmountDeselected}
          {...cProps}
          key={content.key!}
          $selected={selected}
        >
          {content}
        </Content>
      );
    }
    return { tabs, bodys };
  })();

  useEffect(() => {
    if ($key != null) setKey($key);
  }, [$key]);

  useEffect(() => {
    $onChange?.(key! as K);
  }, [key]);

  return (
    <div
      {...attrs(props, Style.wrap)}
      ref={ref}
      data-pos={$tabPosition || "top"}
      data-color={$color}
    >
      <div className={Style.header}>
        {tabs}
      </div>
      <div className={Style.divider} />
      <div className={Style.body}>
        {bodys}
      </div>
    </div>
  );
}) as TabContainerFC;

const Content: FC<{ $selected: boolean; } & Omit<TabContentProps, "$label" | "$color">> = ({
  $selected,
  $defaultMount,
  $overlap,
  $preventAnimation,
  $unmountDeselected,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null!);
  const [selected, setSelected] = useState($selected);
  const [mounted, setMounted] = useState($selected || $defaultMount);

  const animationEnd = (target: HTMLDivElement) => {
    if (target.getAttribute("data-selected") !== "true") {
      target.style.visibility = "hidden";
      target.style.removeProperty("top");
      target.style.removeProperty("left");
      if ($unmountDeselected) {
        setMounted(false);
      }
    }
  };

  const transitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) animationEnd(e.currentTarget);
    props.onTransitionEnd?.(e);
  };

  useEffect(() => {
    if ($selected) {
      setMounted(true);
      ref.current?.style.removeProperty("visibility");
    } else {
      if ($overlap) {
        ref.current.style.top = "0";
        ref.current.style.left = "0";
      }
    }
    setSelected($selected);
  }, [$selected]);

  useEffect(() => {
    if ($preventAnimation) {
      animationEnd(ref.current);
    }
  }, [selected]);

  return (
    <div
      {...attrs(props, Style.content)}
      ref={ref}
      style={{
        ...props.style,
        visibility: "hidden",
      }}
      data-preselected={$selected}
      data-selected={selected}
      data-overlap={$overlap}
      onTransitionEnd={transitionEnd}
    >
      {mounted && props.children}
    </div>
  );
};

export default TabContainer;