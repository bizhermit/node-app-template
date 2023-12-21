"use client";

import type React from "react";
import { forwardRef, useCallback, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import Popup from "../popup";

type TooltipOptions = {
  $popupClassName?: string;
  $disabled?: boolean;
  $showDelay?: number;
  $position?: {
    x?: "outer" | "outer-left" | "outer-right",
    y?: "outer" | "outer-top" | "outer-bottom",
  },
  $animationDuration?: number;
  $preventElevation?: boolean;
  children: ReactNode | [ReactNode] | [ReactNode, ReactNode];
};

type TooltipProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, TooltipOptions>;

type MousePosition = { pageX: number; pageY: number };

const cursorMargin = 10;
const defaultShowDelay = 500;

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(({
  $popupClassName,
  $disabled,
  $showDelay,
  $position,
  $animationDuration,
  $preventElevation,
  children,
  ...props
}, ref) => {
  const [showed, setShowed] = useState(false);
  const pos = useRef<MousePosition | undefined>();
  const posX = $position?.x || "outer";
  const posY = $position?.y || "outer";

  const move = useCallback((e: { pageX: number; pageY: number; }) => {
    pos.current = {
      pageX: e.pageX - document.documentElement.scrollLeft - document.body.scrollLeft,
      pageY: e.pageY - document.documentElement.scrollTop - document.body.scrollTop,
    };
  }, []);

  const enter = (e: React.MouseEvent<HTMLDivElement>) => {
    if ($disabled) return;
    move(e);
    window.addEventListener("mousemove", move);
    setTimeout(() => {
      if (pos.current == null) return;
      setShowed(true);
    }, $showDelay ?? defaultShowDelay);
    props.onMouseEnter?.(e);
  };

  const leave = (e?: React.MouseEvent<HTMLDivElement>) => {
    window.removeEventListener("mousemove", move);
    pos.current = undefined;
    setShowed(false);
    if (e) props.onMouseLeave?.(e);
  };

  return (
    <>
      <div
        {...props}
        ref={ref}
        onMouseEnter={enter}
        onMouseLeave={leave}
      >
        {Array.isArray(children) ? children[0] : children}
      </div>
      {Array.isArray(children) && children[1] != null &&
        <Popup
          className={$popupClassName}
          $show={showed && pos.current != null}
          $onToggle={showed => {
            if (!showed) leave();
          }}
          $preventElevation={$preventElevation}
          $anchor={pos.current}
          $position={{
            x: posX,
            y: posY,
            marginX: cursorMargin,
            marginY: cursorMargin,
          }}
          $animationDuration={$animationDuration ?? 40}
        >
          {children[1]}
        </Popup>
      }
    </>
  );
});

export default Tooltip;