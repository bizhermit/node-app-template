"use client";

import React, { forwardRef, useEffect, useState, type FC, type ForwardedRef, type FunctionComponent, type HTMLAttributes, type Key, type ReactElement, type ReactNode } from "react";
import { attrs } from "../../utilities/attributes";
import Text from "../text";
import { SlideContentProps } from "./content";
import Style from "./index.module.scss";

type SlideState = "before" | "prev" | "current" | "next" | "after";
type BreadcrumbsPosition = "top" | "left" | "bottom" | "right";
type SlideDirection = "horizontal" | "horizontal-reverse" | "vertical" | "vertical-reverse";

type SlideContainerOptions<K extends Key = Key> = {
  $key?: K;
  $direction?: SlideDirection;
  $defaultMount?: boolean;
  $unmountDeselected?: boolean;
  $overlap?: boolean;
  $breadcrumbs?: boolean
  $breadcrumbsPosition?: BreadcrumbsPosition;
  $onChange?: (key: Key) => void;
  children?: ReactElement | [ReactElement, ...Array<ReactElement>];
};

export type SlideContainerProps<K extends Key = Key> =
  OverwriteAttrs<HTMLAttributes<HTMLDivElement>, SlideContainerOptions<K>>;

interface SlideContainerFC extends FunctionComponent<SlideContainerProps> {
  <K extends Key = Key>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, SlideContainerProps<K>>
  ): ReactElement<any> | null;
}

const SlideContainer = forwardRef(<K extends Key = Key>({
  $key,
  $direction,
  $defaultMount,
  $unmountDeselected,
  $overlap,
  $breadcrumbs,
  $breadcrumbsPosition,
  $onChange,
  children,
  ...props
}: SlideContainerProps<K>, ref: ForwardedRef<HTMLDivElement>) => {
  const contents = Array.isArray(children) ? children : [children];

  const { breadcrumbs, bodys, key } = (() => {
    const breadcrumbs: Array<ReactNode> = [];
    const bodys: Array<ReactNode> = [];
    let key = $key ?? contents[0]!.key!;
    const keyStr = key.toString();
    let prevKey: Key | null | undefined, nextKey: Key | null | undefined;
    let index: number = 0;
    for (let i = 0, il = contents.length; i < il; i++) {
      const content = contents[i]!;
      if (content.key !== keyStr) continue;
      index = i;
      key = content.key;
      nextKey = contents[i + 1]?.key;
      prevKey = contents[i - 1]?.key;
    }

    for (let i = 0, il = contents.length; i < il; i++) {
      const content = contents[i]!;
      const k = content.key?.toString()!;
      const state: SlideState = (() => {
        if (k === keyStr) return "current";
        if (k === prevKey) return "prev";
        if (k === nextKey) return "next";
        if (i < index) return "before";
        return "after";
      })();
      const { $label, ...cProps } = content.props as Omit<SlideContentProps, "key">;

      if ($breadcrumbs) {
        breadcrumbs.push(
          <div
            key={k}
            className={Style.breadcrumb}
            data-state={state}
          >
            <Text>{$label}</Text>
          </div>
        );
      }
      bodys.push(
        <Content
          $overlap={$overlap}
          $defaultMount={$defaultMount}
          $unmountDeselected={$unmountDeselected}
          {...cProps}
          key={k}
          $state={state}
        >
          {content}
        </Content>
      );
    }
    return { breadcrumbs, bodys, key };
  })();

  useEffect(() => {
    $onChange?.(key);
  }, [key]);

  return (
    <div
      {...attrs(props, Style.wrap)}
      ref={ref}
      data-direction={$direction || "horizontal"}
      data-pos={$breadcrumbsPosition || "top"}
    >
      {$breadcrumbs &&
        <div className={Style.breadcrumbs}>
          {breadcrumbs}
        </div>
      }
      <div className={Style.body}>
        {bodys}
      </div>
    </div>
  );
}) as SlideContainerFC;

type ContentProps = Omit<SlideContentProps, "$label"> & {
  $state: SlideState;
};

const Content: FC<ContentProps> = ({
  $overlap,
  $defaultMount,
  $unmountDeselected,
  $state,
  children,
  ...props
}) => {
  const [state, setState] = useState($state);
  const [mounted, setMounted] = useState(state === "current" || $defaultMount);

  const transitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (
      e.target === e.currentTarget &&
      $unmountDeselected &&
      e.currentTarget.getAttribute("data-state") !== "current"
    ) {
      setMounted(false);
    }
    props.onTransitionEnd?.(e);
  };

  useEffect(() => {
    if ($state === "current") setMounted(true);
    setState($state);
  }, [$state]);

  return (
    <div
      {...attrs(props, Style.content)}
      data-state={state}
      data-overlap={$overlap}
      onTransitionEnd={transitionEnd}
    >
      {mounted && children}
    </div>
  );
};

export default SlideContainer;