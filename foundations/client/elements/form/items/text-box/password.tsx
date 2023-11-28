"use client";

import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { forwardRef, useEffect, useRef, useState, type ForwardedRef, type FunctionComponent, type HTMLAttributes, type ReactElement } from "react";
import type { FormItemHook, FormItemProps, FormItemValidation, ValueType } from "../../$types";
import { StringData } from "../../../../../data-items/string";
import { CircleFillIcon, CircleIcon, CrossIcon } from "../../../../elements/icon";
import Resizer from "../../../../elements/resizer";
import { convertSizeNumToStr } from "../../../../utilities/attributes";
import { includeElement } from "../../../../utilities/parent-child";
import useForm from "../../context";
import { FormItemWrap } from "../../items/common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../../items/hooks";
import type { TextBoxProps } from "../../items/text-box";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import Style from "./index.module.scss";

type InputMode = Extract<HTMLAttributes<HTMLInputElement>["inputMode"],
  | "email"
  | "url"
  | "numeric"
  | "text"
  | "none"
>;

type PasswordBoxHookAddon = {
  toggleMask: () => void;
};
type PasswordBoxHook<T extends string | number> = FormItemHook<T, PasswordBoxHookAddon>;

export const usePasswordBox = <T extends string | number = string>() => useFormItemBase<PasswordBoxHook<T>>(e => {
  return {
    toggleMask: () => {
      throw e;
    },
  };
});

export type PasswordBoxProps<D extends DataItem_String | undefined = undefined> = FormItemProps<string, D, string> & Pick<TextBoxProps<D>,
  | "$minLength"
  | "$maxLength"
  | "$round"
  | "$resize"
  | "$width"
  | "$maxWidth"
  | "$minWidth"
  | "$hideClearButton"
  | "$autoComplete"
  | "$align"
> & {
  $ref?: PasswordBoxHook<ValueType<string | number, D, string>> | PasswordBoxHook<string | number>;
  $charType?: Extract<StringCharType,
    | "h-num"
    | "h-alpha"
    | "h-alpha-num"
    | "h-alpha-num-syn"
  >;
  $inputMode?: InputMode;
  $hideToggleButton?: boolean;
  $preventInputWithinLength?: boolean;
  $preventBlurToggle?: boolean;
};

interface PasswordBoxFC extends FunctionComponent<PasswordBoxProps> {
  <D extends DataItem_String | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, PasswordBoxProps<D>>
  ): ReactElement<any> | null;
}

const PasswordBox = forwardRef<HTMLDivElement, PasswordBoxProps>(<
  D extends DataItem_String | undefined = undefined
>(p: PasswordBoxProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const iref = useRef<HTMLInputElement>(null!);
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem, method, props }) => {
      const isSearch = method === "get";
      return {
        $length: isSearch ? undefined : dataItem.length,
        $minLength: isSearch ? undefined : dataItem.minLength,
        $maxLength: dataItem.maxLength ?? dataItem.length,
        $charType: (() => {
          switch (dataItem.charType) {
            case "h-num":
            case "h-alpha":
            case "h-alpha-num":
            case "h-alpha-num-syn":
              return dataItem.charType;
            default:
              return "h-alpha-num-sync";
          }
        })() as PasswordBoxProps["$charType"],
        $inputMode: (() => {
          if (dataItem.inputMode) return dataItem.inputMode;
          switch (props.$charType ?? dataItem.charType) {
            case "h-num":
              return "numeric";
            case "h-alpha":
            case "h-alpha-num":
            case "h-alpha-num-syn":
              return "email";
            default:
              return "email";
          }
        })() as InputMode,
        $align: dataItem.align,
        $width: dataItem.width,
        $minWidth: dataItem.minWidth,
        $maxWidth: dataItem.maxWidth,
      };
    },
    over: ({ dataItem, props }) => {
      return {
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
      };
    },
  });

  const ctx = useFormItemContext(form, props, {
    effect: (v) => {
      if (iref.current) iref.current.value = v || "";
    },
    validations: (_, label) => {
      const validations: Array<FormItemValidation<Nullable<string>>> = [];
      if (props.$minLength != null) {
        validations.push(v => StringData.minLengthValidation(v, props.$minLength!, label));
      }
      if (props.$maxLength != null) {
        validations.push(v => StringData.maxLengthValidation(v, props.$maxLength!, label));
      }
      switch (props.$charType) {
        case "h-num":
          validations.push(v => StringData.halfWidthNumericValidation(v, label));
          break;
        case "h-alpha":
          validations.push(v => StringData.halfWidthAlphabetValidation(v, label));
          break;
        case "h-alpha-num":
          validations.push(v => StringData.halfWidthAlphaNumericValidation(v, label));
          break;
        case "h-alpha-num-syn":
          validations.push(v => StringData.halfWidthAlphaNumericAndSymbolsValidation(v, label));
          break;
        default:
          break;
      }
      return validations;
    },
    validationsDeps: [
      props.$minLength,
      props.$maxLength,
      props.$charType,
    ],
  });

  const [type, setType] = useState<"text" | "password">("password");

  const clear = () => {
    if (!ctx.editable) return;
    ctx.change(undefined);
    if (iref.current) iref.current.value = "";
  };

  const toggle = () => {
    if (!ctx.editable) return;
    setType(c => c === "text" ? "password" : "text");
  };

  const blur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (props.$preventBlurToggle) return;
    if (includeElement(e.currentTarget, e.relatedTarget)) return;
    setType("password");
  };

  const hasData = StringUtils.isNotEmpty(ctx.value);

  useEffect(() => {
    if (props.$focusWhenMounted) {
      iref.current?.focus();
    }
  }, []);

  if (props.$ref) {
    props.$ref.focus = () => iref.current?.focus();
    props.$ref.toggleMask = () => toggle();
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      data-round={props.$round}
      data-has={hasData}
      $mainProps={{
        style: {
          width: convertSizeNumToStr(props.$width),
          maxWidth: convertSizeNumToStr(props.$maxWidth),
          minWidth: convertSizeNumToStr(props.$minWidth),
        },
        onBlur: blur,
      }}
    >
      <input
        ref={iref}
        className={Style.input}
        name={props.name}
        type={type}
        placeholder={ctx.editable ? props.placeholder : ""}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        maxLength={props.$preventInputWithinLength ? undefined : props.$maxLength}
        tabIndex={props.tabIndex}
        defaultValue={ctx.value ?? ""}
        onChange={e => ctx.change(e.target.value)}
        data-round={props.$round}
        data-button={ctx.editable && (props.$hideClearButton !== true || props.$hideToggleButton !== true)}
        data-align={props.$align}
        autoComplete={props.$autoComplete ?? "off"}
        inputMode={props.$inputMode}
      />
      {ctx.editable && props.$hideClearButton !== true &&
        <div
          className={Style.button}
          onClick={clear}
          data-disabled={!hasData}
          data-round={props.$hideToggleButton ? props.$round : undefined}
          tabIndex={-1}
        >
          <CrossIcon />
        </div>
      }
      {ctx.editable && props.$hideToggleButton !== true &&
        <div
          className={Style.button}
          onClick={toggle}
          data-round={props.$round}
          tabIndex={-1}
        >
          {type === "text" ? <CircleIcon /> : <CircleFillIcon />}
        </div>
      }
      {props.$resize && <Resizer direction="x" />}
    </FormItemWrap>
  );
}) as PasswordBoxFC;

export default PasswordBox;