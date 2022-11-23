import Style from "@/styles/components/elements/button.module.scss";
import React, { ButtonHTMLAttributes, ReactNode, useImperativeHandle, useMemo, useReducer, useRef, useState } from "react";
import { attributesWithoutChildren, isReactNode } from "@/utilities/attributes";
import { useForm } from "@/components/elements/form";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  $color?: Color;
  $round?: boolean;
  $outline?: boolean;
  $icon?: ReactNode;
  $iconPosition?: "left" | "right";
  $onClick?: (unlock: (preventFocus?: boolean) => void, event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, $ref) => {
  const ref = useRef<HTMLButtonElement>(null!);
  useImperativeHandle($ref, () => ref.current);
  
  const disabledRef = useRef(false);
  const [disabled, setDisabled] = useReducer((_: boolean, action: boolean) => {
    return disabledRef.current = action;
  }, false);
  const form = useForm();

  const lock = () => {
    setDisabled(true);
  };
  const unlock = () => {
    setDisabled(false);
  };

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.disabled || disabledRef.current) return;
    lock();
    const res = props.$onClick?.(unlock, e);
    if (res == null) {
      unlock();
      return;
    }
  };

  const submitDisabled = props.type === "submit" && props.formMethod !== "delete" && (form.hasError || form.disabled);

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
        {props.$icon != null && props.$iconPosition !== "right" && props.$icon}
        {isReactNode(props.children) ? props.children : <span className={Style.label}>{String(props.children)}</span>}
        {props.$icon != null && props.$iconPosition === "right" && props.$icon}
      </div>
    </button>
  );
});

export default Button;