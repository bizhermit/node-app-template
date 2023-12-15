"use client";

import type { TabContentProps } from "#/client/elements/tab-container/content";
import { ForwardedRef, forwardRef, useEffect, useRef, useState, type FC, type FunctionComponent, type HTMLAttributes, type Key, type ReactElement, type ReactNode } from "react";
import { attrs } from "../../utilities/attributes";
import Style from "./index.module.scss";

type TabContainerOptions<K extends Key = Key> = {
  $defaultKey?: K;
  $key?: K;
  $tabPosition?: "top" | "left" | "right" | "bottom";
  $tabFill?: boolean;
  $defaultMount?: boolean;
  $unmountDeselected?: boolean;
  $color?: Color;
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
  $defaultKey,
  $key,
  $tabPosition,
  $tabFill,
  $defaultMount,
  $unmountDeselected,
  $color,
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

  const { tabs, bodys, color } = (() => {
    const tabs: Array<ReactNode> = [];
    const bodys: Array<ReactNode> = [];
    let color = $color;
    for (let i = 0, il = contents.length; i < il; i++) {
      const content = contents[i]!;
      const { $label, $color, ...cProps } = content.props as Omit<TabContentProps, "key">;
      const selected = content.key === key;
      if (selected) color = $color;

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
          $defaultMount={$defaultMount}
          $unmountDeselected={$unmountDeselected}
          {...cProps}
          key={content.key!}
          $selected={selected}
        >
          {content}
        </Content>
      );
    }
    return { tabs, bodys, color };
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
      data-color={color ?? $color}
    >
      <div
        className={Style.header}
        data-fill={$tabFill}
      >
        {tabs}
      </div>
      <div className={Style.divider} />
      <div className={Style.body}>
        {bodys}
      </div>
    </div>
  );
}) as TabContainerFC;

type ContentProps = Omit<TabContentProps, "$label" | "$color"> & {
  $selected: boolean;
}

const Content: FC<ContentProps> = ({
  $selected,
  $defaultMount,
  $unmountDeselected,
  children,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null!);
  const [selected, setSelected] = useState($selected);
  const [mounted, setMounted] = useState($selected || $defaultMount);

  useEffect(() => {
    if (selected) {
      return () => {
        if ($unmountDeselected) {
          setTimeout(() => setMounted(false), 300); // NOTE: wait animation
        }
      };
    }
  }, [selected]);

  useEffect(() => {
    if ($selected) setMounted(true);
    setSelected($selected);
  }, [$selected]);

  return (
    <div
      {...attrs(props, Style.content)}
      ref={ref}
      data-selected={selected}
    >
      {mounted && children}
    </div>
  );
};

export const TabLabel: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  return <div {...attrs(props, Style.label)} />;
};

export default TabContainer;