"use client";

import strJoin from "#/objects/string/join";
import { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState, type ForwardedRef, type HTMLAttributes, type MutableRefObject } from "react";
import { createPortal } from "react-dom";
import usePortalElement from "../../hooks/portal-element";
import useToggleAnimation from "../../hooks/toggle-animation";
import { convertSizeNumToStr } from "../../utilities/attributes";
import { dialogDown, dialogUp } from "../../utilities/top-layer";
import Style from "./index.module.scss";

type PopupContextProps = {
  isPopup?: boolean;
  showed: boolean;
  resetPosition: () => void;
};

const PopupContext = createContext<PopupContextProps>({
  isPopup: false,
  showed: true,
  resetPosition: () => { },
});

export const usePopup = () => {
  return useContext(PopupContext);
};

const defaultAnimationDuration = 150;
const defaultAnimationInterval = 10;

export type PopupPosition = {
  x?: "inner" | "outer" | "center" | "inner-left" | "inner-right" | "outer-left" | "outer-right";
  y?: "inner" | "outer" | "center" | "inner-top" | "inner-bottom" | "outer-top" | "outer-bottom";
  absolute?: boolean;
  marginX?: number;
  marginY?: number;
};

type PopupOptions = {
  $show?: boolean;
  $mask?: boolean | "transparent";
  $anchor?: MutableRefObject<HTMLElement> | { pageX: number, pageY: number } | "parent";
  $position?: PopupPosition;
  $animationDirection?: "vertical" | "horizontal" | "none";
  $animationDuration?: number;
  $animationInterval?: number;
  $preventClickEvent?: boolean;
  $preventUnmount?: boolean;
  $closeWhenClick?: boolean;
  $zIndex?: number;
  $preventElevatation?: boolean;
  $onToggle?: (show: boolean) => void;
  $onToggled?: (show: boolean) => void;
  $destructor?: (open: boolean) => void;
  $preventFocus?: boolean;
};

export type PopupProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, PopupOptions>;

const baseZIndex = 10000000;

const Popup = forwardRef<HTMLDivElement, PopupProps>((props, $ref) => {
  const [init, setInit] = useState(props.$show);

  useEffect(() => {
    if (props.$show) setInit(true);
  }, [props.$show]);

  if (!init) return null!;
  return <Impl {...props} $ref={$ref} />;
});

const Impl = ({
  className,
  $show,
  $mask,
  $anchor,
  $position,
  $animationDirection,
  $animationDuration,
  $animationInterval,
  $preventClickEvent,
  $preventUnmount,
  $closeWhenClick,
  $zIndex,
  $preventElevatation,
  $preventFocus,
  $onToggle,
  $onToggled,
  $destructor,
  children,
  ...props
}: PopupProps & { $ref: ForwardedRef<HTMLDivElement> }) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle(props.$ref, () => ref.current);
  const aref = useRef<HTMLDivElement>(null!);
  const mref = useRef<HTMLDivElement>(null!);
  const zIndex = useRef<number>(0);
  const updateZIndex = useRef(() => { });
  const removeZIndex = useRef(() => { });
  const portal = usePortalElement({
    mount: (elem) => {
      const z = $zIndex ?? baseZIndex;
      elem.classList.add("popup-root");
      elem.setAttribute("data-z", String(z));
      updateZIndex.current = () => {
        let max = z;
        document.querySelectorAll(`.popup-root[data-z="${z}"]`).forEach(rootElem => {
          if (rootElem === elem) return;
          max = Math.max(max, Number((rootElem as HTMLElement).style.zIndex ?? 0));
        });
        elem.style.zIndex = String(zIndex.current = max + 1);
      };
      removeZIndex.current = () => {
        zIndex.current = 0;
        elem.style.removeProperty("z-index");
      };
    },
  });

  const showedRef = useRef(false);
  const [showed, setShowed] = useState(showedRef.current);
  const [mount, setMount] = useState(showed);

  const click = (e: React.MouseEvent<HTMLDivElement>) => {
    if ($preventClickEvent) e.stopPropagation();
    updateZIndex.current();
    props.onClick?.(e);
  };

  const keydownMask1 = (e: React.KeyboardEvent) => {
    if (e.shiftKey && e.key === "Tab") e.preventDefault();
  };

  const keydownMask2 = (e: React.KeyboardEvent) => {
    if (!e.shiftKey && e.key === "Tab") e.preventDefault();
  };

  useEffect(() => {
    const show = $show === true;
    if (show) setMount(true);
    setShowed(show);
  }, [$show]);

  const resetPosition = () => {
    const winH = window.innerHeight;
    const winW = window.innerWidth;
    const hMax = ref.current.offsetHeight;
    const wMax = ref.current.offsetWidth;
    let posX = $position?.x || "center";
    let posY = $position?.y || "center";
    const posAbs = $position?.absolute === true;
    const marginX = $position?.marginX ?? 0;
    const marginY = $position?.marginY ?? 0;
    let rect = {
      top: 0, bottom: 0, left: 0, right: 0,
      width: winW, height: winH,
    };
    if ($anchor == null) {
      if (posX.startsWith("outer")) posX = "center";
      if (posY.startsWith("outer")) posY = "center";
    } else if ($anchor === "parent") {
      const anchor = aref.current?.parentElement as HTMLElement;
      rect = anchor.getBoundingClientRect();
    } else if ("current" in $anchor) {
      const anchor = $anchor.current;
      if (anchor == null) {
        if (posX.startsWith("outer")) posX = "center";
        if (posY.startsWith("outer")) posY = "center";
      } else {
        rect = anchor.getBoundingClientRect();
      }
    } else {
      const anchor = $anchor;
      rect.top = rect.bottom = anchor.pageY;
      rect.left = rect.right = anchor.pageX;
    }
    if (marginX) {
      rect.width += marginX * 2;
      rect.left -= marginX;
      rect.right += marginX;
    }
    if (marginY) {
      rect.height += marginY * 2;
      rect.top -= marginY;
      rect.bottom += marginY;
    }

    const scrollLeft = 0;
    switch (posX) {
      case "center":
        ref.current.style.removeProperty("right");
        ref.current.style.left = convertSizeNumToStr(posAbs ?
          rect.left + rect.width / 2 - wMax / 2 + scrollLeft :
          Math.min(Math.max(0, rect.left + rect.width / 2 - wMax / 2 + scrollLeft), winW - ref.current.offsetWidth + scrollLeft)
        )!;
        break;
      case "inner":
        if (winW - rect.left < wMax && rect.left > winW - rect.right) {
          ref.current.style.removeProperty("left");
          ref.current.style.right = convertSizeNumToStr(winW - rect.right)!;
        } else {
          ref.current.style.removeProperty("right");
          ref.current.style.left = convertSizeNumToStr(rect.left)!;
        }
        break;
      case "inner-left":
        ref.current.style.removeProperty("right");
        ref.current.style.left = convertSizeNumToStr(posAbs ?
          rect.left :
          Math.min(rect.left, winW - ref.current.offsetWidth)
        )!;
        break;
      case "inner-right":
        ref.current.style.removeProperty("left");
        ref.current.style.right = convertSizeNumToStr(posAbs ?
          winW - rect.right :
          Math.min(winW - rect.right, winW - ref.current.offsetWidth)
        )!;
        break;
      case "outer":
        if (winW - rect.right < wMax && rect.left > winW - rect.right) {
          ref.current.style.removeProperty("left");
          ref.current.style.right = convertSizeNumToStr(winW - rect.left)!;
        } else {
          ref.current.style.removeProperty("right");
          ref.current.style.left = convertSizeNumToStr(rect.right)!;
        }
        break;
      case "outer-left":
        ref.current.style.removeProperty("left");
        ref.current.style.right = convertSizeNumToStr(posAbs ?
          winW - rect.left :
          Math.min(winW - rect.left, winW - ref.current.offsetWidth)
        )!;
        break;
      case "outer-right":
        ref.current.style.removeProperty("right");
        ref.current.style.left = convertSizeNumToStr(posAbs ?
          rect.right :
          Math.min(rect.right, winW - ref.current.offsetWidth)
        )!;
        break;
      default: break;
    }

    const scrollTop = 0;
    switch (posY) {
      case "center":
        ref.current.style.removeProperty("bottom");
        ref.current.style.top = convertSizeNumToStr(posAbs ?
          rect.top + rect.height / 2 - hMax / 2 + scrollTop :
          Math.min(Math.max(0, rect.top + rect.height / 2 - hMax / 2 + scrollTop), winH - ref.current.offsetHeight + scrollTop)
        )!;
        break;
      case "inner":
        if (winH - rect.top < hMax && rect.top > winH - rect.bottom) {
          ref.current.style.removeProperty("top");
          ref.current.style.bottom = convertSizeNumToStr(winH - rect.bottom)!;
        } else {
          ref.current.style.removeProperty("bottom");
          ref.current.style.top = convertSizeNumToStr(rect.top)!;
        }
        break;
      case "inner-top":
        ref.current.style.removeProperty("bottom");
        ref.current.style.top = convertSizeNumToStr(posAbs ?
          rect.top :
          Math.min(rect.top, winH - ref.current.offsetHeight)
        )!;
        break;
      case "inner-bottom":
        ref.current.style.removeProperty("top");
        ref.current.style.bottom = convertSizeNumToStr(posAbs ?
          winH - rect.bottom :
          Math.min(winH - rect.bottom, winH - ref.current.offsetHeight)
        )!;
        break;
      case "outer":
        if (winH - rect.bottom < hMax && rect.top > winH - rect.bottom) {
          ref.current.style.removeProperty("top");
          ref.current.style.bottom = convertSizeNumToStr(winH - rect.top)!;
        } else {
          ref.current.style.removeProperty("bottom");
          ref.current.style.top = convertSizeNumToStr(rect.bottom)!;
        }
        break;
      case "outer-top":
        ref.current.style.removeProperty("top");
        ref.current.style.bottom = convertSizeNumToStr(posAbs ?
          winH - rect.top :
          Math.min(winH - rect.top, winH - ref.current.offsetHeight)
        )!;
        break;
      case "outer-bottom":
        ref.current.style.removeProperty("bottom");
        ref.current.style.top = convertSizeNumToStr(posAbs ?
          rect.bottom :
          Math.min(rect.bottom, winH - ref.current.offsetHeight)
        )!;
        break;
      default: break;
    }
  };

  const toggleAnimationInitStyle = useToggleAnimation({
    elementRef: ref,
    open: showed,
    changeOpacity: true,
    closeOpacityDelay: $animationDirection === "horizontal" || $animationDirection === "vertical",
    animationInterval: $animationInterval ?? defaultAnimationInterval,
    animationDuration: $animationDuration ?? defaultAnimationDuration,
    style: props.style,
    direction: $animationDirection,
    onToggle: (open) => {
      const closeListener = (e: MouseEvent) => {
        let elem = e.target as HTMLElement;
        while (elem != null) {
          if (ref.current === elem) break;
          if (elem.classList.contains("popup-root")) {
            const z = Number(elem.style.zIndex ?? 0);
            if (z > zIndex.current) break;
          }
          elem = elem.parentElement as HTMLElement;
        }
        if (elem == null) {
          setShowed(false);
        }
      };
      let resizeTimeout: NodeJS.Timeout | null = null;
      const resizeListener = () => {
        if (resizeTimeout) return;
        resizeTimeout = setTimeout(() => {
          resetPosition();
          resizeTimeout = null;
        }, 40);
      };

      if (open) {
        showedRef.current = true;
        if ($mask) dialogUp();
        updateZIndex.current();
        if (mref.current) {
          mref.current.style.removeProperty("display");
          mref.current.style.opacity = "0";
        }
        resetPosition();
        if ($closeWhenClick) {
          window.addEventListener("click", closeListener, true);
        }
        window.addEventListener("resize", resizeListener, true);
      } else {
        if (mref.current) {
          mref.current.style.removeProperty("display");
          mref.current.style.opacity = "1";
        }
        if ($mask) dialogDown();
      }
      $onToggle?.(open);

      return {
        closeListener,
        resizeListener,
      };
    },
    onToggling: (ctx) => {
      if (mref.current) mref.current.style.opacity = String(ctx.opacity);
    },
    onToggled: (open) => {
      if (open) {
        if (mref.current) {
          mref.current.style.opacity = "1";
        }
        if ($mask && !$preventFocus) {
          (document.activeElement as HTMLElement)?.blur?.();
          (ref.current.querySelector(`a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])`) as HTMLElement)?.focus?.();
        }
      } else {
        removeZIndex.current();
        if ($preventUnmount !== true) setMount(false);
        if (mref.current) {
          mref.current.style.opacity = "0";
          mref.current.style.display = "none";
        }
      }
      $onToggled?.(open);
    },
    destructor: (open, params) => {
      if (params.closeListener != null) {
        window.removeEventListener("click", params.closeListener, true);
      }
      if (params.resizeListener != null) {
        window.removeEventListener("resize", params.resizeListener, true);
      }
      $destructor?.(open);
    },
  });

  if (!showedRef.current && !showed) return <></>;
  if (portal == null) return <></>;
  return (
    <>
      {$anchor === "parent" &&
        <div className={Style.anchor} ref={aref} />
      }
      {createPortal(
        <PopupContext.Provider
          value={{
            isPopup: true,
            showed,
            resetPosition,
          }}
        >
          {$mask &&
            <div
              ref={mref}
              className={Style.mask1}
              tabIndex={0}
              onKeyDown={keydownMask1}
              data-mode={$mask}
              style={{ display: "none" }}
            />
          }
          <div
            {...props}
            ref={ref}
            className={strJoin(" ", Style.main, className)}
            style={toggleAnimationInitStyle}
            data-show={$show}
            data-showed={showed}
            data-elevatation={!$preventElevatation}
            onClick={click}
          >
            {mount && children}
          </div>
          {$mask && showed &&
            <div
              className={Style.mask2}
              tabIndex={0}
              onKeyDown={keydownMask2}
            />
          }
        </PopupContext.Provider>
        , portal
      )}
    </>
  );
};

export default Popup;