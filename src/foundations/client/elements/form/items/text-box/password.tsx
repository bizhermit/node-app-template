"use client";

import { forwardRef, useEffect, useRef, useState, type ForwardedRef, type FunctionComponent, type HTMLAttributes, type ReactElement } from "react";
import StringValidation from "../../../../../data-items/string/validations";
import { isNotEmpty } from "../../../../../objects/string/empty";
import { CircleFillIcon, CircleIcon, CrossIcon } from "../../../../elements/icon";
import Resizer from "../../../../elements/resizer";
import { includeElement } from "../../../../utilities/parent-child";
import { convertSizeNumToStr } from "../../../../utilities/size";
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
type PasswordBoxHook<T extends string | number> = F.ItemHook<T, PasswordBoxHookAddon>;

export const usePasswordBox = <T extends string | number = string>() => useFormItemBase<PasswordBoxHook<T>>(e => {
  return {
    toggleMask: () => {
      throw e;
    },
  };
});

type PasswordBoxOptions<D extends DataItem_String | undefined = undefined> = Pick<TextBoxProps<D>,
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
  $ref?: PasswordBoxHook<F.VType<string | number, D, string>> | PasswordBoxHook<string | number>;
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

export type PasswordBoxProps<D extends DataItem_String | undefined = undefined> =
  OverwriteAttrs<F.ItemProps<string, D, string>, PasswordBoxOptions<D>>;

interface PasswordBoxFC extends FunctionComponent<PasswordBoxProps> {
  <D extends DataItem_String | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, PasswordBoxProps<D>>
  ): ReactElement<any> | null;
}

const PasswordBox = forwardRef(<
  D extends DataItem_String | undefined = undefined
>(p: PasswordBoxProps<D>, r: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const iref = useRef<HTMLInputElement>(null!);
  const {
    placeholder,
    tabIndex,
    $minLength,
    $maxLength,
    $round,
    $resize,
    $width,
    $maxWidth,
    $minWidth,
    $hideClearButton,
    $autoComplete,
    $align,
    $charType,
    $inputMode,
    $hideToggleButton,
    $preventInputWithinLength,
    $preventBlurToggle,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {
    under: ({ dataItem, method, props }) => {
      const isGet = method === "get";
      return {
        $length: isGet ? undefined : dataItem.length,
        $minLength: isGet ? undefined : dataItem.minLength,
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

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    effect: (v) => {
      if (iref.current) iref.current.value = v || "";
    },
    validations: ({ label }) => {
      const validations: Array<F.Validation<string | null | undefined>> = [];
      if ($minLength != null) {
        validations.push(v => StringValidation.minLength(v, $minLength!, label));
      }
      if ($maxLength != null) {
        validations.push(v => StringValidation.maxLength(v, $maxLength!, label));
      }
      switch ($charType) {
        case "h-num":
          validations.push(v => StringValidation.halfWidthNumeric(v, label));
          break;
        case "h-alpha":
          validations.push(v => StringValidation.halfWidthAlphabet(v, label));
          break;
        case "h-alpha-num":
          validations.push(v => StringValidation.halfWidthAlphaNumeric(v, label));
          break;
        case "h-alpha-num-syn":
          validations.push(v => StringValidation.halfWidthAlphaNumericAndSymbols(v, label));
          break;
        default:
          break;
      }
      return validations;
    },
    validationsDeps: [
      $minLength,
      $maxLength,
      $charType,
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
    if ($preventBlurToggle) return;
    if (includeElement(e.currentTarget, e.relatedTarget)) return;
    setType("password");
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
    $ref.toggleMask = () => toggle();
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
        onBlur: blur,
      }}
    >
      <input
        ref={iref}
        className={Style.input}
        name={props.name}
        type={type}
        placeholder={ctx.editable ? placeholder : ""}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        maxLength={$preventInputWithinLength ? undefined : $maxLength}
        tabIndex={tabIndex}
        defaultValue={ctx.value ?? ""}
        onChange={e => ctx.change(e.target.value)}
        data-round={$round}
        data-button={ctx.editable && ($hideClearButton !== true || $hideToggleButton !== true)}
        data-align={$align}
        autoComplete={$autoComplete ?? "off"}
        inputMode={$inputMode}
      />
      {ctx.editable && $hideClearButton !== true &&
        <div
          className={Style.button}
          onClick={clear}
          data-disabled={!hasData}
          data-round={$hideToggleButton ? $round : undefined}
          tabIndex={-1}
        >
          <CrossIcon />
        </div>
      }
      {ctx.editable && $hideToggleButton !== true &&
        <div
          className={Style.button}
          onClick={toggle}
          data-round={$round}
          tabIndex={-1}
        >
          {type === "text" ? <CircleIcon /> : <CircleFillIcon />}
        </div>
      }
      {$resize && <Resizer $direction="x" />}
    </FormItemWrap>
  );
}) as PasswordBoxFC;

export default PasswordBox;