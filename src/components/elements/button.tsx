import Style from "$/components/elements/button.module.scss";
import React, { ButtonHTMLAttributes, ReactNode, useImperativeHandle, useMemo, useRef, useState } from "react";
import { attributesWithoutChildren } from "@/components/utilities/attributes";
import { useForm } from "@/components/elements/form";
import LabelText from "@/components/elements/label-text";

export type ButtonOptions = {
  $size?: Size;
  $color?: Color;
  $round?: boolean;
  $outline?: boolean;
  $icon?: ReactNode;
  $iconPosition?: "left" | "right";
  $fillLabel?: boolean;
  $fitContent?: boolean;
};

type OmitAttributes = "onClick" | "color";
export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, OmitAttributes> & ButtonOptions & {
  $onClick?: (unlock: (preventFocus?: boolean) => void, event: React.MouseEvent<HTMLButtonElement>) => (void | boolean | Promise<void>);
  $ignoreFormValidation?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, $ref) => {
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
      unlock();
      return res ?? false;
    }
    return false;
  };

  const colorClassName = useMemo(() => {
    const color = props.$color || "main";
    if (props.$outline) {
      return `fgc-${color} bdc-${color}`;
    }
    return `c-${color} bdc-${color}`;
  }, [props.$color, props.$outline]);

  return (
    <button
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      type={props.type ?? "button"}
      disabled={props.disabled || submitDisabled || disabled}
      onClick={click}
      data-size={props.$size || "m"}
      data-wide={!props.$fitContent && props.children != null}
      data-round={props.$round}
    >
      <div
        className={`${Style.main} ${colorClassName}`}
        data-outline={props.$outline}
        data-icon={props.$icon != null && (props.$iconPosition || "left")}
      >
        {props.$icon != null && props.$iconPosition !== "right" &&
          <div className={Style.icon}>{props.$icon}</div>
        }
        <LabelText className={Style.label} data-fill={props.$fillLabel}>{props.children}</LabelText>
        {props.$icon != null && props.$iconPosition === "right" &&
          <div className={Style.icon}>{props.$icon}</div>
        }
      </div>
    </button>
  );
});

export default Button;