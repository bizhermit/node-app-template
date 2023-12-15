"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, type FC, type HTMLAttributes, type ReactElement } from "react";
import { attrs, convertSizeNumToStr } from "../../utilities/attributes";
import Resizer from "../resizer";
import Style from "./index.module.scss";

type SplitDirection = "horizontal" | "vertical";

type SplitContainerOptions = {
  $direction?: SplitDirection;
  $reverse?: boolean;
  $disabled?: boolean;
  $hide0?: boolean;
  $hide1?: boolean;
  children: [ReactElement, ReactElement];
};

export type SplitContainerProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, SplitContainerOptions>;

const SplitContainer = forwardRef<HTMLDivElement, SplitContainerProps>(({
  $direction,
  $reverse,
  $disabled,
  $hide0,
  $hide1,
  children,
  ...props
}, $ref) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);
  const c1Ref = useRef<HTMLDivElement>(null!);

  const direction = $direction || "horizontal";
  const reverse = $reverse ?? false;
  const p0 = children[0].props as SlideContentProps;
  const {
    $defaultSize,
    $maxSize,
    $minSize,
    ...p1
  } = children[1].props as SlideContentProps;

  useEffect(() => {
    if (c1Ref.current) {
      if (direction === "horizontal") {
        c1Ref.current.style.removeProperty("height");
        c1Ref.current.style.removeProperty("max-height");
        c1Ref.current.style.removeProperty("min-height");
        c1Ref.current.style.width = convertSizeNumToStr($defaultSize) ?? "50%";
        if ($maxSize != null) {
          c1Ref.current.style.maxWidth = convertSizeNumToStr($maxSize)!;
        }
        if ($minSize != null) {
          c1Ref.current.style.minWidth = convertSizeNumToStr($minSize)!;
        }
      } else {
        c1Ref.current.style.removeProperty("width");
        c1Ref.current.style.removeProperty("max-width");
        c1Ref.current.style.removeProperty("min-width");
        c1Ref.current.style.height = convertSizeNumToStr($defaultSize) ?? "50%";
        if ($maxSize != null) {
          c1Ref.current.style.maxHeight = convertSizeNumToStr($maxSize)!;
        }
        if ($minSize != null) {
          c1Ref.current.style.minHeight = convertSizeNumToStr($minSize)!;
        }
      }
    }
  }, [direction, $hide0, $hide1]);

  return (
    <div
      {...attrs(props, Style.wrap)}
      ref={ref}
      data-direction={direction}
      data-reverse={reverse}
    >
      {!$hide0 && <div {...attrs(p0, Style.content0)} />}
      {!$disabled && !$hide0 && !$hide1 &&
        <Resizer
          className={Style.handle}
          targetRef={c1Ref}
          direction={direction === "horizontal" ? "x" : "y"}
          reverse={!reverse}
        />
      }
      {!$hide1 &&
        <div
          {...attrs(p1, Style.content1)}
          ref={c1Ref}
        />
      }
    </div>
  );
});

type SlideContentOptions = {
  $defaultSize?: number | string;
  $minSize?: number | string;
  $maxSize?: number | string;
};

type SlideContentProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, SlideContentOptions>;

export const SplitContent: FC<SlideContentProps> = ({ children }) => {
  return <>{children}</>;
};

export default SplitContainer;