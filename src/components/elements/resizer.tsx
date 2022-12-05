import { CSSProperties, FC } from "react";
import Style from "$/components/elements/resizer.module.scss";
import { convertSizeNumToStr, releaseCursor, setCursor } from "@/utilities/attributes";

export type ResizerProps = {
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  direction?: "x" | "y" | "xy";
  reverse?: boolean;
  resizing?: () => void;
  resized?: () => void;
} & Struct;

const Resizer: FC<ResizerProps> = (props) => {
  const resizeStart = (elem: HTMLDivElement, cx: number, cy: number, isTouch?: boolean) => {
    if (props.direction == null) return;
    const pelem = elem.parentElement;
    if (pelem == null) return;
    const prect = pelem.getBoundingClientRect();
    const reverse = props.reverse === true;
    let posX = cx, posY = cy, lastX = prect.width, lastY = prect.height, cursor = "";
    let move: VoidFunc;
    if (props.direction === "x") {
      const moveImpl = (x: number) => {
        pelem.style.width = convertSizeNumToStr((x - posX) * (reverse ? -1 : 1) + lastX)!;
        props.resizing?.();
      };
      cursor = "col-resize";
      if (isTouch) {
        move = ((e: TouchEvent) => moveImpl(e.touches[0].clientX)) as VoidFunc;
      } else {
        move = ((e: MouseEvent) => moveImpl(e.clientX)) as VoidFunc;
      }
    } else if (props.direction === "y") {
      const moveImpl = (y: number) => {
        pelem.style.height = convertSizeNumToStr((y - posY) * (reverse ? -1 : 1) + lastY)!;
        props.resizing?.();
      };
      cursor = "row-resize";
      if (isTouch) {
        move = ((e: TouchEvent) => moveImpl(e.touches[0].clientY)) as VoidFunc;
      } else {
        move = ((e: MouseEvent) => moveImpl(e.clientY)) as VoidFunc;
      }
    } else {
      const moveImpl = (x: number, y: number) => {
        pelem.style.width = convertSizeNumToStr((x - posX) * (reverse ? -1 : 1) + lastX)!;
        pelem.style.height = convertSizeNumToStr((y - posY) * (reverse ? -1 : 1) + lastY)!;
        props.resizing?.();
      };
      cursor = "nwse-resize";
      if (isTouch) {
        move = ((e: TouchEvent) => moveImpl(e.touches[0].clientX, e.touches[0].clientY)) as VoidFunc;
      } else {
        move = ((e: MouseEvent) => moveImpl(e.clientX, e.clientY)) as VoidFunc;
      }
    }
    if (isTouch) {
      const end = () => {
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", end);
        props.resized?.();
      };
      window.addEventListener("touchend", end);
      window.addEventListener("touchmove", move);
    } else {
      setCursor(cursor);
      const end = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", end);
        releaseCursor();
        props.resized?.();
      };
      window.addEventListener("mouseup", end);
      window.addEventListener("mousemove", move);
    }
  };

  if (props.direction == null || props.disabled) return <></>;
  return (
    <div
      className={`${Style.main} ${Style[props.direction]}`}
      onMouseDown={e => resizeStart(e.currentTarget, e.clientX, e.clientY)}
      onTouchStart={e => resizeStart(e.currentTarget, e.touches[0].clientX, e.touches[0].clientY, true)}
    />
  );
};

export default Resizer;