import { convertSizeNumToStr } from "@/utilities/attributes";
import { MutableRefObject, useEffect, useRef } from "react";

type Props = {
  disabled?: boolean;
  open: boolean;
  elementRef: MutableRefObject<HTMLElement>;
  direction?: "vertical" | "horizontal";
  max?: string | number;
  min?: string | number;
  minVisible?: boolean;
  changeOpacity?: boolean;
  animationTime?: number;
  animationInterval?: number;
  onToggle?: (open: boolean) => void;
  onToggled?: (open: boolean) => void;
  onToggling?: (context: {
    size: number;
    opacity: number;
    open: boolean;
  }) => void;
  destructor?: (open: boolean) => void;
};

const defaultAnimationTime = 150;
const defaultAnimationInterval = 10;

const useAccordionEffect = (props: Props, deps: Array<any> = []) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (props.disabled) return;
    if (props.elementRef.current == null) return;
    let alive = true;
    const aTime = props.animationTime ?? defaultAnimationTime;
    const aInterval = props.animationInterval ?? defaultAnimationInterval;
    const aDirection = props.direction || "vertical";
    const defaultMin = "0";
    const changeOpacity = props.changeOpacity === true;

    if (props.open) {
      const end = () => {
        if (!props.elementRef.current) return;
        props.elementRef.current.style.removeProperty("overflow");
        props.elementRef.current.style.removeProperty("opacity");
        if (aDirection === "horizontal") {
          props.elementRef.current.style.width = convertSizeNumToStr(props.max);
          props.elementRef.current.style.overflowX = "hidden";
        } else {
          props.elementRef.current.style.height = convertSizeNumToStr(props.max);
          props.elementRef.current.style.overflowY = "hidden";
        }
        setTimeout(() => {
          if (!props.elementRef.current) return;
          props.elementRef.current.style.removeProperty("overflow-x");
          props.elementRef.current.style.removeProperty("overflow-y");
        }, aInterval * 2);
        props.onToggled?.(props.open);
      };
      props.onToggle?.(props.open);
      props.elementRef.current.style.removeProperty("display");
      if (changeOpacity) {
        props.elementRef.current.style.opacity = "0";
      }
      props.elementRef.current.style.visibility = "unset";
      if (aDirection === "horizontal") {
        props.elementRef.current.style.width = convertSizeNumToStr(props.max);
      } else {
        props.elementRef.current.style.height = convertSizeNumToStr(props.max);
      }

      const max = aDirection === "horizontal" ?
        props.elementRef.current.offsetWidth :
        props.elementRef.current.offsetHeight;
      const step = Math.max(1, Math.round(max / (aTime / aInterval)));
      const oStep = 2 / (aTime / aInterval);

      props.elementRef.current.style.overflow = "hidden";
      if (aDirection === "horizontal") {
        props.elementRef.current.style.width = convertSizeNumToStr(props.min, defaultMin);
      } else {
        props.elementRef.current.style.height = convertSizeNumToStr(props.min, defaultMin);
      }

      let size = aDirection === "horizontal" ?
        props.elementRef.current.offsetWidth :
        props.elementRef.current.offsetHeight;
      let opacity = 0;
      const func = () => {
        setTimeout(() => {
          if (!alive) {
            end();
            return;
          }
          size += step;
          if (size > max) {
            end();
            return;
          }
          if (aDirection === "horizontal") {
            props.elementRef.current.style.width = `${size}px`;
          } else {
            props.elementRef.current.style.height = `${size}px`;
          }
          opacity = Math.min(1, opacity + oStep);
          if (changeOpacity) {
            props.elementRef.current.style.opacity = String(opacity);
          }
          props.onToggling?.({
            open: props.open,
            size,
            opacity,
          });
          func();
        }, aInterval);
      };
      func();
    } else {
      const end = () => {
        if (!props.elementRef.current) return;
        if (props.minVisible !== true) {
          props.elementRef.current.style.display = "none";
          props.elementRef.current.style.removeProperty("visibility");
        }
        props.elementRef.current.style.overflow = "hidden";
        if (changeOpacity) {
          props.elementRef.current.style.opacity = "0";
        }
        if (aDirection === "horizontal") {
          props.elementRef.current.style.width = convertSizeNumToStr(props.min, defaultMin);
        } else {
          props.elementRef.current.style.height = convertSizeNumToStr(props.min, defaultMin);
        }
        props.onToggled?.(props.open);
      };
      if (!initialized.current) {
        end();
        initialized.current = true;
        return;
      }
      props.onToggle?.(props.open);
      props.elementRef.current.style.removeProperty("display");
      props.elementRef.current.style.visibility = "unset";
      props.elementRef.current.style.overflow = "hidden";
      props.elementRef.current.style.opacity = "1";

      const max = aDirection === "horizontal" ?
        props.elementRef.current.offsetWidth :
        props.elementRef.current.offsetHeight;
      const step = Math.max(1, Math.round(max / (aTime / aInterval)));
      const oStep = 2 / (aTime / aInterval);
      let count = 0;
      const opacityStartCount = aTime / aInterval / 2;

      let current = "", min = 0;
      if (aDirection === "horizontal") {
        current = props.elementRef.current.style.width;
        props.elementRef.current.style.width = convertSizeNumToStr(props.min, defaultMin);
        min = props.elementRef.current.offsetWidth;
        props.elementRef.current.style.width = current;
      } else {
        current = props.elementRef.current.style.height;
        props.elementRef.current.style.height = convertSizeNumToStr(props.min, defaultMin);
        min = props.elementRef.current.offsetHeight;
        props.elementRef.current.style.height = current;
      }

      let size = max, opacity = 1;
      const func = () => {
        setTimeout(() => {
          if (!alive) {
            end();
            return;
          }
          size -= step;
          if (size < min) {
            end();
            return;
          }
          if (aDirection === "horizontal") {
            props.elementRef.current.style.width = `${size}px`;
          } else {
            props.elementRef.current.style.height = `${size}px`;
          }
          if (count++ > opacityStartCount) {
            opacity = Math.max(0, opacity - oStep);
          }
          if (changeOpacity) {
            props.elementRef.current.style.opacity = String(opacity);
          }
          props.onToggling?.({
            open: props.open,
            size,
            opacity,
          });
          func();
        }, aInterval);
      };
      func();
    }

    return () => {
      alive = false;
      props.destructor?.(props.open);
    };
  }, [props.open, ...deps]);
};

export default useAccordionEffect;