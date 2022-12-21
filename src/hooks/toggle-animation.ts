import { convertSizeNumToStr } from "@/components/utilities/attributes";
import NumberUtils from "@bizhermit/basic-utils/dist/number-utils";
import { CSSProperties, MutableRefObject, useEffect, useMemo, useRef } from "react";

type Props<T extends Struct = {}> = {
  disabled?: boolean;
  open: boolean;
  elementRef: MutableRefObject<HTMLElement>;
  direction?: "vertical" | "horizontal" | "none";
  max?: string | number;
  min?: string | number;
  style?: CSSProperties;
  minVisible?: boolean;
  changeOpacity?: boolean;
  closeOpacityDelay?: boolean;
  animationTime?: number;
  animationInterval?: number;
  onToggle?: (open: boolean) => (T | void);
  onToggled?: (open: boolean, params: T) => void;
  onToggling?: (context: {
    size: number;
    opacity: number;
    open: boolean;
  }, params: T) => void;
  destructor?: (open: boolean, params: T) => void;
};

const defaultAnimationTime = 150;
const defaultAnimationInterval = 10;

const useToggleAnimation = <T extends Struct = {}>(props: Props<T>, deps: Array<any> = []) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (props.disabled || props.elementRef.current == null) {
      initialized.current = true;
      return;
    }
    let alive = true;
    const aTime = props.animationTime ?? defaultAnimationTime;
    const aInterval = props.animationInterval ?? defaultAnimationInterval;
    const aDirection = props.direction || "none";
    const defaultMin = "0";
    const changeOpacity = props.changeOpacity === true || aDirection === "none";
    let params: T = {} as T;

    if (props.open) {
      const end = () => {
        if (props.elementRef.current) {
          props.elementRef.current.style.removeProperty("overflow");
          props.elementRef.current.style.removeProperty("opacity");
          props.elementRef.current.style.removeProperty("display");
          switch (aDirection) {
            case "horizontal":
              props.elementRef.current.style.width = convertSizeNumToStr(props.style?.width ?? props.max, "")!;
              props.elementRef.current.style.overflowX = "hidden";
              break;
            case "vertical":
              props.elementRef.current.style.height = convertSizeNumToStr(props.style?.height ?? props.max, "")!;
              props.elementRef.current.style.overflowY = "hidden";
              break;
            default:
              props.elementRef.current.style.width = convertSizeNumToStr(props.style?.width ?? props.max, "")!;
              props.elementRef.current.style.overflowX = "hidden";
              props.elementRef.current.style.height = convertSizeNumToStr(props.style?.height ?? props.max, "")!;
              props.elementRef.current.style.overflowY = "hidden";
              break;
          }
          props.elementRef.current.style.removeProperty("overflow-x");
          props.elementRef.current.style.removeProperty("overflow-y");
        }
        props.onToggled?.(props.open, params);
      };
      props.elementRef.current.style.removeProperty("display");
      if (changeOpacity) {
        props.elementRef.current.style.opacity = "0";
      }
      props.elementRef.current.style.visibility = "unset";
      switch (aDirection) {
        case "horizontal":
          props.elementRef.current.style.width = convertSizeNumToStr(props.style?.width ?? props.max, "")!;
          props.elementRef.current.style.height = convertSizeNumToStr(props.style?.height, "")!;
          break;
        case "vertical":
          props.elementRef.current.style.height = convertSizeNumToStr(props.style?.height ?? props.max, "")!;
          props.elementRef.current.style.width = convertSizeNumToStr(props.style?.width, "")!;
          break;
        default:
          props.elementRef.current.style.width = convertSizeNumToStr(props.style?.width, "")!;
          props.elementRef.current.style.height = convertSizeNumToStr(props.style?.height, "")!;
          break;
      }

      if (!initialized.current) {
        end();
        initialized.current = true;
        return;
      }

      const count = Math.round(aTime / aInterval);
      const oMax = 100;
      const oStep = Math.max(1, Math.round(oMax / count));
      let oCount = 0;
      try {
        oCount = Number(getComputedStyle(props.elementRef.current).opacity || "0");
      } catch {
        oCount = 0;
      }

      let sMax = oMax;
      let sStep = oStep;
      switch (aDirection) {
        case "horizontal":
          sMax = props.elementRef.current.offsetWidth;
          sStep = Math.max(1, Math.round(sMax / count));
          break;
        case "vertical":
          sMax = props.elementRef.current.offsetHeight;
          sStep = Math.max(1, Math.round(sMax / count));
          break;
        default:
          break;
      }

      params = (props.onToggle?.(props.open) ?? {}) as T;

      props.elementRef.current.style.overflow = "hidden";
      switch (aDirection) {
        case "horizontal":
          props.elementRef.current.style.width = convertSizeNumToStr(props.min, defaultMin)!;
          break;
        case "vertical":
          props.elementRef.current.style.height = convertSizeNumToStr(props.min, defaultMin)!;
          break;
        default:
          break;
      }

      let sCount = oCount;
      switch (aDirection) {
        case "horizontal":
          sCount = props.elementRef.current.offsetWidth;
          break;
        case "vertical":
          sCount = props.elementRef.current.offsetHeight;
          break;
        default:
          break;
      }
      const func = () => {
        setTimeout(() => {
          if (!alive) {
            end();
            return;
          }
          sCount += sStep;
          oCount += oStep;
          switch (aDirection) {
            case "horizontal":
              props.elementRef.current.style.width = sCount + "px";
              if (sCount > sMax) {
                end();
                return;
              }
              break;
            case "vertical":
              props.elementRef.current.style.height = sCount + "px";
              if (sCount > sMax) {
                end();
                return;
              }
              break;
            default:
              if (oCount > oMax) {
                end();
                return;
              }
              break;
          }
          const opacity = Math.min(1, NumberUtils.round(oCount / 100, 2));
          if (changeOpacity) {
            props.elementRef.current.style.opacity = String(opacity);
          }
          props.onToggling?.({
            open: props.open,
            size: sCount,
            opacity,
          }, params);
          func();
        }, aInterval);
      };
      func();
    } else {
      const end = () => {
        if (props.elementRef.current) {
          if (props.minVisible !== true) {
            props.elementRef.current.style.display = "none";
            props.elementRef.current.style.removeProperty("visibility");
          }
          props.elementRef.current.style.overflow = "hidden";
          if (changeOpacity) {
            props.elementRef.current.style.opacity = "0";
          }
          switch (aDirection) {
            case "horizontal":
              props.elementRef.current.style.width = convertSizeNumToStr(props.min, defaultMin)!;
              break;
            case "vertical":
              props.elementRef.current.style.height = convertSizeNumToStr(props.min, defaultMin)!;
              break;
            default:
              break;
          }
        }
        props.onToggled?.(props.open, params);
      };
      if (!initialized.current) {
        end();
        initialized.current = true;
        return;
      }
      props.elementRef.current.style.removeProperty("display");
      props.elementRef.current.style.visibility = "unset";
      props.elementRef.current.style.overflow = "hidden";
      props.elementRef.current.style.opacity = "1";

      const count = Math.round(aTime / aInterval);
      let opacityCount = 0;
      const opacityStartCount = props.closeOpacityDelay ? Math.max(1, Math.round(count / 2)) : 0;
      const oMax = 100;
      const oStep = Math.max(1, Math.round(oMax / count - opacityCount));
      let oCount = oMax;
      try {
        oCount = Number(getComputedStyle(props.elementRef.current).opacity || "1") * 100;
      } catch {
        oCount = 100;
      }

      let sCount = oCount;
      let sStep = oStep;
      switch (aDirection) {
        case "horizontal":
          sCount = props.elementRef.current.offsetWidth;
          sStep = Math.max(1, Math.round(sCount / count));
          break;
        case "vertical":
          sCount = props.elementRef.current.offsetHeight;
          sStep = Math.max(1, Math.round(sCount / count));
          break;
        default:
          break;
      }

      let sMin = 0;
      let current = "";
      switch (aDirection) {
        case "horizontal":
          current = props.elementRef.current.style.width;
          props.elementRef.current.style.width = convertSizeNumToStr(props.min, defaultMin)!;
          sMin = props.elementRef.current.offsetWidth;
          props.elementRef.current.style.width = current;
          break;
        case "vertical":
          current = props.elementRef.current.style.height;
          props.elementRef.current.style.height = convertSizeNumToStr(props.min, defaultMin)!;
          sMin = props.elementRef.current.offsetHeight;
          props.elementRef.current.style.height = current;
          break;
        default:
          break;
      }

      params = (props.onToggle?.(props.open) ?? {}) as T;

      const func = () => {
        setTimeout(() => {
          if (!alive) {
            end();
            return;
          }
          sCount -= sStep;
          if (opacityCount++ > opacityStartCount) {
            oCount -= oStep;
          }
          switch (aDirection) {
            case "horizontal":
              props.elementRef.current.style.width = sCount + "px";
              if (sCount < sMin) {
                end();
                return;
              }
              break;
            case "vertical":
              props.elementRef.current.style.height = sCount + "px";
              if (sCount < sMin) {
                end();
                return;
              }
              break;
            default:
              if (oCount < 0) {
                end();
                return;
              }
              break;
          }
          const opacity = Math.min(1, NumberUtils.round(oCount / 100, 2));
          if (changeOpacity) {
            props.elementRef.current.style.opacity = String(opacity);
          }
          props.onToggling?.({
            open: props.open,
            size: sCount,
            opacity,
          }, params);
          func();
        }, aInterval);
      };
      func();
    }

    return () => {
      alive = false;
      props.destructor?.(props.open, params);
    };
  }, [props.open, ...deps]);

  return useMemo<CSSProperties>(() => {
    const aDirection = props.direction || "none";
    const defaultMin = "0";
    const changeOpacity = props.changeOpacity === true || aDirection === "none";

    const ret: CSSProperties = {...props.style};
    if (!props.open) {
      if (props.minVisible !== true) {
        ret.display = "none";
      }
      ret.overflow = "hidden";
      if (changeOpacity) {
        ret.opacity = 0;
      }
      switch (aDirection) {
        case "horizontal":
          ret.width = convertSizeNumToStr(props.min, defaultMin);
          break;
        case "vertical":
          ret.height = convertSizeNumToStr(props.min, defaultMin);
          break;
        default:
          break;
      }
    }
    return ret;
  }, []);
};

export default useToggleAnimation;