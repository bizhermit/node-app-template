"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import type { FormItemProps } from "../$types";
import joinCn from "../../../utilities/join-class-name";
import Tooltip from "../../tooltip";
import { convertHiddenValue, isErrorObject } from "../utilities";
import Style from "./form-item.module.scss";
import type { useFormItemContext } from "./hooks";

type FormItemWrapOptions = {
  $ctx: ReturnType<typeof useFormItemContext<any, any, any, any>>;
  $preventFieldLayout?: boolean;
  $clickable?: boolean;
  $mainProps?: HTMLAttributes<HTMLDivElement> & Struct;
  $useHidden?: boolean;
  $hideWhenNoError?: boolean;
  children?: ReactNode;
};

type FormItemWrapProps = OverwriteAttrs<FormItemProps<any, any, any, any>, FormItemWrapOptions>;

const rmAttrs = (props: { [v: string]: any } | null | undefined) => {
  const p: { [v: string]: any } = {};
  if (props) {
    Object.keys(props).forEach(k => {
      if (k[0] !== "$") p[k] = props[k];
    });
  }
  return p;
};

export const FormItemWrap = forwardRef<HTMLDivElement, FormItemWrapProps>(({
  name,
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tabIndex,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  placeholder,
  $ctx,
  $preventFieldLayout,
  $clickable,
  $mainProps,
  $useHidden,
  $hideWhenNoError,
  $tag,
  $tagPosition,
  $messagePosition,
  $color,
  children,
  ...props
}, ref) => {
  const errorNode = $ctx.messageDisplayMode !== "none"
    && $ctx.messageDisplayMode !== "hide"
    && $ctx.editable
    && (($ctx.error !== "" && isErrorObject($ctx.error)) || $ctx.messageDisplayMode === "bottom")
    && (
      <div
        className={Style.error}
        data-mode={$ctx.messageDisplayMode}
      >
        <span
          className={Style.text}
          data-nowrap={!$ctx.messageWrap}
        >
          {$ctx.error}
        </span>
      </div>
    );

  const attrs = {
    ...rmAttrs($mainProps),
    className: joinCn(Style.main, $mainProps?.className),
    "data-editable": $ctx.editable,
    "data-field": $preventFieldLayout !== true,
    "data-disabled": $ctx.disabled,
    "data-error": $ctx.messageDisplayMode === "none" ? undefined : isErrorObject($ctx.error),
    "data-clickable": $clickable,
  };

  const tagPlaceholder = $ctx.editable && $tag != null && $tagPosition === "placeholder";

  return (
    <div
      {...rmAttrs(props)}
      className={joinCn(Style.wrap, className)}
      ref={ref}
      data-color={$color}
      data-tagpad={tagPlaceholder}
      data-hidden={$hideWhenNoError ? !isErrorObject($ctx.error) || $messagePosition === "none" : undefined}
    >
      {$tag &&
        <div
          className={Style.tag}
          data-pos={!tagPlaceholder ? "top" : $tagPosition || "top"}
        >
          {$tag}
        </div>
      }
      {$useHidden && name &&
        <input
          name={name}
          type="hidden"
          value={convertHiddenValue($ctx.value)}
        />
      }
      {$ctx.messageDisplayMode === "tooltip" ?
        <Tooltip
          {...attrs}
          $disabled={!errorNode}
          $popupClassName={Style.tooltip}
        >
          {children}
          {errorNode}
        </Tooltip> :
        <>
          <div {...attrs}>
            {children}
          </div>
          {errorNode}
        </>
      }
    </div>
  );
});
