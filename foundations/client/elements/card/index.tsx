"use client";

import type React from "react";
import { forwardRef, useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import joinCn from "../../utilities/join-class-name";
import { MinusIcon, PlusIcon } from "../icon";
import Resizer from "../resizer";
import Style from "./index.module.scss";

type IconPosition = "start" | "end" | "none";

type CardOptions = {
  $color?: Color;
  $header?: ReactNode;
  $footer?: ReactNode;
  $headerAlign?: "start" | "center" | "end";
  $footerAlign?: "start" | "center" | "end";
  $headerIconPosition?: IconPosition;
  $footerIconPosition?: IconPosition;
  $preventHeaderToggle?: boolean;
  $preventFooterToggle?: boolean;
  $accordion?: boolean;
  $disabled?: boolean;
  $openedIcon?: ReactNode;
  $closedIcon?: ReactNode;
  $direction?: "vertical" | "horizontal";
  $defaultClosed?: boolean;
  $opened?: boolean;
  $defaultMount?: boolean;
  $unmountClosed?: boolean;
  $onToggled?: (open: boolean) => void;
  $resize?: boolean | "x" | "y" | "xy";
  children?: ReactNode;
};

export type CardProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, CardOptions>;

const Card = forwardRef<HTMLDivElement, CardProps>(({
  className,
  $color,
  $header,
  $footer,
  $headerAlign,
  $footerAlign,
  $headerIconPosition,
  $footerIconPosition,
  $preventHeaderToggle,
  $preventFooterToggle,
  $accordion,
  $disabled,
  $openedIcon,
  $closedIcon,
  $direction,
  $defaultClosed,
  $opened,
  $defaultMount,
  $unmountClosed,
  $onToggled,
  $resize,
  children,
  ...props
}, ref) => {
  const [_opened, setOpened] = useState($defaultClosed !== true);
  const opened = !$accordion || ($opened ?? _opened);
  const [mounted, setMounted] = useState(opened || $defaultMount);

  const toggle = () => {
    if (!$accordion || $disabled) return;
    setOpened(c => !c);
  };

  const transitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const checked = (e.currentTarget.previousElementSibling as HTMLInputElement).checked;
    if ($unmountClosed && !checked) setMounted(false);
    $onToggled?.(checked);
  };

  useEffect(() => {
    if (opened) setMounted(true);
  }, [opened]);

  const iconNode = $accordion && !$disabled && (
    <div className={Style.icon}>
      {opened ?
        $openedIcon ?? <MinusIcon /> :
        $closedIcon ?? <PlusIcon />
      }
    </div>
  );

  return (
    <div
      {...props}
      ref={ref}
      className={joinCn(Style.wrap, className)}
      data-direction={$direction ?? "vertical"}
      data-accordion={$accordion}
      data-color={$color}
    >
      {$header &&
        <div
          className={Style.header}
          data-pos={$headerIconPosition ?? "start"}
          data-clickable={$accordion && !$disabled && !$preventHeaderToggle}
          onClick={$preventHeaderToggle ? undefined : toggle}
        >
          {iconNode}
          <div
            className={Style.label}
            data-align={$headerAlign ?? "start"}
          >
            {$header}
          </div>
        </div>
      }
      <input
        className={Style.check}
        type="checkbox"
        checked={opened && mounted}
      />
      <div
        className={Style.main}
        onTransitionEnd={transitionEnd}
        data-first={!$header}
        data-last={!$footer}
        data-resize={$resize}
      >
        <div className={Style.content}>
          {mounted && children}
        </div>
        {$resize &&
          <Resizer direction={typeof $resize === "boolean" ? "xy" : $resize} />
        }
      </div>
      {$footer &&
        <div
          className={Style.footer}
          data-pos={$footerIconPosition ?? "start"}
          data-clickable={$accordion && !$disabled && !$preventFooterToggle}
          onClick={$preventFooterToggle ? undefined : toggle}
        >
          {iconNode}
          <div
            className={Style.label}
            data-align={$footerAlign ?? "start"}
          >
            {$footer}
          </div>
        </div>
      }
    </div>
  );
});

export default Card;