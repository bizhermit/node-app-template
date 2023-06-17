"use client";

import Style from "#/styles/components/elements/button.module.scss";
import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { attributesWithoutChildren } from "#/components/utilities/attributes";
import Text from "#/components/elements/text";
import type { ButtonOptions } from "#/components/elements/button";
import type { UrlObject } from "url";
import NextLink from "#/components/elements/link";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import useForm from "#/components/elements/form/context";

export type LinkButtonOptions = ButtonOptions & {
  href?: string | UrlObject;
  as?: string | UrlObject;
  target?: string;
  $disabled?: boolean;
  $form?: boolean;
};

type OmitAttributes = "onClick" | "color";
export type LinkButtonProps = Omit<HTMLAttributes<HTMLElement>, OmitAttributes> & LinkButtonOptions;

const LinkButton = forwardRef<HTMLElement, LinkButtonProps>((props, ref) => {
  const form = useForm();

  const hrefDisabled = StringUtils.isEmpty(props.href?.toString());
  const submitDisabled = props.$form && (form.hasError || form.disabled);

  const disabled = props.$disabled || hrefDisabled || submitDisabled;

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
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
          <Text className={Style.label} data-fill={props.$fillLabel}>{props.children}</Text>
          {props.$icon != null && props.$iconPosition === "right" &&
            <div className={Style.icon}>{props.$icon}</div>
          }
        </div>
      </button>
    </NextLink>
  );
});

export default LinkButton;