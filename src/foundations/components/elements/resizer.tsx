import type { CSSProperties, FC, MutableRefObject } from "react";
import Style from "#/styles/components/elements/resizer.module.scss";
import { convertSizeNumToStr, releaseCursor, setCursor } from "#/components/utilities/attributes";

export type ResizeDirection = "x" | "y" | "xy";
export type ResizerProps = {
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  direction?: ResizeDirection;
  reverse?: boolean;
  targetRef?: MutableRefObject<HTMLElement>;
  resizing?: (ctx: { width?: number; height?: number; }) => void;
  resized?: (ctx: { width?: number; height?: number; }) => void;
} & Struct;

const Resizer: FC<ResizerProps> = (props) => {
  const resizeStart = (elem: HTMLDivElement, cx: number, cy: number, isTouch?: boolean) => {
    if (props.direction == null) return;
    const pelem = props.targetRef?.current ?? elem.parentElement;
    if (pelem == null) return;
    const prect = pelem.getBoundingClientRect();
    const reverse = props.reverse === true;
    let posX = cx, posY = cy, lastX = prect.width, lastY = prect.height, cursor = "";
    let move: VoidFunc;
    if (props.direction === "x") {
      const moveImpl = (x: number) => {
        const w = (x - posX) * (reverse ? -1 : 1) + lastX;
        pelem.style.width = w + "px";
        props.resizing?.({ width: w });
      };
      cursor = "col-resize";
      if (isTouch) {
        move = ((e: TouchEvent) => moveImpl(e.touches[0].clientX)) as VoidFunc;
      } else {
        move = ((e: MouseEvent) => moveImpl(e.clientX)) as VoidFunc;
      }
    } else if (props.direction === "y") {
      const moveImpl = (y: number) => {
        const h = (y - posY) * (reverse ? -1 : 1) + lastY;
        pelem.style.height = h + "px";
        props.resizing?.({ height: h });
      };
      cursor = "row-resize";
      if (isTouch) {
        move = ((e: TouchEvent) => moveImpl(e.touches[0].clientY)) as VoidFunc;
      } else {
        move = ((e: MouseEvent) => moveImpl(e.clientY)) as VoidFunc;
      }
    } else {
      const moveImpl = (x: number, y: number) => {
        const w = (x - posX) * (reverse ? -1 : 1) + lastX;
        const h = (y - posY) * (reverse ? -1 : 1) + lastY;
        pelem.style.width = w + "px";
        pelem.style.height = h + "px";
        props.resizing?.({ width: w, height: h });
      };
      cursor = "nwse-resize";
      if (isTouch) {
        move = ((e: TouchEvent) => moveImpl(e.touches[0].clientX, e.touches[0].clientY)) as VoidFunc;
      } else {
        move = ((e: MouseEvent) => moveImpl(e.clientX, e.clientY)) as VoidFunc;
      }
    }
    const endImpl = () => {
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
        props.resized?.(ctx);
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
        props.resized?.(ctx);
      };
      window.addEventListener("mouseup", end);
      window.addEventListener("mousemove", move);
    }
  };

  if (props.direction == null || props.disabled) return <></>;
  return (
    <div
      className={`${Style.main} ${Style[props.direction]}${props.className ? ` ${props.className}` : ""}`}
      onMouseDown={e => resizeStart(e.currentTarget, e.clientX, e.clientY)}
      onTouchStart={e => resizeStart(e.currentTarget, e.touches[0].clientX, e.touches[0].clientY, true)}
      onClick={e => e.stopPropagation()}
    />
  );
};

export default Resizer;