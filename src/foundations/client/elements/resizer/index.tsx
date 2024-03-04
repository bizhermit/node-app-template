"use client";

import throttle from "#/utilities/throttle";
import type { FC, HTMLAttributes, MutableRefObject } from "react";
import { releaseCursor, setCursor } from "../../utilities/cursor";
import joinCn from "../../utilities/join-class-name";
import { convertSizeNumToStr } from "../../utilities/size";
import Style from "./index.module.scss";

export type ResizeDirection = "x" | "y" | "xy";

type ResizerOptions = {
  $disabled?: boolean;
  $direction?: ResizeDirection;
  $reverse?: boolean;
  $targetRef?: MutableRefObject<HTMLElement>;
  $onResize?: (ctx: { element: HTMLElement; }) => void;
  $onResizing?: (ctx: { width?: number; height?: number; }) => void;
  $onResized?: (ctx: { width?: number; height?: number; }) => void;
};

export type ResizerProps = OverwriteAttrs<Omit<HTMLAttributes<HTMLDivElement>, "children">, ResizerOptions>;

const timeout = 10;
const attrName = "data-resizing";

const Resizer: FC<ResizerProps> = ({
  className,
  $disabled,
  $direction,
  $reverse,
  $targetRef,
  $onResize,
  $onResizing,
  $onResized,
  ...props
}) => {
  const resizeStart = (ev: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, cx: number, cy: number, isTouch?: boolean) => {
    const callReturn = () => {
      props[isTouch ? "onTouchStart" : "onMouseDown"]?.(ev as any);
    };
    if ($direction == null) return callReturn();
    const elem = ev.currentTarget;
    const pelem = $targetRef?.current ?? elem.parentElement;
    if (pelem == null) return callReturn();
    pelem.setAttribute(attrName, $direction);
    const prect = pelem.getBoundingClientRect();
    const reverse = $reverse === true;
    let posX = cx, posY = cy, lastX = prect.width, lastY = prect.height, cursor = "";
    let move: (arg: any) => void;
    if ($direction === "x") {
      const moveImpl = (x: number) => {
        const w = (x - posX) * (reverse ? -1 : 1) + lastX;
        pelem.style.width = w + "px";
        $onResizing?.({ width: w });
      };
      cursor = "col-resize";
      move = isTouch ?
        throttle((e: TouchEvent) => moveImpl(e.touches[0].clientX), timeout) :
        throttle((e: MouseEvent) => moveImpl(e.clientX), timeout);
    } else if ($direction === "y") {
      const moveImpl = (y: number) => {
        const h = (y - posY) * (reverse ? -1 : 1) + lastY;
        pelem.style.height = h + "px";
        $onResizing?.({ height: h });
      };
      cursor = "row-resize";
      move = isTouch ?
        throttle((e: TouchEvent) => moveImpl(e.touches[0].clientY), timeout) :
        throttle((e: MouseEvent) => moveImpl(e.clientY), timeout);
    } else {
      const moveImpl = (x: number, y: number) => {
        const w = (x - posX) * (reverse ? -1 : 1) + lastX;
        const h = (y - posY) * (reverse ? -1 : 1) + lastY;
        pelem.style.width = w + "px";
        pelem.style.height = h + "px";
        $onResizing?.({ width: w, height: h });
      };
      cursor = "nwse-resize";
      move = isTouch ?
        throttle((e: TouchEvent) => moveImpl(e.touches[0].clientX, e.touches[0].clientY), timeout) :
        throttle((e: MouseEvent) => moveImpl(e.clientX, e.clientY), timeout);
    }
    const endImpl = () => {
      pelem.removeAttribute(attrName);
      const width = pelem.offsetWidth;
      const ctx: { width?: number; height?: number; } = {};
      if (width != null) {
        pelem.style.width = convertSizeNumToStr(ctx.width = width);
      }
      const height = pelem.offsetHeight;
      if (height != null) {
        pelem.style.height = convertSizeNumToStr(ctx.height = height);
      }
      return ctx;
    };
    if (isTouch) {
      const end = () => {
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", end);
        const ctx = endImpl();
        $onResized?.(ctx);
      };
      window.addEventListener("touchend", end);
      window.addEventListener("touchmove", move);
    } else {
      setCursor(cursor);
      const end = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", end);
        releaseCursor();
        const ctx = endImpl();
        $onResized?.(ctx);
      };
      window.addEventListener("mouseup", end);
      window.addEventListener("mousemove", move);
    }
    callReturn();
    $onResize?.({ element: pelem });
  };

  if ($direction == null || $disabled) return <></>;
  return (
    <div
      {...props}
      className={joinCn(Style.main, Style[$direction], className)}
      onMouseDown={e => resizeStart(e, e.clientX, e.clientY)}
      onTouchStart={e => resizeStart(e, e.touches[0].clientX, e.touches[0].clientY, true)}
      onClick={e => e.stopPropagation()}
    />
  );
};

export default Resizer;
