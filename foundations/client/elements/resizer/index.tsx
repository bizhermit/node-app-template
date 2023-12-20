"use client";

import type { FC, HTMLAttributes, MutableRefObject } from "react";
import { convertSizeNumToStr, releaseCursor, setCursor } from "../../utilities/attributes";
import joinCn from "../../utilities/join-class-name";
import Style from "./index.module.scss";

export type ResizeDirection = "x" | "y" | "xy";

type ResizerOptions = {
  $disabled?: boolean;
  $direction?: ResizeDirection;
  $reverse?: boolean;
  $targetRef?: MutableRefObject<HTMLElement>;
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
    let move: (arg: any) => void, to: NodeJS.Timeout | null = null;
    if ($direction === "x") {
      const moveImpl = (x: number) => {
        if (to) return;
        to = setTimeout(() => {
          const w = (x - posX) * (reverse ? -1 : 1) + lastX;
          pelem.style.width = w + "px";
          $onResizing?.({ width: w });
          to = null;
        }, timeout);
      };
      cursor = "col-resize";
      move = isTouch ?
        ((e: TouchEvent) => moveImpl(e.touches[0].clientX)) :
        ((e: MouseEvent) => moveImpl(e.clientX));
    } else if ($direction === "y") {
      const moveImpl = (y: number) => {
        if (to) return;
        to = setTimeout(() => {
          const h = (y - posY) * (reverse ? -1 : 1) + lastY;
          pelem.style.height = h + "px";
          $onResizing?.({ height: h });
          to = null;
        }, timeout);
      };
      cursor = "row-resize";
      move = isTouch ?
        ((e: TouchEvent) => moveImpl(e.touches[0].clientY)) :
        ((e: MouseEvent) => moveImpl(e.clientY));
    } else {
      const moveImpl = (x: number, y: number) => {
        if (to) return;
        to = setTimeout(() => {
          const w = (x - posX) * (reverse ? -1 : 1) + lastX;
          const h = (y - posY) * (reverse ? -1 : 1) + lastY;
          pelem.style.width = w + "px";
          pelem.style.height = h + "px";
          $onResizing?.({ width: w, height: h });
          to = null;
        }, timeout);
      };
      cursor = "nwse-resize";
      move = isTouch ?
        ((e: TouchEvent) => moveImpl(e.touches[0].clientX, e.touches[0].clientY)) :
        ((e: MouseEvent) => moveImpl(e.clientX, e.clientY));
    }
    const endImpl = () => {
      pelem.removeAttribute(attrName);
      const width = pelem.style.width;
      const ctx: { width?: number; height?: number; } = {};
      if (width) {
        pelem.style.width = convertSizeNumToStr(ctx.width = parseFloat(width))!;
      }
      const height = pelem.style.height;
      if (height) {
        pelem.style.height = convertSizeNumToStr(ctx.height = parseFloat(height))!;
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