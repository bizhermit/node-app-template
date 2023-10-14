"use client";

import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { forwardRef, useEffect, useRef, type ForwardedRef, type FunctionComponent, type HTMLAttributes, type ReactElement } from "react";
import type { FormItemProps, FormItemValidation } from "../../$types";
import { StringData } from "../../../../../data-items/string";
import { convertSizeNumToStr } from "../../../../utilities/attributes";
import Resizer from "../../../resizer";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type InputMode = HTMLAttributes<HTMLInputElement>["inputMode"];

export type TextAreaProps<D extends DataItem_String | undefined = undefined> = FormItemProps<string, D, string> & {
  $inputMode?: InputMode;
  $length?: number;
  $preventInputWithinLength?: boolean;
  $minLength?: number;
  $maxLength?: number;
  $charType?: StringCharType;
  $resize?: boolean | "x" | "y" | "xy";
  $width?: number | string;
  $maxWidth?: number | string;
  $minWidth?: number | string;
  $height?: number | string;
  $maxHeight?: number | string;
  $minHeight?: number | string;
  $autoComplete?: string;
};

interface TextAreaFC extends FunctionComponent<TextAreaProps> {
  <D extends DataItem_String | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, TextAreaProps<D>>
  ): ReactElement<any> | null;
}

const TextArea = forwardRef<HTMLDivElement, TextAreaProps>(<
  D extends DataItem_String | undefined = undefined
>(p: TextAreaProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const iref = useRef<HTMLTextAreaElement>(null!);
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem, method, props }) => {
      const isSearch = method === "get";
      return {
        $length: isSearch ? undefined : dataItem.length,
        $minLength: isSearch ? undefined : dataItem.minLength,
        $maxLength: dataItem.maxLength ?? dataItem.length,
        $width: dataItem.width,
        $minWidth: dataItem.minWidth,
        $maxWidth: dataItem.maxWidth,
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

  useEffect(() => {
    if (props.$focusWhenMounted) {
      iref.current?.focus();
    }
  }, []);

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      data-has={StringUtils.isNotEmpty(ctx.value)}
      $mainProps={{
        style: {
          width: convertSizeNumToStr(props.$width),
          maxWidth: convertSizeNumToStr(props.$maxWidth),
          minWidth: convertSizeNumToStr(props.$minWidth),
          height: convertSizeNumToStr(props.$height),
          maxHeight: convertSizeNumToStr(props.$maxHeight),
          minHeight: convertSizeNumToStr(props.$minHeight),
        }
      }}
    >
      <textarea
        ref={iref}
        className={Style.input}
        name={props.name}
        placeholder={ctx.editable ? props.placeholder : ""}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        maxLength={props.$maxLength ?? (props.$preventInputWithinLength ? undefined : props.$length)}
        tabIndex={props.tabIndex}
        defaultValue={ctx.value ?? ""}
        onChange={e => ctx.change(e.target.value)}
        autoComplete={props.$autoComplete ?? "off"}
        inputMode={props.$inputMode}
      />
      {props.$resize &&
        <Resizer direction={typeof props.$resize === "boolean" ? "xy" : props.$resize} />
      }
    </FormItemWrap>
  );
}) as TextAreaFC;

export default TextArea;