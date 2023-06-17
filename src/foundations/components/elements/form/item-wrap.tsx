"use client";

import Style from "#/styles/components/elements/form-items/form-item.module.scss";
import type { FormItemProps } from "#/components/elements/form/$types";
import type { useFormItemContext } from "#/components/elements/form/item-hook";
import { convertHiddenValue, isErrorObject } from "#/components/elements/form/utilities";
import { attributes, attributesWithoutChildren } from "#/components/utilities/attributes";
import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import Tooltip from "#/components/elements/tooltip";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

type FormItemWrapProps = FormItemProps<any, any, any, any> & {
  $context: ReturnType<typeof useFormItemContext<any, any, any, any>>;
  $preventFieldLayout?: boolean;
  $className?: string;
  $clickable?: boolean;
  $mainProps?: HTMLAttributes<HTMLDivElement> & Struct;
  $useHidden?: boolean;
  children?: ReactNode;
};

const inputAttributes = (props: Struct, ...classNames: Array<string | null | undefined>) => {
  const ret = attributesWithoutChildren(props, ...classNames);
  if ("name" in ret) delete ret.name;
  if ("tabIndex" in ret) delete ret.placeholder;
  if ("placeholder" in ret) delete ret.placeholder;
  return ret;
};

export const FormItemWrap = forwardRef<HTMLDivElement, FormItemWrapProps>((props, ref) => {
  const errorNode = props.$context.messageDisplayMode !== "none"
    && props.$context.messageDisplayMode !== "hide"
    && ((props.$context.error !== "" && isErrorObject(props.$context.error)) || props.$context.messageDisplayMode === "bottom")
    && (
      <div
        className={Style.error}
        data-mode={props.$context.messageDisplayMode}
      >
        <span
          className={Style.text}
          data-nowrap={!props.$context.messageWrap}
        >
          {props.$context.error}
        </span>
      </div>
    );

  const attrs = {
    ...attributes(props.$mainProps ?? {}, Style.main, `bdc-${props.$color || "border"}`),
    "data-editable": props.$context.editable,
    "data-field": props.$preventFieldLayout !== true,
    "data-disabled": props.$context.disabled,
    "data-error": props.$context.messageDisplayMode === "none" ? undefined : isErrorObject(props.$context.error),
    "data-clickable": props.$clickable,
  };

  const tagPlaceholder = props.$context.editable && props.$tag != null && props.$tagPosition === "placeholder";

  return (
    <div
      {...inputAttributes(props, Style.wrap, props.$className)}
      ref={ref}
      data-tagpad={tagPlaceholder}
    >
      {props.$tag &&
        <div
          className={`${Style.tag}${props.$color ? ` fgc-${props.$color}` : ""}`}
          data-pos={!tagPlaceholder ? "top" : props.$tagPosition || "top"}
        >
          {props.$tag}
        </div>
      }
      {props.$useHidden && props.name &&
        <input
          name={props.name}
          type="hidden"
          value={convertHiddenValue(props.$context.value)}
        />
      }
      {(props.$context.hasValidator || ("$error" in props)) && props.$context.editable ?
        (props.$context.messageDisplayMode.startsWith("bottom") ?
          <>
            <div {...attrs}>
              {props.children}
            </div>
            {errorNode}
          </>
          : <Tooltip
            {...attrs}
            $disabled={StringUtils.isEmpty(props.$context.error)}
            $popupClassName={Style.tooltip}
          >
            {props.children}
            {errorNode}
          </Tooltip>
        ) :
        <div {...attrs}>
          {props.children}
        </div>
      }
    </div>
  );
});
