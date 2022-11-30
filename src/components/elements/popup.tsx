import usePortalElement from "@/hooks/portal-element";
import React, { HTMLAttributes, MutableRefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Style from "$/components/elements/popup.module.scss";
import { attributes, convertSizeNumToStr } from "@/utilities/attributes";

const defaultAnimationDuration = 150;
const defaultAnimationInterval = 10;

type Position = {
  x: "inner" | "outer" | "center" | "inner-left" | "inner-right" | "outer-left" | "outer-right";
  y: "inner" | "outer" | "center" | "inner-top" | "inner-bottom" | "outer-top" | "outer-bottom";
};

export type PopupProps = HTMLAttributes<HTMLDivElement> & {
  $show?: boolean;
  $mask?: boolean;
  $anchor?: MutableRefObject<HTMLElement> | { pageX: number, pageY: number };
  $position?: Position;
  $animationDirection?: "vertical" | "horizontal" | "none";
  $animationDuration?: number;
  $animationInterval?: number;
  $preventClickEvent?: boolean;
  $closeWhenClick?: boolean;
  $onToggle?: (show?: boolean) => void;
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
      e.preventDefault();
    }
  };

  useEffect(() => {
    setShowed(props.$show === true);
  }, [props.$show]);

  useEffect(() => {
    props.$onToggle?.(showed);
    if (!showedRef.current && !showed) return;
    if (ref.current == null) return;
    let alive = true;
    const aDuration = props.$animationDuration ?? defaultAnimationDuration;
    const aInterval = props.$animationInterval ?? defaultAnimationInterval;
    const aDirection = props.$animationDirection || "none";

    if (showed) {
      showedRef.current = true;
      const end = () => {
        if (!ref.current) return;
        ref.current.style.height = convertSizeNumToStr(props.style?.height, "unset");
        ref.current.style.width = convertSizeNumToStr(props.style?.width, "unset");
        ref.current.style.removeProperty("overflow");
        ref.current.style.removeProperty("opacity");
        if (!mref.current) return;
        mref.current.style.opacity = "1";
      };
      ref.current.style.removeProperty("display");
      ref.current.style.opacity = "0";
      ref.current.style.visibility = "unset";
      ref.current.style.height = convertSizeNumToStr(props.style?.height, "unset");
      ref.current.style.width = convertSizeNumToStr(props.style?.width, "unset");
      if (mref.current) {
        mref.current.style.removeProperty("display");
        mref.current.style.opacity = "0";
      }

      const hMax = ref.current.offsetHeight;
      const wMax = ref.current.offsetWidth;
      const hStep = Math.max(1, Math.round(hMax / (aDuration / aInterval)));
      const wStep = Math.max(1, Math.round(wMax / (aDuration / aInterval)));
      const oStep = 2 / (aDuration / aInterval);

      let posX = props.$position?.x || "center";
      let posY = props.$position?.y || "center";
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

      switch (posX) {
        case "center":
          ref.current.style.removeProperty("right");
          ref.current.style.left = (rect.left + rect.width / 2 - wMax / 2) + "px";
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
          ref.current.style.left = rect.left + "px";
          break;
        case "inner-right":
          ref.current.style.removeProperty("left");
          ref.current.style.right = (document.body.clientWidth - rect.right) + "px";
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
          ref.current.style.right = (document.body.clientWidth - rect.left) + "px";
          break;
        case "outer-right":
          ref.current.style.removeProperty("right");
          ref.current.style.left = rect.right + "px";
          break;
        default: break;
      }
      switch (posY) {
        case "center":
          ref.current.style.removeProperty("bottom");
          ref.current.style.top = (rect.top + rect.height / 2 - hMax / 2) + "px";
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
          ref.current.style.top = rect.top + "px";
          break;
        case "inner-bottom":
          ref.current.style.removeProperty("top");
          ref.current.style.bottom = (document.body.clientHeight - rect.bottom) + "px";
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
          ref.current.style.bottom = (document.body.clientHeight - rect.top) + "px";
          break;
        case "outer-bottom":
          ref.current.style.removeProperty("bottom");
          ref.current.style.top = rect.bottom + "px";
          break;
        default: break;
      }

      ref.current.style.overflow = "hidden";
      let w = 0, h = 0, o = 0;
      switch (aDirection) {
        case "horizontal":
          ref.current.style.width = "0px";
          break;
        case "vertical":
          ref.current.style.height = "0px";
          break;
        default:
          ref.current.style.removeProperty("width");
          ref.current.style.removeProperty("height");
          break;
      }
      const func = () => {
        setTimeout(() => {
          if (!alive) {
            end();
            return;
          }
          o = Math.min(1, o + oStep);
          ref.current.style.opacity = String(o);
          if (mref.current) mref.current.style.opacity = String(o);
          switch (aDirection) {
            case "horizontal":
              w += wStep;
              if (w > wMax) {
                end();
                return;
              }
              ref.current.style.width = `${w}px`;
              break;
            case "vertical":
              h += hStep;
              if (h > hMax) {
                end();
                return;
              }
              ref.current.style.height = `${h}px`;
              break;
            default:
              if (o === 1) {
                end();
                return;
              }
              break;
          }
          func();
        }, aInterval);
      };
      func();
    } else {
      const end = () => {
        if (!ref.current) return;
        ref.current.style.display = "none";
        ref.current.style.removeProperty("visibility");
        ref.current.style.opacity = "0";
        ref.current.style.height = convertSizeNumToStr(props.style?.height, "unset");
        ref.current.style.width = convertSizeNumToStr(props.style?.width, "unset");
        if (!mref.current) return;
        mref.current.style.opacity = "0";
        mref.current.style.display = "none";
      };
      if (!showedRef.current) {
        end();
        return;
      }
      ref.current.style.removeProperty("display");
      ref.current.style.visibility = "unset";
      ref.current.style.overflow = "hidden";
      ref.current.style.opacity = "1";
      if (mref.current) {
        mref.current.style.removeProperty("display");
        mref.current.style.opacity = "1";
      }

      const hMax = ref.current.offsetHeight;
      const wMax = ref.current.offsetWidth;
      const hStep = Math.max(1, Math.round(hMax / (aDuration / aInterval)));
      const wStep = Math.max(1, Math.round(wMax / (aDuration / aInterval)));
      const oStep = 2 / (aDuration / aInterval);
      let count = 0;
      const opacityStartCount = aDirection === "none" ? 0 : aDuration / aInterval / 2;

      let w = wMax, h = hMax, o = 1;
      const func = () => {
        setTimeout(() => {
          if (!alive) {
            end();
            return;
          }
          if (count++ > opacityStartCount) {
            o = Math.max(0, o - oStep);
            ref.current.style.opacity = String(o);
            if (mref.current) mref.current.style.opacity = String(o);
          }
          switch (aDirection) {
            case "horizontal":
              w -= wStep;
              if (w < 0) {
                end();
                return;
              }
              ref.current.style.width = `${w}px`;
              break;
            case "vertical":
              h -= hStep;
              if (h < 0) {
                end();
                return;
              }
              ref.current.style.height = `${h}px`;
              break;
            default:
              if (o === 0) {
                end();
                return;
              }
              break;
          }
          func();
        }, aInterval);
      };
      func();
    }

    const closeListener = () => {
      setShowed(false);
    };
    if (props.$closeWhenClick) {
      if (showed) {
        window.addEventListener("click", closeListener);
      }
    }
    return () => {
      alive = false;
      if (showed) {
        window.removeEventListener("click", closeListener);
      }
    };
  }, [showed]);

  if (!showedRef.current && !showed) return <></>;
  if (portal == null) return <></>;
  return createPortal(
    <>
      {props.$mask && <div ref={mref} className={Style.mask} />}
      <div
        {...attributes(props, Style.main)}
        ref={ref}
        data-show={props.$show}
        data-showed={showed}
        onClick={click}
      />
    </>
    , portal);
});

export default Popup;