"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import joinCn from "../../../utilities/join-class-name";
import Tooltip from "../../tooltip";
import { convertHiddenValue, isErrorObject } from "../utilities";
import Style from "./form-item.module.scss";
import type { useFormItemContext } from "./hooks";

type FormItemWrapOptions = {
  $ctx: ReturnType<typeof useFormItemContext<any, any, any, any>>["ctx"];
  $preventFieldLayout?: boolean;
  $clickable?: boolean;
  $mainProps?: HTMLAttributes<HTMLDivElement> & { [v: `data-${string}`]: string | number | boolean | null | undefined };
  $useHidden?: boolean;
  $hideWhenNoError?: boolean;
  $round?: boolean;
  $hasData?: boolean;
  children?: ReactNode;
};

type FormItemWrapProps = OverwriteAttrs<ReturnType<typeof useFormItemContext>["props"], FormItemWrapOptions>;

export const FormItemWrap = forwardRef<HTMLDivElement, FormItemWrapProps>(({
  name,
  className,
  // tabIndex,
  // placeholder,
  $ctx,
  $preventFieldLayout,
  $clickable,
  $mainProps,
  $useHidden,
  $hideWhenNoError,
  $tag,
  $tagPosition,
  $color,
  $round,
  $hasData,
  // $bind,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $defaultValue,
  children,
  ...props
}, ref) => {
  const errorNode = $ctx.messagePosition !== "none"
    && $ctx.messagePosition !== "hide"
    && $ctx.editable
    && (($ctx.error !== "" && isErrorObject($ctx.error)) || $ctx.messagePosition === "bottom")
    && (
      <div
        className={Style.error}
        data-mode={$ctx.messagePosition}
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
    ...$mainProps,
    className: joinCn(Style.main, $mainProps?.className),
    "data-editable": $ctx.editable,
    "data-field": $preventFieldLayout !== true,
    "data-disabled": $ctx.disabled,
    "data-error": $ctx.messagePosition === "none" ? undefined : isErrorObject($ctx.error),
    "data-clickable": $clickable,
  };

  const tagPlaceholder = $ctx.editable && $tag != null && $tagPosition === "placeholder";

  return (
    <div
      {...props}
      className={joinCn(Style.wrap, className)}
      ref={ref}
      data-color={$color}
      data-round={$round}
      data-has={$hasData}
      data-tagpad={tagPlaceholder}
      data-hidden={$hideWhenNoError ? !isErrorObject($ctx.error) || $ctx.messagePosition === "none" : undefined}
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
      {$ctx.messagePosition === "tooltip" ?
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
