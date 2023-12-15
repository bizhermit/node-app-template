"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, type FC, type HTMLAttributes } from "react";
import { createPortal } from "react-dom";
import usePortalElement from "../../hooks/portal-element";
import { attributesWithoutChildren } from "../../utilities/attributes";
import Style from "./index.module.scss";

type LoadingAppearance = "bar" | "circle";

type LoadingOptions = {
  $color?: Color;
  $absolute?: boolean;
  $mask?: boolean;
  $appearance?: LoadingAppearance;
};

type LoadingMaskProps = Pick<LoadingOptions, "$absolute">;

export type LoadingProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, LoadingOptions>;

const Loading = forwardRef<HTMLDivElement, LoadingProps>(({
  $color,
  $absolute,
  $mask,
  $appearance = "bar",
  ...props
}, $ref) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);
  const cref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if ($mask) {
      (cref.current?.querySelector("button") ?? cref.current ?? ref.current)?.focus();
    }
  }, []);

  return (
    <>
      {$mask && <Mask1 $absolute={$absolute} />}
      <div
        {...attributesWithoutChildren(props, Style.wrap)}
        ref={ref}
        tabIndex={0}
        data-abs={$absolute}
        data-appearance={$appearance}
      >
        {$appearance === "bar" &&
          <div
            className={Style.bar}
            data-color={$color}
          />
        }
        {$appearance === "circle" &&
          <div
            className={Style.circle}
            data-color={$color}
          />
        }
      </div>
      {props.children != null &&
        <div
          ref={cref}
          tabIndex={0}
          className={Style.content}
          data-abs={$absolute}
        >
          {props.children}
        </div>
      }
      {$mask && <Mask2 $absolute={$absolute} />}
    </>
  );
});

const Mask1: FC<LoadingMaskProps> = (props) => {
  const keydown = (e: React.KeyboardEvent) => {
    if (e.shiftKey && e.key === "Tab") e.preventDefault();
  };

  return (
    <div
      className={Style.mask1}
      data-abs={props.$absolute}
      tabIndex={0}
      onKeyDown={keydown}
    />
  );
};

const Mask2: FC<LoadingMaskProps> = (props) => {
  const keydown = (e: React.KeyboardEvent) => {
    if (!e.shiftKey && e.key === "Tab") e.preventDefault();
  };

  return (
    <div
      className={Style.mask2}
      data-fixed={props.$absolute}
      tabIndex={0}
      onKeyDown={keydown}
    />
  );
};

export const ScreenLoading = forwardRef<HTMLDivElement, LoadingProps>((props, ref) => {
  const portal = usePortalElement({
    mount: (elem) => {
      elem.classList.add(Style.root);
    },
  });

  return portal == null ? <></> : createPortal(<Loading {...props} ref={ref} $absolute />, portal);
});

export default Loading;
