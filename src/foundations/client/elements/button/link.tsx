"use client";

import { forwardRef, useMemo, type HTMLAttributes } from "react";
import type { UrlObject } from "url";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import Style from "./style.module.scss";
import { attributesWithoutChildren, isNotReactNode } from "../../utilities/attributes";
import type { ButtonOptions } from "../button";
import NextLink from "../link";
import useForm from "../form/context";

export type LinkButtonOptions = ButtonOptions & {
  href?: string | UrlObject;
  as?: string | UrlObject;
  target?: string;
  $disabled?: boolean;
  $form?: boolean;
  $onClick?: (event: React.MouseEvent<HTMLButtonElement>) => (void | boolean | Promise<void>);
};

type OmitAttributes = "onClick" | "color";
export type LinkButtonProps = Omit<HTMLAttributes<HTMLElement>, OmitAttributes> & LinkButtonOptions;

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>((props, ref) => {
  const form = useForm();

  const hrefDisabled = StringUtils.isEmpty(props.href?.toString());
  const submitDisabled = props.$form && (form.hasError || form.disabled);

  const disabled = props.$disabled || hrefDisabled || submitDisabled;

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
    }
    if (props.$onClick?.(e) === false) {
      e.preventDefault();
    }
  };

  const colorClassName = useMemo(() => {
    const color = props.$color || "main";
    if (props.$outline) {
      return `fgc-${color} bdc-${color}`;
    }
    return `c-${color} bdc-${color}`;
  }, [props.$color, props.$outline]);

  return (
    <NextLink
      {...attributesWithoutChildren(props)}
      $disabled={disabled}
      ref={ref}
    >
      <button
        className={`${Style.wrap} ${Style.link}`}
        type="button"
        disabled={disabled}
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
    </NextLink>
  );
});

export default LinkButton;