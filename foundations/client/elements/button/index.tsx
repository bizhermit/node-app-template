"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { appendedColorStyle, attributesWithoutChildren, isNotReactNode } from "../../utilities/attributes";
import useForm from "../form/context";
import Style from "./index.module.scss";

export type ButtonOptions = {
  $size?: Size;
  $color?: Color;
  $round?: boolean;
  $outline?: boolean;
  $icon?: ReactNode;
  $iconPosition?: "left" | "right";
  $fillLabel?: boolean;
  $fitContent?: boolean;
  $noPadding?: boolean;
  $focusWhenMounted?: boolean;
};

type OmitAttributes = "onClick" | "color";
export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, OmitAttributes> & ButtonOptions & {
  $onClick?: (unlock: (preventFocus?: boolean) => void, event: React.MouseEvent<HTMLButtonElement>) => (void | boolean | Promise<void>);
  $ignoreFormValidation?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, $ref) => {
  const ref = useRef<HTMLButtonElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const disabledRef = useRef(false);
  const [disabled, setDisabled] = useState(false);
  const form = useForm();

  const lock = () => {
    setDisabled(disabledRef.current = true);
  };

  const unlock = () => {
    setDisabled(disabledRef.current = false);
  };

  const submitDisabled = props.$ignoreFormValidation !== true && (
    (props.type === "submit" && props.formMethod !== "delete" && (form.hasError || form.disabled)) ||
    (props.type === "reset" && (form.disabled || form.readOnly))
  );

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.disabled || disabledRef.current || submitDisabled) {
      e.preventDefault();
      return false;
    }
    lock();
    const res = props.$onClick?.(unlock, e);
    if (res == null || typeof res === "boolean") {
      if (res !== true) unlock();
      return res ?? false;
    }
    return false;
  };

  useEffect(() => {
    if (props.$focusWhenMounted) {
      ref.current?.focus();
    }
  }, []);

  return (
    <button
      {...attributesWithoutChildren(props, Style.wrap)}
      style={appendedColorStyle(props)}
      ref={ref}
      type={props.type ?? "button"}
      disabled={props.disabled || submitDisabled || disabled}
      onClick={click}
      data-size={props.$size || "m"}
      data-wide={!props.$fitContent && props.children != null}
      data-round={props.$round}
    >
      <div
        className={Style.main}
        data-outline={props.$outline}
        data-icon={props.$icon != null && (props.$iconPosition || "left")}
      >
        {props.$icon != null && props.$iconPosition !== "right" &&
          <div className={Style.icon}>{props.$icon}</div>
        }
        <div
          className={Style.label}
          data-fill={props.$fillLabel}
          data-pt={isNotReactNode(props.children)}
          data-pad={!props.$noPadding}
        >
          {props.children}
        </div>
        {props.$icon != null && props.$iconPosition === "right" &&
          <div className={Style.icon}>{props.$icon}</div>
        }
      </div>
    </button>
  );
});

export default Button;