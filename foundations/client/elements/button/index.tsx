"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import joinCn from "../../utilities/join-class-name";
import { isNotReactNode } from "../../utilities/react-node";
import useForm from "../form/context";
import Style from "./index.module.scss";

export type ButtonOptions = {
  $size?: Size;
  $color?: Color;
  $round?: boolean;
  $outline?: boolean;
  $text?: boolean;
  $icon?: ReactNode;
  $iconPosition?: "left" | "right";
  $fillLabel?: boolean;
  $fitContent?: boolean;
  $noPadding?: boolean;
  $focusWhenMounted?: boolean;
  $notDependsOnForm?: boolean;
  onClick?: (unlock: (preventFocus?: boolean) => void, event: React.MouseEvent<HTMLButtonElement>) => (void | boolean | Promise<void | boolean>);
};

export type ButtonProps = OverwriteAttrs<ButtonHTMLAttributes<HTMLButtonElement>, ButtonOptions>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
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
  $notDependsOnForm,
  onClick,
  children,
  ...props
}, $ref) => {
  const ref = useRef<HTMLButtonElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const form = useForm();
  const submitDisabled = $notDependsOnForm !== true && (
    (props.type === "submit" && props.formMethod !== "delete" && (form.hasError || form.disabled)) ||
    (props.type === "reset" && (form.disabled || form.readOnly))
  );

  const disabledRef = useRef(false);
  const [disabled, setDisabled] = useState(disabledRef.current);

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.disabled || disabledRef.current || submitDisabled) {
      e.preventDefault();
      return;
    }
    setDisabled(disabledRef.current = true);
    const unlock = () => setDisabled(disabledRef.current = false);
    const res = onClick?.(unlock, e);
    if (res == null || typeof res === "boolean") {
      if (res !== true) unlock();
    }
  };

  useEffect(() => {
    if ($focusWhenMounted) ref.current?.focus();
  }, []);

  return (
    <button
      {...props}
      className={joinCn(Style.wrap, className)}
      ref={ref}
      type={props.type ?? "button"}
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
    </button>
  );
});

export default Button;