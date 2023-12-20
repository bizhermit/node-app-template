"use client";

import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import structKeys from "../../../objects/struct/keys";
import replaceDynamicPathname from "../../../objects/url/dynamic-pathname";
import { isNotReactNode } from "../../utilities/attributes";
import joinCn from "../../utilities/join-class-name";
import type { ButtonOptions } from "../button";
import useForm from "../form/context";
import NextLink, { type NextLinkOptions, type NextLinkProps } from "../link";
import Style from "./index.module.scss";

export type LinkButtonOptions = Omit<ButtonOptions, "onClick" | "notDependsOnForm"> & Omit<NextLinkOptions, "onClick"> & {
  $dependsOnForm?: boolean | "submit";
  onClick?: (unlock: (preventFocus?: boolean) => void, event: React.MouseEvent<HTMLAnchorElement>) => (void | boolean | Promise<void | boolean>);
};

export type LinkButtonProps = OverwriteAttrs<NextLinkProps, LinkButtonOptions>;

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(({
  className,
  $size,
  $color,
  $round,
  $outline,
  $text,
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
  const router = useRouter();

  const form = useForm();
  const submitDisabled = $dependsOnForm && (form.disabled || ($dependsOnForm === "submit" && form.hasError));

  const disabledRef = useRef(false);
  const [disabled, setDisabeld] = useState(disabledRef.current);

  const click = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!props.href || props.disabled || disabledRef.current || submitDisabled) {
      e.preventDefault();
      return;
    }
    setDisabeld(disabledRef.current = true);
    const unlock = () => setDisabeld(disabledRef.current = false);
    const res = onClick?.(unlock, e);
    if (res == null || typeof res === "boolean") {
      if (res === false) e.preventDefault();
      unlock();
      return;
    }
    e.preventDefault();
    res.then(res => {
      if (res === false) return;
      const pathname = replaceDynamicPathname(props.href!, props.params);
      if (pathname == null) return;
      const url = new URL(pathname, window.location.origin);
      structKeys(props.query).forEach(k => {
        url.searchParams.set(k.toString(), `${props.query?.[k]}`);
      });
      if (pathname.match(/^(http|mailto:|tel:)/) || props.target === "_blank") {
        window.open(url, props.target);
        return;
      }
      router[props.replace ? "replace" : "push"](url.toString(), {
        scroll: props.scroll
      });
    });
  };

  useEffect(() => {
    if ($focusWhenMounted) ref.current?.focus();
  }, []);

  return (
    <NextLink
      {...props}
      className={joinCn(Style.wrap, className)}
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
        data-text={$text}
        data-icon={$icon != null && ($iconPosition || "left")}
      >
        {$icon != null && <div className={Style.icon}>{$icon}</div>}
        <div
          className={Style.label}
          data-fill={$fillLabel}
          data-pt={isNotReactNode(children)}
          data-pad={!$noPadding}
        >
          {children}
        </div>
      </div>
    </NextLink>
  );
});

export default LinkButton;