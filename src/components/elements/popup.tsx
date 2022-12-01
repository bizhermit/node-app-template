import usePortalElement from "@/hooks/portal-element";
import React, { HTMLAttributes, MutableRefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Style from "$/components/elements/popup.module.scss";
import { attributes, convertSizeNumToStr } from "@/utilities/attributes";
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
  $anchor?: MutableRefObject<HTMLElement> | { pageX: number, pageY: number };
  $position?: PopupPosition;
  $animationDirection?: "vertical" | "horizontal" | "none";
  $animationDuration?: number;
  $animationInterval?: number;
  $preventClickEvent?: boolean;
  $closeWhenClick?: boolean;
  $onToggle?: (show: boolean) => void;
  $onToggled?: (show: boolean) => void;
  $destructor?: (open: boolean) => void;
};

const Popup = React.forwardRef<HTMLDivElement, PopupProps>((props, $ref) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);
  const mref = useRef<HTMLDivElement>(null!);
  const portal = usePortalElement({
    mount: (elem) => {
      elem.classList.add("popup-root");
    },
  });

  const showedRef = useRef(false);
  const [showed, setShowed] = useState(showedRef.current);

  const click = (e: React.MouseEvent) => {
    if (props.$preventClickEvent) {
      e.stopPropagation();
    }
  };

  useEffect(() => {
    setShowed(props.$show === true);
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
          rect.width += marginX * 2
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
            ref.current.style.left = (posAbs ?
              rect.left + rect.width / 2 - wMax / 2 :
              Math.min(Math.max(0, rect.left + rect.width / 2 - wMax / 2), document.body.clientWidth - ref.current.offsetWidth)
            ) + "px";
            break;
          case "inner":
            if (document.body.clientWidth - rect.left < wMax && rect.left > document.body.clientWidth - rect.right) {
              ref.current.style.removeProperty("left");
              ref.current.style.right = (document.body.clientWidth - rect.right) + "px";
            } else {
              ref.current.style.removeProperty("right");
              ref.current.style.left = rect.left + "px";
            }
            break;
          case "inner-left":
            ref.current.style.removeProperty("right");
            ref.current.style.left = (posAbs ?
              rect.left :
              Math.min(rect.left, document.body.clientWidth - ref.current.offsetWidth)
            ) + "px";
            break;
          case "inner-right":
            ref.current.style.removeProperty("left");
            ref.current.style.right = (posAbs ?
              document.body.clientWidth - rect.right :
              Math.min(document.body.clientWidth - rect.right, document.body.clientWidth - ref.current.offsetWidth)
            ) + "px";
            break;
          case "outer":
            if (document.body.clientWidth - rect.right < wMax && rect.left > document.body.clientWidth - rect.right) {
              ref.current.style.removeProperty("left");
              ref.current.style.right = (document.body.clientWidth - rect.left) + "px";
            } else {
              ref.current.style.removeProperty("right");
              ref.current.style.left = rect.right + "px";
            }
            break;
          case "outer-left":
            ref.current.style.removeProperty("left");
            ref.current.style.right = (posAbs ?
              document.body.clientWidth - rect.left :
              Math.min(document.body.clientWidth - rect.right, document.body.clientWidth - ref.current.offsetWidth)
            ) + "px";
            break;
          case "outer-right":
            ref.current.style.removeProperty("right");
            ref.current.style.left = (posAbs ?
              rect.right :
              Math.min(rect.left, document.body.clientWidth - ref.current.offsetWidth)
            ) + "px";
            break;
          default: break;
        }
        switch (posY) {
          case "center":
            ref.current.style.removeProperty("bottom");
            ref.current.style.top = (posAbs ?
              rect.top + rect.height / 2 - hMax / 2 :
              Math.min(Math.max(0, rect.top + rect.height / 2 - hMax / 2), document.body.clientHeight - ref.current.offsetHeight)
            ) + "px";
            break;
          case "inner":
            if (document.body.clientHeight - rect.top < hMax && rect.top > document.body.clientHeight - rect.bottom) {
              ref.current.style.removeProperty("top");
              ref.current.style.bottom = (document.body.clientHeight - rect.bottom) + "px";
            } else {
              ref.current.style.removeProperty("bottom");
              ref.current.style.top = rect.top + "px";
            }
            break;
          case "inner-top":
            ref.current.style.removeProperty("bottom");
            ref.current.style.top = (posAbs ?
              rect.top :
              Math.min(rect.top, document.body.clientHeight - ref.current.offsetHeight)
            ) + "px";
            break;
          case "inner-bottom":
            ref.current.style.removeProperty("top");
            ref.current.style.bottom = (posAbs ?
              document.body.clientHeight - rect.bottom :
              Math.min(document.body.clientHeight - rect.bottom, document.body.clientHeight - ref.current.offsetHeight)
            ) + "px";
            break;
          case "outer":
            if (document.body.clientHeight - rect.bottom < hMax && rect.top > document.body.clientHeight - rect.bottom) {
              ref.current.style.removeProperty("top");
              ref.current.style.bottom = (document.body.clientHeight - rect.top) + "px";
            } else {
              ref.current.style.removeProperty("bottom");
              ref.current.style.top = rect.bottom + "px";
            }
            break;
          case "outer-top":
            ref.current.style.removeProperty("top");
            ref.current.style.bottom = (posAbs ?
              document.body.clientHeight - rect.top :
              Math.min(document.body.clientHeight - rect.bottom, document.body.clientHeight - ref.current.offsetHeight)
            ) + "px";
            break;
          case "outer-bottom":
            ref.current.style.removeProperty("bottom");
            ref.current.style.top = (posAbs ?
              rect.bottom :
              Math.min(rect.top, document.body.clientHeight - ref.current.offsetHeight)
            ) + "px";
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
      const closeListener = () => {
        setShowed(false);
      };
      if (props.$closeWhenClick) {
        if (open) {
          window.addEventListener("click", closeListener);
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
        if (!mref.current) return;
        mref.current.style.opacity = "0";
        mref.current.style.display = "none";
      }
      props.$onToggled?.(open);
    },
    destructor: (open, params) => {
      if (open) {
        window.removeEventListener("click", params.closeListener);
      }
      props.$destructor?.(open);
    },
  })

  if (!showedRef.current && !showed) return <></>;
  if (portal == null) return <></>;
  return createPortal(
    <>
      {props.$mask && <div ref={mref} className={Style.mask} />}
      <div
        {...attributes(props, Style.main)}
        ref={ref}
        style={toggleAnimationInitStyle}
        data-show={props.$show}
        data-showed={showed}
        onClick={click}
      />
    </>
    , portal);
});

export default Popup;