import Style from "@/styles/components/elements/button.module.scss";
import React, { ButtonHTMLAttributes, ReactNode, useImperativeHandle, useMemo, useRef, useState } from "react";
import { attributesWithoutChildren, isReactNode } from "@/utilities/attributes";
import { useForm } from "@/components/elements/form";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  $color?: Color;
  $round?: boolean;
  $outline?: boolean;
  $icon?: ReactNode;
  $iconPosition?: "left" | "right";
  $fillLabel?: boolean;
  $onClick?: (unlock: (preventFocus?: boolean) => void, event: React.MouseEvent<HTMLButtonElement>) => void;
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

  const submitDisabled = props.$ignoreFormValidation !== true
  && props.type === "submit"
  && props.formMethod !== "delete"
  && (form.hasError || form.disabled)
  ;

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.disabled || disabledRef.current || submitDisabled) return;
    lock();
    const res = props.$onClick?.(unlock, e);
    if (res == null) {
      unlock();
      return;
    }
  };

  const colorClassName = useMemo(() => {
    const color = props.$color || "main";
    if (props.$outline) {
      return `bgc-pure fgc-${color}_r bdc-${color}`;
    }
    return `c-${color}`;
  }, [props.$color, props.$outline]);

  return (
    <button
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      disabled={props.disabled || submitDisabled || disabled}
      onClick={click}
    >
      <div
        className={`${Style.main} ${colorClassName}`}
        data-round={props.$round}
        data-outline={props.$outline}
        data-icon={props.$icon != null && (props.$iconPosition || "left")}
      >
        {props.$icon != null && props.$iconPosition !== "right" &&
          <div className={Style.icon}>{props.$icon}</div>
        }
        {isReactNode(props.children) ? props.children :
          <span
            className={Style.label}
            data-fill={props.$fillLabel}
          >
            {String(props.children)}
          </span>
        }
        {props.$icon != null && props.$iconPosition === "right" &&
          <div className={Style.icon}>{props.$icon}</div>
        }
      </div>
    </button>
  );
});

export default Button;