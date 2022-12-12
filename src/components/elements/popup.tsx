import usePortalElement from "@/hooks/portal-element";
import React, { HTMLAttributes, MutableRefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Style from "$/components/elements/popup.module.scss";
import { attributesWithoutChildren, convertSizeNumToStr } from "@/utilities/attributes";
import useToggleAnimation from "@/hooks/toggle-animation";

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
  $mask?: boolean;
  $anchor?: MutableRefObject<HTMLElement> | { pageX: number, pageY: number } | "parent";
  $position?: PopupPosition;
  $animationDirection?: "vertical" | "horizontal" | "none";
  $animationDuration?: number;
  $animationInterval?: number;
  $preventClickEvent?: boolean;
  $preventUnmount?: boolean;
  $closeWhenClick?: boolean;
  $zIndex?: number;
  $onToggle?: (show: boolean) => void;
  $onToggled?: (show: boolean) => void;
  $destructor?: (open: boolean) => void;
};

const baseZIndex = 10000000;

const Popup = React.forwardRef<HTMLDivElement, PopupProps>((props, $ref) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);
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

  const toggleAnimationInitStyle = useToggleAnimation({
    elementRef: ref,
    open: showed,
    changeOpacity: true,
    closeOpacityDelay: props.$animationDirection === "horizontal" || props.$animationDirection === "vertical",
    animationInterval: props.$animationInterval ?? defaultAnimationInterval,
    animationTime: props.$animationDuration ?? defaultAnimationDuration,
    style: props.style,
    direction: props.$animationDirection,
    onToggle: (open) => {
      if (open) {
        showedRef.current = true;
        updateZIndex.current();
        if (mref.current) {
          mref.current.style.removeProperty("display");
          mref.current.style.opacity = "0";
        }

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
          rect = document.body.getBoundingClientRect();
          if (posX.startsWith("outer")) posX = "center";
          if (posY.startsWith("outer")) posY = "center";
        } else if (props.$anchor === "parent") {
          const anchor = aref.current?.parentElement as HTMLElement;
          rect = anchor.getBoundingClientRect();
        } else if ("current" in props.$anchor) {
          const anchor = props.$anchor.current;
          if (anchor == null) {
            rect = document.body.getBoundingClientRect();
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

        switch (posX) {
          case "center":
            ref.current.style.removeProperty("right");
            ref.current.style.left = convertSizeNumToStr(posAbs ?
              rect.left + rect.width / 2 - wMax / 2 :
              Math.min(Math.max(0, rect.left + rect.width / 2 - wMax / 2), document.body.clientWidth - ref.current.offsetWidth)
            )!;
            break;
          case "inner":
            if (document.body.clientWidth - rect.left < wMax && rect.left > document.body.clientWidth - rect.right) {
              ref.current.style.removeProperty("left");
              ref.current.style.right = convertSizeNumToStr(document.body.clientWidth - rect.right)!;
            } else {
              ref.current.style.removeProperty("right");
              ref.current.style.left = convertSizeNumToStr(rect.left)!;
            }
            break;
          case "inner-left":
            ref.current.style.removeProperty("right");
            ref.current.style.left = convertSizeNumToStr(posAbs ?
              rect.left :
              Math.min(rect.left, document.body.clientWidth - ref.current.offsetWidth)
            )!;
            break;
          case "inner-right":
            ref.current.style.removeProperty("left");
            ref.current.style.right = convertSizeNumToStr(posAbs ?
              document.body.clientWidth - rect.right :
              Math.min(document.body.clientWidth - rect.right, document.body.clientWidth - ref.current.offsetWidth)
            )!;
            break;
          case "outer":
            if (document.body.clientWidth - rect.right < wMax && rect.left > document.body.clientWidth - rect.right) {
              ref.current.style.removeProperty("left");
              ref.current.style.right = convertSizeNumToStr(document.body.clientWidth - rect.left)!;
            } else {
              ref.current.style.removeProperty("right");
              ref.current.style.left = convertSizeNumToStr(rect.right)!;
            }
            break;
          case "outer-left":
            ref.current.style.removeProperty("left");
            ref.current.style.right = convertSizeNumToStr(posAbs ?
              document.body.clientWidth - rect.left :
              Math.min(document.body.clientWidth - rect.left, document.body.clientWidth - ref.current.offsetWidth)
            )!;
            break;
          case "outer-right":
            ref.current.style.removeProperty("right");
            ref.current.style.left = convertSizeNumToStr(posAbs ?
              rect.right :
              Math.min(rect.right, document.body.clientWidth - ref.current.offsetWidth)
            )!;
            break;
          default: break;
        }
        switch (posY) {
          case "center":
            ref.current.style.removeProperty("bottom");
            ref.current.style.top = convertSizeNumToStr(posAbs ?
              rect.top + rect.height / 2 - hMax / 2 :
              Math.min(Math.max(0, rect.top + rect.height / 2 - hMax / 2), document.body.clientHeight - ref.current.offsetHeight)
            )!;
            break;
          case "inner":
            if (document.body.clientHeight - rect.top < hMax && rect.top > document.body.clientHeight - rect.bottom) {
              ref.current.style.removeProperty("top");
              ref.current.style.bottom = convertSizeNumToStr(document.body.clientHeight - rect.bottom)!;
            } else {
              ref.current.style.removeProperty("bottom");
              ref.current.style.top = convertSizeNumToStr(rect.top)!;
            }
            break;
          case "inner-top":
            ref.current.style.removeProperty("bottom");
            ref.current.style.top = convertSizeNumToStr(posAbs ?
              rect.top :
              Math.min(rect.top, document.body.clientHeight - ref.current.offsetHeight)
            )!;
            break;
          case "inner-bottom":
            ref.current.style.removeProperty("top");
            ref.current.style.bottom = convertSizeNumToStr(posAbs ?
              document.body.clientHeight - rect.bottom :
              Math.min(document.body.clientHeight - rect.bottom, document.body.clientHeight - ref.current.offsetHeight)
            )!;
            break;
          case "outer":
            if (document.body.clientHeight - rect.bottom < hMax && rect.top > document.body.clientHeight - rect.bottom) {
              ref.current.style.removeProperty("top");
              ref.current.style.bottom = convertSizeNumToStr(document.body.clientHeight - rect.top)!;
            } else {
              ref.current.style.removeProperty("bottom");
              ref.current.style.top = convertSizeNumToStr(rect.bottom)!;
            }
            break;
          case "outer-top":
            ref.current.style.removeProperty("top");
            ref.current.style.bottom = convertSizeNumToStr(posAbs ?
              document.body.clientHeight - rect.top :
              Math.min(document.body.clientHeight - rect.top, document.body.clientHeight - ref.current.offsetHeight)
            )!;
            break;
          case "outer-bottom":
            ref.current.style.removeProperty("bottom");
            ref.current.style.top = convertSizeNumToStr(posAbs ?
              rect.bottom :
              Math.min(rect.bottom, document.body.clientHeight - ref.current.offsetHeight)
            )!;
            break;
          default: break;
        }
      } else {
        if (mref.current) {
          mref.current.style.removeProperty("display");
          mref.current.style.opacity = "1";
        }
      }
      props.$onToggle?.(open);
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
      if (props.$closeWhenClick) {
        if (open) {
          window.addEventListener("click", closeListener, true);
        }
      }
      return {
        closeListener,
      };
    },
    onToggling: (ctx) => {
      if (mref.current) mref.current.style.opacity = String(ctx.opacity);
    },
    onToggled: (open) => {
      if (open) {
        if (!mref.current) return;
        mref.current.style.opacity = "1";
      } else {
        removeZIndex.current();
        if (props.$preventUnmount !== true) setMount(false);
        if (!mref.current) return;
        mref.current.style.opacity = "0";
        mref.current.style.display = "none";
      }
      props.$onToggled?.(open);
    },
    destructor: (open, params) => {
      if (params.closeListener != null) {
        window.removeEventListener("click", params.closeListener, true);
      }
      props.$destructor?.(open);
    },
  });

  if (!showedRef.current && !showed) return <></>;
  if (portal == null) return <></>;
  return (
    <>
      {props.$anchor === "parent" && <div ref={aref} />}
      {createPortal(
        <>
          {props.$mask &&
            <div
              ref={mref}
              className={Style.mask1}
              tabIndex={0}
              onKeyDown={keydownMask1}
            />
          }
          <div
            {...attributesWithoutChildren(props, Style.main)}
            ref={ref}
            style={toggleAnimationInitStyle}
            data-show={props.$show}
            data-showed={showed}
            onClick={click}
          >
            {mount && props.children}
          </div>
          {props.$mask &&
            <div
              className={Style.mask2}
              tabIndex={0}
              onKeyDown={keydownMask2}
            />
          }
        </>
        , portal)}
    </>
  );
});

export default Popup;