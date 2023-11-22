"use client";

import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { forwardRef, useEffect, useRef, type ForwardedRef, type FunctionComponent, type HTMLAttributes, type ReactElement } from "react";
import type { FormItemHook, FormItemProps, FormItemValidation } from "../../$types";
import { StringData } from "../../../../../data-items/string";
import { convertSizeNumToStr } from "../../../../utilities/attributes";
import { CrossIcon } from "../../../icon";
import Resizer from "../../../resizer";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItem, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type InputType = "email" | "password" | "search" | "tel" | "text" | "url";
type InputMode = HTMLAttributes<HTMLInputElement>["inputMode"];

type TextBoxHook = FormItemHook<string | null | undefined>;

export const useTextBox = useFormItem<string | null | undefined>;

export type TextBoxProps<
  D extends DataItem_String | DataItem_Number | undefined = undefined
> =
  FormItemProps<string | number, D, string> & {
    $ref?: TextBoxHook;
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
  <D extends DataItem_String | DataItem_Number | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, TextBoxProps<D>>
  ): ReactElement<any> | null;
}

const TextBox = forwardRef<HTMLDivElement, TextBoxProps>(<
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
    validations: (_, label) => {
      const validations: Array<FormItemValidation<Nullable<string>>> = [];
      if (props.$length != null) {
        validations.push(v => StringData.lengthValidation(v, props.$length!, label));
      } else {
        if (props.$minLength != null) {
          validations.push(v => StringData.minLengthValidation(v, props.$minLength!, label));
        }
        if (props.$maxLength != null) {
          validations.push(v => StringData.maxLengthValidation(v, props.$maxLength!, label));
        }
      }
      switch (props.$charType) {
        case "h-num":
          validations.push(v => StringData.halfWidthNumericValidation(v, label));
          break;
        case "f-num":
          validations.push(v => StringData.fullWidthNumericValidation(v, label));
          break;
        case "num":
          validations.push(v => StringData.numericValidation(v, label));
          break;
        case "h-alpha":
          validations.push(v => StringData.halfWidthAlphabetValidation(v, label));
          break;
        case "f-alpha":
          validations.push(v => StringData.fullWidthAlphabetValidation(v, label));
          break;
        case "alpha":
          validations.push(v => StringData.alphabetValidation(v, label));
          break;
        case "h-alpha-num":
          validations.push(v => StringData.halfWidthAlphaNumericValidation(v, label));
          break;
        case "h-alpha-num-syn":
          validations.push(v => StringData.halfWidthAlphaNumericAndSymbolsValidation(v, label));
          break;
        case "int":
          validations.push(v => StringData.integerValidation(v, label));
          break;
        case "h-katakana":
          validations.push(v => StringData.halfWidthKatakanaValidation(v, label));
          break;
        case "f-katakana":
          validations.push(v => StringData.fullWidthKatakanaValidation(v, label));
          break;
        case "katakana":
          validations.push(v => StringData.katakanaValidation(v, label));
          break;
        case "email":
          validations.push(v => StringData.mailAddressValidation(v, label));
          break;
        case "tel":
          validations.push(v => StringData.telValidation(v, label));
          break;
        case "url":
          validations.push(v => StringData.urlValidation(v, label));
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

  useEffect(() => {
    if (props.$focusWhenMounted) {
      iref.current?.focus();
    }
  }, []);

  if (props.$ref) {
    props.$ref.focus = () => iref.current?.focus();
    props.$ref.getValue = () => ctx.valueRef.current;
    props.$ref.setValue = (v) => ctx.change(v, false);
    props.$ref.setDefaultValue = () => ctx.change(props.$defaultValue, false);
    props.$ref.clear = () => ctx.change(undefined, false);
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
        data-button={ctx.editable && props.$hideClearButton !== true}
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
}) as TextBoxFC;

export default TextBox;