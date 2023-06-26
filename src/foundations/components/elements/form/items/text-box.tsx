"use client";

import Style from "#/styles/components/elements/form/items/text-box.module.scss";
import { CrossIcon } from "#/components/elements/icon";
import Resizer from "#/components/elements/resizer";
import { convertSizeNumToStr } from "#/components/utilities/attributes";
import { StringData } from "#/data-items/string";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { type ForwardedRef, forwardRef, type FunctionComponent, type ReactElement, useRef, type HTMLAttributes } from "react";
import type { FormItemProps, FormItemValidation } from "#/components/elements/form/$types";
import useForm from "#/components/elements/form/context";
import { useDataItemMergedProps, useFormItemContext } from "#/components/elements/form/item-hook";
import { convertDataItemValidationToFormItemValidation } from "#/components/elements/form/utilities";
import { FormItemWrap } from "#/components/elements/form/item-wrap";

type InputType = "email" | "password" | "search" | "tel" | "text" | "url";
type InputMode = HTMLAttributes<HTMLInputElement>["inputMode"];

export type TextBoxProps<D extends DataItem_String | DataItem_Number | undefined = undefined> = FormItemProps<string | number, D, string> & {
  $type?: InputType;
  $inputMode?: InputMode;
  $length?: number;
  $preventInputWithinLength?: boolean;
  $minLength?: number;
  $maxLength?: number;
  $charType?: StringCharType;
  $round?: boolean;
  $resize?: boolean;
  $width?: number | string;
  $maxWidth?: number | string;
  $minWidth?: number | string;
  $hideClearButton?: boolean;
  $autoComplete?: string;
  $align?: "left" | "center" | "right";
};

interface TextBoxFC extends FunctionComponent<TextBoxProps> {
  <D extends DataItem_String | DataItem_Number | undefined = undefined>(attrs: TextBoxProps<D>, ref?: ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const TextBox: TextBoxFC = forwardRef<HTMLDivElement, TextBoxProps>(<
  D extends DataItem_String | DataItem_Number | undefined = undefined
>(p: TextBoxProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const iref = useRef<HTMLInputElement>(null!);
  const props = useDataItemMergedProps(form, p, {
    under: ({ props, dataItem, method }) => {
      const isSearch = method === "get";
      switch (dataItem.type) {
        case "number":
          return {
            $minLength: isSearch ? undefined : dataItem.minLength,
            $maxLength: dataItem.maxLength,
            $charType: "h-num" as StringCharType,
            $align: dataItem.align,
            $width: dataItem.width,
            $minWidth: dataItem.minWidth,
            $maxWidth: dataItem.maxWidth,
            $inputMode: ((dataItem.float ?? 0) > 0 ? "decimal" : "numeric") as InputMode,
          };
        default:
          return {
            $length: isSearch ? undefined : dataItem.length,
            $minLength: isSearch ? undefined : dataItem.minLength,
            $maxLength: dataItem.maxLength ?? dataItem.length,
            $charType: dataItem.charType,
            $align: dataItem.align,
            $width: dataItem.width,
            $minWidth: dataItem.minWidth,
            $maxWidth: dataItem.maxWidth,
            $type: (() => {
              switch (props.$charType ?? dataItem.charType) {
                case "email":
                  return "email";
                case "tel":
                  return "tel";
                case "url":
                  return "url";
                default:
                  return undefined;
              }
            })() as InputType,
            $inputMode: (() => {
              if (dataItem.inputMode) return dataItem.inputMode;
              switch (props.$charType ?? dataItem.charType) {
                case "h-num":
                case "int":
                  return "numeric";
                case "email":
                  return "email";
                case "tel":
                  return "tel";
                case "url":
                  return "url";
                default:
                  return undefined;
              }
            })() as InputMode,
          };
      }
    },
    over: ({ dataItem, props }) => {
      switch (dataItem.type) {
        case "number":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => Number(v))),
          };
        default:
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
          };
      }
    },
  });

  const ctx = useFormItemContext(form, props, {
    effect: (v) => {
      if (iref.current) iref.current.value = v || "";
    },
    validations: () => {
      const validations: Array<FormItemValidation<Nullable<string>>> = [];
      if (props.$length != null) {
        validations.push(v => StringData.lengthValidation(v, props.$length!));
      } else {
        if (props.$minLength != null) {
          validations.push(v => StringData.minLengthValidation(v, props.$minLength!));
        }
        if (props.$maxLength != null) {
          validations.push(v => StringData.maxLengthValidation(v, props.$maxLength!));
        }
      }
      switch (props.$charType) {
        case "h-num":
          validations.push(v => StringData.halfWidthNumericValidation(v));
          break;
        case "f-num":
          validations.push(v => StringData.fullWidthNumericValidation(v));
          break;
        case "num":
          validations.push(v => StringData.numericValidation(v));
          break;
        case "h-alpha":
          validations.push(v => StringData.halfWidthAlphabetValidation(v));
          break;
        case "f-alpha":
          validations.push(v => StringData.fullWidthAlphabetValidation(v));
          break;
        case "alpha":
          validations.push(v => StringData.alphabetValidation(v));
          break;
        case "h-alpha-num":
          validations.push(v => StringData.halfWidthAlphaNumericValidation(v));
          break;
        case "h-alpha-num-syn":
          validations.push(v => StringData.halfWidthAlphaNumericAndSymbolsValidation(v));
          break;
        case "int":
          validations.push(v => StringData.integerValidation(v));
          break;
        case "h-katakana":
          validations.push(v => StringData.halfWidthKatakanaValidation(v));
          break;
        case "f-katakana":
          validations.push(v => StringData.fullWidthKatakanaValidation(v));
          break;
        case "katakana":
          validations.push(v => StringData.katakanaValidation(v));
          break;
        case "email":
          validations.push(v => StringData.mailAddressValidation(v));
          break;
        case "tel":
          validations.push(v => StringData.telValidation(v));
          break;
        case "url":
          validations.push(v => StringData.urlValidation(v));
          break;
        default:
          break;
      }
      return validations;
    },
    validationsDeps: [
      props.$length,
      props.$minLength,
      props.$maxLength,
      props.$charType,
    ],
  });

  const clear = () => {
    if (!ctx.editable) return;
    ctx.change(undefined);
    if (iref.current) iref.current.value = "";
  };

  const hasData = StringUtils.isNotEmpty(ctx.value);

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
      }}
    >
      <input
        ref={iref}
        className={Style.input}
        name={props.name}
        type={props.$type || "text"}
        placeholder={ctx.editable ? props.placeholder : ""}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        maxLength={props.$maxLength ?? (props.$preventInputWithinLength ? undefined : props.$length)}
        tabIndex={props.tabIndex}
        defaultValue={ctx.value ?? ""}
        onChange={e => ctx.change(e.target.value)}
        data-round={props.$round}
        data-clear={ctx.editable && props.$hideClearButton !== true}
        data-align={props.$align}
        autoComplete={props.$autoComplete ?? "off"}
        inputMode={props.$inputMode}
      />
      {ctx.editable && props.$hideClearButton !== true &&
        <div
          className={Style.button}
          onClick={clear}
          data-disabled={!hasData}
          data-round={props.$round}
        >
          <CrossIcon />
        </div>
      }
      {props.$resize && <Resizer direction="x" />}
    </FormItemWrap>
  );
});

export default TextBox;