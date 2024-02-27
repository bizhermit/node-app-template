"use client";

import { forwardRef, useEffect, useRef, type ForwardedRef, type FunctionComponent, type HTMLAttributes, type ReactElement } from "react";
import StringValidation from "../../../../../data-items/string/validations";
import { isNotEmpty } from "../../../../../objects/string/empty";
import { convertSizeNumToStr } from "../../../../utilities/size";
import { CrossIcon } from "../../../icon";
import Resizer from "../../../resizer";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type InputType = "email" | "password" | "search" | "tel" | "text" | "url";
type InputMode = HTMLAttributes<HTMLInputElement>["inputMode"];

type TextBoxHook<T extends string | number> = F.ItemHook<T>;

export const useTextBox = <T extends string | number = string>() => useFormItemBase<F.ItemHook<T>>();

type TextBoxOptions<D extends DataItem_String | DataItem_Number | undefined = undefined> = {
  $ref?: TextBoxHook<F.VType<string | number, D, string>> | TextBoxHook<string | number>;
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

export type TextBoxProps<
  D extends DataItem_String | DataItem_Number | undefined = undefined
> = OverwriteAttrs<F.ItemProps<string | number, D, string, {}>, TextBoxOptions<D>>;

interface TextBoxFC extends FunctionComponent<TextBoxProps> {
  <D extends DataItem_String | DataItem_Number | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, TextBoxProps<D>>
  ): ReactElement<any> | null;
}

const TextBox = forwardRef(<
  D extends DataItem_String | DataItem_Number | undefined = undefined
>(p: TextBoxProps<D>, r: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const iref = useRef<HTMLInputElement>(null!);
  const {
    tabIndex,
    placeholder,
    $type,
    $inputMode,
    $length,
    $preventInputWithinLength,
    $minLength,
    $maxLength,
    $charType,
    $round,
    $resize,
    $width,
    $maxWidth,
    $minWidth,
    $hideClearButton,
    $autoComplete,
    $align,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {
    under: ({ props, dataItem, method }) => {
      const isGet = method === "get";
      switch (dataItem.type) {
        case "number":
          return {
            $minLength: isGet ? undefined : dataItem.minLength,
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
            $length: isGet ? undefined : dataItem.length,
            $minLength: isGet ? undefined : dataItem.minLength,
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

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    effect: (v) => {
      if (iref.current) iref.current.value = v || "";
    },
    validations: ({ label }) => {
      const validations: Array<F.Validation<string | null | undefined>> = [];
      if ($length != null) {
        validations.push(v => StringValidation.length(v, $length, label));
      } else {
        if ($minLength != null) {
          validations.push(v => StringValidation.minLength(v, $minLength, label));
        }
        if ($maxLength != null) {
          validations.push(v => StringValidation.maxLength(v, $maxLength, label));
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

  const clear = () => {
    if (!ctx.editable) return;
    ctx.change(undefined);
    if (iref.current) iref.current.value = "";
  };

  const hasData = isNotEmpty(ctx.value);
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
      ref={r}
      $ctx={ctx}
      $round={$round}
      $hasData={hasData}
      $mainProps={{
        style: {
          width: convertSizeNumToStr($width),
          maxWidth: convertSizeNumToStr($maxWidth),
          minWidth: convertSizeNumToStr($minWidth),
        },
      }}
    >
      <input
        ref={iref}
        className={Style.input}
        name={props.name}
        type={$type || "text"}
        placeholder={ctx.editable ? placeholder : ""}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        maxLength={$maxLength ?? ($preventInputWithinLength ? undefined : $length)}
        tabIndex={tabIndex}
        defaultValue={ctx.value ?? ""}
        onChange={e => ctx.change(e.target.value)}
        data-round={$round}
        data-button={ctx.editable && $hideClearButton !== true}
        data-align={$align}
        autoComplete={$autoComplete ?? "off"}
        inputMode={$inputMode}
      />
      {ctx.editable && $hideClearButton !== true &&
        <div
          className={Style.button}
          onClick={clear}
          data-disabled={!hasData}
          data-round={$round}
        >
          <CrossIcon />
        </div>
      }
      {$resize && <Resizer $direction="x" />}
    </FormItemWrap>
  );
}) as TextBoxFC;

export default TextBox;
