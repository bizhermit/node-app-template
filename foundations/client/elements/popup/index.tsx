"use client";

import { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState, type ForwardedRef, type HTMLAttributes, type MutableRefObject } from "react";
import { createPortal } from "react-dom";
import usePortalElement from "../../hooks/portal-element";
import useToggleAnimation from "../../hooks/toggle-animation";
import { attributesWithoutChildren, convertSizeNumToStr } from "../../utilities/attributes";
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

export type PopupProps = HTMLAttributes<HTMLDivElement> & {
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
  $elevatation?: boolean;
  $onToggle?: (show: boolean) => void;
  $onToggled?: (show: boolean) => void;
  $destructor?: (open: boolean) => void;
};

const baseZIndex = 10000000;

const Popup = forwardRef<HTMLDivElement, PopupProps>((props, $ref) => {
  const [init, setInit] = useState(props.$show);

  useEffect(() => {
    if (props.$show) setInit(true);
  }, [props.$show]);

  if (!init) return null!;
  return <Impl {...props} $ref={$ref} />;
});

const Impl = (props: PopupProps & { $ref: ForwardedRef<HTMLDivElement> }) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle(props.$ref, () => ref.current);
  const aref = useRef<HTMLDivElement>(null!);
  const mref = useRef<HTMLDivElement>(null!);
  const zIndex = useRef<number>(0);
  const updateZIndex = useRef(() => { });
  const removeZIndex = useRef(() => { });
  const portal = usePortalElement({
    mount: (elem) => {
      const z = props.$zIndex ?? baseZIndex;
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
    if (props.$preventClickEvent) {
      e.stopPropagation();
    }
    updateZIndex.current();
  };

  const keydownMask1 = (e: React.KeyboardEvent) => {
    if (e.shiftKey && e.key === "Tab") e.preventDefault();
  };

  const keydownMask2 = (e: React.KeyboardEvent) => {
    if (!e.shiftKey && e.key === "Tab") e.preventDefault();
  };

  useEffect(() => {
    const show = props.$show === true;
    if (show) setMount(true);
    setShowed(show);
  }, [props.$show]);

  const resetPosition = () => {
    const bodyElem = document.body;
    const hMax = ref.current.offsetHeight;
    const wMax = ref.current.offsetWidth;
    let posX = props.$position?.x || "center";
    let posY = props.$position?.y || "center";
    const posAbs = props.$position?.absolute === true;
    const marginX = props.$position?.marginX ?? 0;
    const marginY = props.$position?.marginY ?? 0;
    let rect = {
      top: 0, bottom: 0, left: 0, right: 0,
      width: 0, height: 0,
    };
    if (props.$anchor == null) {
      rect = bodyElem.getBoundingClientRect();
      if (posX.startsWith("outer")) posX = "center";
      if (posY.startsWith("outer")) posY = "center";
    } else if (props.$anchor === "parent") {
      const anchor = aref.current?.parentElement as HTMLElement;
      rect = anchor.getBoundingClientRect();
    } else if ("current" in props.$anchor) {
      const anchor = props.$anchor.current;
      if (anchor == null) {
        rect = bodyElem.getBoundingClientRect();
        if (posX.startsWith("outer")) posX = "center";
        if (posY.startsWith("outer")) posY = "center";
      } else {
        rect = anchor.getBoundingClientRect();
      }
    } else {
      const anchor = props.$anchor;
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

    const scrollLeft = document.documentElement.scrollLeft + bodyElem.scrollLeft;
    switch (posX) {
      case "center":
        ref.current.style.removeProperty("right");
        ref.current.style.left = convertSizeNumToStr(posAbs ?
          rect.left + rect.width / 2 - wMax / 2 + scrollLeft :
          Math.min(Math.max(0, rect.left + rect.width / 2 - wMax / 2 + scrollLeft), bodyElem.clientWidth - ref.current.offsetWidth + scrollLeft)
        )!;
        break;
      case "inner":
        if (bodyElem.clientWidth - rect.left < wMax && rect.left > bodyElem.clientWidth - rect.right) {
          ref.current.style.removeProperty("left");
          ref.current.style.right = convertSizeNumToStr(bodyElem.clientWidth - rect.right)!;
        } else {
          ref.current.style.removeProperty("right");
          ref.current.style.left = convertSizeNumToStr(rect.left)!;
        }
        break;
      case "inner-left":
        ref.current.style.removeProperty("right");
        ref.current.style.left = convertSizeNumToStr(posAbs ?
          rect.left :
          Math.min(rect.left, bodyElem.clientWidth - ref.current.offsetWidth)
        )!;
        break;
      case "inner-right":
        ref.current.style.removeProperty("left");
        ref.current.style.right = convertSizeNumToStr(posAbs ?
          bodyElem.clientWidth - rect.right :
          Math.min(bodyElem.clientWidth - rect.right, bodyElem.clientWidth - ref.current.offsetWidth)
        )!;
        break;
      case "outer":
        if (bodyElem.clientWidth - rect.right < wMax && rect.left > bodyElem.clientWidth - rect.right) {
          ref.current.style.removeProperty("left");
          ref.current.style.right = convertSizeNumToStr(bodyElem.clientWidth - rect.left)!;
        } else {
          ref.current.style.removeProperty("right");
          ref.current.style.left = convertSizeNumToStr(rect.right)!;
        }
        break;
      case "outer-left":
        ref.current.style.removeProperty("left");
        ref.current.style.right = convertSizeNumToStr(posAbs ?
          bodyElem.clientWidth - rect.left :
          Math.min(bodyElem.clientWidth - rect.left, bodyElem.clientWidth - ref.current.offsetWidth)
        )!;
        break;
      case "outer-right":
        ref.current.style.removeProperty("right");
        ref.current.style.left = convertSizeNumToStr(posAbs ?
          rect.right :
          Math.min(rect.right, bodyElem.clientWidth - ref.current.offsetWidth)
        )!;
        break;
      default: break;
    }

    const scrollTop = document.documentElement.scrollTop + bodyElem.scrollTop;
    switch (posY) {
      case "center":
        ref.current.style.removeProperty("bottom");
        ref.current.style.top = convertSizeNumToStr(posAbs ?
          rect.top + rect.height / 2 - hMax / 2 + scrollTop :
          Math.min(Math.max(0, rect.top + rect.height / 2 - hMax / 2 + scrollTop), bodyElem.clientHeight - ref.current.offsetHeight + scrollTop)
        )!;
        break;
      case "inner":
        if (bodyElem.clientHeight - rect.top < hMax && rect.top > bodyElem.clientHeight - rect.bottom) {
          ref.current.style.removeProperty("top");
          ref.current.style.bottom = convertSizeNumToStr(bodyElem.clientHeight - rect.bottom)!;
        } else {
          ref.current.style.removeProperty("bottom");
          ref.current.style.top = convertSizeNumToStr(rect.top)!;
        }
        break;
      case "inner-top":
        ref.current.style.removeProperty("bottom");
        ref.current.style.top = convertSizeNumToStr(posAbs ?
          rect.top :
          Math.min(rect.top, bodyElem.clientHeight - ref.current.offsetHeight)
        )!;
        break;
      case "inner-bottom":
        ref.current.style.removeProperty("top");
        ref.current.style.bottom = convertSizeNumToStr(posAbs ?
          bodyElem.clientHeight - rect.bottom :
          Math.min(bodyElem.clientHeight - rect.bottom, bodyElem.clientHeight - ref.current.offsetHeight)
        )!;
        break;
      case "outer":
        if (bodyElem.clientHeight - rect.bottom < hMax && rect.top > bodyElem.clientHeight - rect.bottom) {
          ref.current.style.removeProperty("top");
          ref.current.style.bottom = convertSizeNumToStr(bodyElem.clientHeight - rect.top)!;
        } else {
          ref.current.style.removeProperty("bottom");
          ref.current.style.top = convertSizeNumToStr(rect.bottom)!;
        }
        break;
      case "outer-top":
        ref.current.style.removeProperty("top");
        ref.current.style.bottom = convertSizeNumToStr(posAbs ?
          bodyElem.clientHeight - rect.top :
          Math.min(bodyElem.clientHeight - rect.top, bodyElem.clientHeight - ref.current.offsetHeight)
        )!;
        break;
      case "outer-bottom":
        ref.current.style.removeProperty("bottom");
        ref.current.style.top = convertSizeNumToStr(posAbs ?
          rect.bottom :
          Math.min(rect.bottom, bodyElem.clientHeight - ref.current.offsetHeight)
        )!;
        break;
      default: break;
    }
  };

  const toggleAnimationInitStyle = useToggleAnimation({
    elementRef: ref,
    open: showed,
    changeOpacity: true,
    closeOpacityDelay: props.$animationDirection === "horizontal" || props.$animationDirection === "vertical",
    animationInterval: props.$animationInterval ?? defaultAnimationInterval,
    animationDuration: props.$animationDuration ?? defaultAnimationDuration,
    style: props.style,
    direction: props.$animationDirection,
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
        updateZIndex.current();
        if (mref.current) {
          mref.current.style.removeProperty("display");
          mref.current.style.opacity = "0";
        }
        resetPosition();
        if (props.$closeWhenClick) {
          window.addEventListener("click", closeListener, true);
        }
        window.addEventListener("resize", resizeListener, true);
      } else {
        if (mref.current) {
          mref.current.style.removeProperty("display");
          mref.current.style.opacity = "1";
        }
      }
      props.$onToggle?.(open);

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
      } else {
        removeZIndex.current();
        if (props.$preventUnmount !== true) setMount(false);
        if (mref.current) {
          mref.current.style.opacity = "0";
          mref.current.style.display = "none";
        }
      }
      props.$onToggled?.(open);
    },
    destructor: (open, params) => {
      if (params.closeListener != null) {
        window.removeEventListener("click", params.closeListener, true);
      }
      if (params.resizeListener != null) {
        window.removeEventListener("resize", params.resizeListener, true);
      }
      props.$destructor?.(open);
    },
  });

  if (!showedRef.current && !showed) return <></>;
  if (portal == null) return <></>;
  return (
    <>
      {props.$anchor === "parent" && <div className={Style.anchor} ref={aref} />}
      {createPortal(
        <PopupContext.Provider
          value={{
            isPopup: true,
            showed,
            resetPosition,
          }}
        >
          {props.$mask &&
            <div
              ref={mref}
              className={Style.mask1}
              tabIndex={0}
              onKeyDown={keydownMask1}
              data-mode={props.$mask}
            />
          }
          <div
            {...attributesWithoutChildren(props, Style.main)}
            ref={ref}
            style={toggleAnimationInitStyle}
            data-show={props.$show}
            data-showed={showed}
            data-elevatation={props.$elevatation}
            onClick={click}
          >
            {mount && props.children}
          </div>
          {props.$mask && showed &&
            <div
              className={Style.mask2}
              tabIndex={0}
              onKeyDown={keydownMask2}
            />
          }
        </PopupContext.Provider>
        , portal)}
    </>
  );
};

export default Popup;