import Style from "@/styles/components/elements/button.module.scss";
import React, { ButtonHTMLAttributes, ReactNode, useImperativeHandle, useMemo, useRef, useState } from "react";
import { attributesWithoutChildren, isReactNode } from "@/utilities/attributes";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  $color?: Color;
  $round?: boolean;
  $outline?: boolean;
  $icon?: ReactNode;
  $iconPosition?: "left" | "right";
  onClick?: (unlock: (preventFocus?: boolean) => void, event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, $ref) => {
  const ref = useRef<HTMLButtonElement>(null!);
  useImperativeHandle($ref, () => ref.current);
  
  const colorClassName = useMemo(() => {
    const color = props.$color || "main";
    if (props.$outline) {
      return `bgc-pure fgc-${color}_r bdc-${color}`;
    }
    return `c-${color}`;
  }, [props.$color, props.$outline]);

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(() => {}, e);
  };

  return (
    <button
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
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