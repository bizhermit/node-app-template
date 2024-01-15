"use client";

import { forwardRef, useEffect, useRef, type ForwardedRef, type FunctionComponent, type HTMLAttributes, type ReactElement } from "react";
import StringValidation from "../../../../../data-items/string/validations";
import { isNotEmpty } from "../../../../../objects/string/empty";
import { convertSizeNumToStr } from "../../../../utilities/size";
import Resizer from "../../../resizer";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type InputMode = HTMLAttributes<HTMLInputElement>["inputMode"];

type TextAreaHook<T extends string> = F.ItemHook<T>;

export const useTextBox = <T extends string = string>() => useFormItemBase<TextAreaHook<T>>();

type TextAreaOptions<D extends DataItem_String | undefined = undefined> = {
  $ref?: TextAreaHook<F.VType<string, D, string>> | TextAreaHook<string>;
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

type OmitAttrs = "";
export type TextAreaProps<D extends DataItem_String | undefined = undefined> =
  OverwriteAttrs<Omit<F.ItemProps<string, D, string>, OmitAttrs>, TextAreaOptions<D>>;

interface TextAreaFC extends FunctionComponent<TextAreaProps> {
  <D extends DataItem_String | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, TextAreaProps<D>>
  ): ReactElement<any> | null;
}

const TextArea = forwardRef(<
  D extends DataItem_String | undefined = undefined
>(p: TextAreaProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const iref = useRef<HTMLTextAreaElement>(null!);
  const form = useForm();
  const {
    tabIndex,
    placeholder,
    $inputMode,
    $length,
    $preventInputWithinLength,
    $minLength,
    $maxLength,
    $charType,
    $resize,
    $width,
    $maxWidth,
    $minWidth,
    $height,
    $maxHeight,
    $minHeight,
    $autoComplete,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {
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

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    effect: (v) => {
      if (iref.current) iref.current.value = v || "";
    },
    validations: ({ label }) => {
      const validations: Array<F.Validation<string | null | undefined>> = [];
      if ($length != null) {
        validations.push(v => StringValidation.length(v, $length!, label));
      } else {
        if ($minLength != null) {
          validations.push(v => StringValidation.minLength(v, $minLength!, label));
        }
        if ($maxLength != null) {
          validations.push(v => StringValidation.maxLength(v, $maxLength!, label));
        }
      }
      switch ($charType) {
        case "h-num":
          validations.push(v => StringValidation.halfWidthNumeric(v, label));
          break;
        case "f-num":
          validations.push(v => StringValidation.fullWidthNumeric(v, label));
          break;
        case "num":
          validations.push(v => StringValidation.numeric(v, label));
          break;
        case "h-alpha":
          validations.push(v => StringValidation.halfWidthAlphabet(v, label));
          break;
        case "f-alpha":
          validations.push(v => StringValidation.fullWidthAlphabet(v, label));
          break;
        case "alpha":
          validations.push(v => StringValidation.alphabet(v, label));
          break;
        case "h-alpha-num":
          validations.push(v => StringValidation.halfWidthAlphaNumeric(v, label));
          break;
        case "h-alpha-num-syn":
          validations.push(v => StringValidation.halfWidthAlphaNumericAndSymbols(v, label));
          break;
        case "int":
          validations.push(v => StringValidation.integer(v, label));
          break;
        case "h-katakana":
          validations.push(v => StringValidation.halfWidthKatakana(v, label));
          break;
        case "f-katakana":
          validations.push(v => StringValidation.fullWidthKatakana(v, label));
          break;
        case "katakana":
          validations.push(v => StringValidation.katakana(v, label));
          break;
        case "email":
          validations.push(v => StringValidation.mailAddress(v, label));
          break;
        case "tel":
          validations.push(v => StringValidation.tel(v, label));
          break;
        case "url":
          validations.push(v => StringValidation.url(v, label));
          break;
        default:
          break;
      }
      return validations;
    },
    validationsDeps: [
      $length,
      $minLength,
      $maxLength,
      $charType,
    ],
  });

  const formEnable = !form.disabled && !form.readOnly;

  useEffect(() => {
    if ($focusWhenMounted && formEnable) {
      iref.current?.focus();
    }
  }, [formEnable]);

  if ($ref) {
    $ref.focus = () => iref.current?.focus();
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $ctx={ctx}
      $hasData={isNotEmpty(ctx.value)}
      $mainProps={{
        style: {
          width: convertSizeNumToStr($width),
          maxWidth: convertSizeNumToStr($maxWidth),
          minWidth: convertSizeNumToStr($minWidth),
          height: convertSizeNumToStr($height),
          maxHeight: convertSizeNumToStr($maxHeight),
          minHeight: convertSizeNumToStr($minHeight),
        }
      }}
    >
      <textarea
        ref={iref}
        className={Style.input}
        name={props.name}
        placeholder={ctx.editable ? placeholder : ""}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        maxLength={$maxLength ?? ($preventInputWithinLength ? undefined : $length)}
        tabIndex={tabIndex}
        defaultValue={ctx.value ?? ""}
        onChange={e => ctx.change(e.target.value)}
        autoComplete={$autoComplete ?? "off"}
        inputMode={$inputMode}
      />
      {$resize &&
        <Resizer $direction={typeof $resize === "boolean" ? "xy" : $resize} />
      }
    </FormItemWrap>
  );
}) as TextAreaFC;

export default TextArea;