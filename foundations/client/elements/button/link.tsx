"use client";

import Router from "next/router";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import structKeys from "../../../objects/struct/keys";
import { attrs, isNotReactNode } from "../../utilities/attributes";
import type { ButtonOptions } from "../button";
import useForm from "../form/context";
import NextLink, { replaceDynamicPathname, type NextLinkOptions, type NextLinkProps } from "../link";
import Style from "./index.module.scss";

export type LinkButtonOptions = Omit<ButtonOptions, "onClick" | "notDependsOnForm"> & Omit<NextLinkOptions, "onClick"> & {
  $dependsOnForm?: boolean | "submit";
  onClick?: (unlock: (preventFocus?: boolean) => void, event: React.MouseEvent<HTMLAnchorElement>) => (void | boolean | Promise<void | boolean>);
};

export type LinkButtonProps = ExtAttrs<NextLinkProps, LinkButtonOptions>;

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(({
  $size,
  $color,
  $round,
  $outline,
  $icon,
  $iconPosition,
  $fillLabel,
  $fitContent,
  $noPadding,
  $focusWhenMounted,
  $dependsOnForm,
  children,
  onClick,
  ...props
}, $ref) => {
  const ref = useRef<HTMLAnchorElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const form = useForm();
  const submitDisabled = $dependsOnForm && (form.disabled || ($dependsOnForm === "submit" && form.hasError));

  const disabledRef = useRef(false);
  const [disabled, setDisabeld] = useState(disabledRef.current);

  const lock = () => {
    setDisabeld(disabledRef.current = true);
  };

  const unlock = () => {
    setDisabeld(disabledRef.current = false);
  };

  const click = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!props.href || props.disabled || disabledRef.current || submitDisabled) {
      e.preventDefault();
      return;
    }
    lock();
    const res = onClick?.(unlock, e);
    if (res == null || typeof res === "boolean") {
      if (res === false) e.preventDefault();
      unlock();
      return;
    }
    e.preventDefault();
    res.then(r => {
      if (r === false) return;
      const pathname = replaceDynamicPathname(props.href, props.params);
      if (pathname == null) return;
      if (pathname.match(/^(http|mailto:|tel:)/)) {
        const url = new URL(pathname);
        structKeys(props.query).forEach(k => {
          url.searchParams.set(k.toString(), `${props.query?.[k]}`);
        });
        window.open(url, props.target);
        return;
      }
      Router[props.replace ? "replace" : "push"]({
        pathname,
        query: props.query,
      }, undefined, {
        locale: props.locale,
        scroll: props.scroll,
        shallow: props.shallow,
      });
    });
  };

  useEffect(() => {
    if ($focusWhenMounted) ref.current?.focus();
  }, []);

  return (
    <NextLink
      {...attrs(props, Style.wrap)}
      ref={ref}
      role="button"
      disabled={props.disabled || submitDisabled || disabled}
      onClick={click}
      data-color={$color}
      data-size={$size || "m"}
      data-wide={!$fitContent && children != null}
      data-round={$round}
    >
      <div
        className={Style.main}
        data-outline={$outline}
        data-icon={$icon != null && ($iconPosition || "left")}
      >
        {$icon != null && $iconPosition !== "right" &&
          <div className={Style.icon}>{$icon}</div>
        }
        <div
          className={Style.label}
          data-fill={$fillLabel}
          data-pt={isNotReactNode(children)}
          data-pad={!$noPadding}
        >
          {children}
        </div>
        {$icon != null && $iconPosition === "right" &&
          <div className={Style.icon}>{$icon}</div>
        }
      </div>
    </NextLink>
  );
});

export default LinkButton;