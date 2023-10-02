"use client";

import { type FC, forwardRef, type HTMLAttributes, useEffect, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import Style from "./style.module.scss";
import { attributesWithoutChildren } from "../../utilities/attributes";
import usePortalElement from "../../hooks/portal-element";

export type LoadingAppearance = "bar" | "circle";

type OmitAttributes = "color";
export type LoadingProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $color?: Color;
  $reverseColor?: boolean;
  $fixed?: boolean;
  $mask?: boolean;
  $appearance?: LoadingAppearance;
};

const Loading = forwardRef<HTMLDivElement, LoadingProps>((props, $ref) => {
  const appearance = props.$appearance || "bar";
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);
  const cref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (props.$mask) {
      (cref.current?.querySelector("button") ?? cref.current ?? ref.current)?.focus();
    }
  }, []);

  return (
    <>
      {props.$mask && <Mask1 {...props} />}
      <div
        {...attributesWithoutChildren(props, Style.wrap)}
        ref={ref}
        tabIndex={0}
        data-fixed={props.$fixed}
        data-appearance={appearance}
      >
        {appearance === "bar" &&
          <div className={`${Style.bar} bgc-${props.$color || "main"}${props.$reverseColor ? "_r" : ""}`} />
        }
        {appearance === "circle" &&
          <div className={`${Style.circle} bdc-${props.$color || "main"}${props.$reverseColor ? "_r" : ""}`} />
        }
      </div>
      {props.children != null &&
        <div
          ref={cref}
          tabIndex={0}
          className={Style.content}
          data-fixed={props.$fixed}
        >
          {props.children}
        </div>
      }
      {props.$mask && <Mask2 {...props} />}
    </>
  );
});

const Mask1: FC<LoadingProps> = (props) => {
  const keydown = (e: React.KeyboardEvent) => {
    if (e.shiftKey && e.key === "Tab") e.preventDefault();
  };

  return (
    <div
      className={Style.mask1}
      data-fixed={props.$fixed}
      tabIndex={0}
      onKeyDown={keydown}
    />
  );
};

const Mask2: FC<LoadingProps> = (props) => {
  const keydown = (e: React.KeyboardEvent) => {
    if (!e.shiftKey && e.key === "Tab") e.preventDefault();
  };

  return (
    <div
      className={Style.mask2}
      data-fixed={props.$fixed}
      tabIndex={0}
      onKeyDown={keydown}
    />
  );
};

export const ScreenLoading = forwardRef<HTMLDivElement, LoadingProps>((props, ref) => {
  const portal = usePortalElement({
    mount: (elem) => {
      elem.classList.add(Style.root);
    }
  });

  if (portal == null) return <></>;
  return createPortal(<Loading {...props} ref={ref} $fixed />, portal);
});

export default Loading;
