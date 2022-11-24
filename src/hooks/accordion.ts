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
    const changeOpacity = props.changeOpacity == null ?
      props.minVisible !== true :
      props.changeOpacity !== false;

    if (props.open) {
      const end = () => {
        if (!props.elementRef.current) return;
        if (aDirection === "horizontal") {
          props.elementRef.current.style.width = convertSizeNumToStr(props.max);
        } else {
          props.elementRef.current.style.height = convertSizeNumToStr(props.max);
        }
        if (alive) props.elementRef.current.style.removeProperty("overflow");
        props.elementRef.current.style.removeProperty("opacity");
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

      let s = aDirection === "horizontal" ?
        props.elementRef.current.offsetWidth :
        props.elementRef.current.offsetHeight;
      let o = 0;
      const func = () => {
        setTimeout(() => {
          if (!alive) {
            end();
            return;
          }
          s += step;
          if (s > max) {
            end();
            return;
          }
          if (aDirection === "horizontal") {
            props.elementRef.current.style.width = `${s}px`;
          } else {
            props.elementRef.current.style.height = `${s}px`;
          }
          o = Math.min(1, o + oStep);
          if (changeOpacity) {
            props.elementRef.current.style.opacity = String(o);
          }
          props.onToggling?.({
            open: props.open,
            size: s,
            opacity: o,
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
          props.elementRef.current.style.overflow = "hidden";
          if (changeOpacity) {
            props.elementRef.current.style.opacity = "0";
          }
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

      let s = max, o = 1;
      const func = () => {
        setTimeout(() => {
          if (!alive) {
            end();
            return;
          }
          s -= step;
          if (s < min) {
            end();
            return;
          }
          if (aDirection === "horizontal") {
            props.elementRef.current.style.width = `${s}px`;
          } else {
            props.elementRef.current.style.height = `${s}px`;
          }
          if (count++ > opacityStartCount) {
            o = Math.max(0, o - oStep);
          }
          if (changeOpacity) {
            props.elementRef.current.style.opacity = String(o);
          }
          props.onToggling?.({
            open: props.open,
            size: s,
            opacity: o,
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