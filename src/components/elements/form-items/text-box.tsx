import Style from "$/components/elements/form-items/text-box.module.scss";
import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import Resizer from "@/components/elements/resizer";
import { convertSizeNumToStr } from "@/components/utilities/attributes";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import React, { useRef } from "react";
import { VscClose } from "react-icons/vsc";

export type TextBoxProps = FormItemProps<string> & {
  $type?: "email" | "password" | "search" | "tel" | "text" | "url";
  $length?: number;
  $preventInputWithinLength?: boolean;
  $maxLength?: number;
  $minLength?: number;
  $charType?: "int"
  | "h-num"
  | "f-num"
  | "num"
  | "h-alpha"
  | "f-alpha"
  | "alpha"
  | "h-alpha-num"
  | "h-alpha-num-syn"
  | "h-katakana"
  | "f-katakana"
  | "katakana";
  $round?: boolean;
  $resize?: boolean;
  $width?: number | string;
  $maxWidth?: number | string;
  $minWidth?: number | string;
  $hideClearButton?: boolean;
  $autoComplete?: string;
};

const TextBox = React.forwardRef<HTMLDivElement, TextBoxProps>((props, ref) => {
  const iref = useRef<HTMLInputElement>(null!);

  const form = useForm(props, {
    effect: (v) => {
      if (iref.current) iref.current.value = v || "";
    },
    validations: () => {
      const validations: Array<FormItemValidation<Nullable<string>>> = [];
      if (props.$length != null) {
        validations.push(v => {
          if (v != null && v.length === props.$length) return "";
          return `${props.$length}文字で入力してください。`;
        });
      } else {
        if (props.$maxLength != null) {
          validations.push(v => {
            if (v != null && v.length > props.$maxLength!) return `${props.$maxLength}文字以内で入力してください。`;
            return "";
          });
        }
        if (props.$minLength != null) {
          validations.push(v => {
            if (v == null || v.length < props.$minLength!) return `${props.$minLength}文字以上で入力してください。`;
            return "";
          });
        }
      }
      const addCharTypeValidation = (func: (v: string) => boolean, message: string) => {
        validations.push(v => {
          if (!v) return "";
          if (func(v)) return "";
          return message;
        });
      };
      switch (props.$charType) {
        case "h-num":
          addCharTypeValidation(StringUtils.isHalfWidthNumeric, "半角数字で入力してください。");
          break;
        case "f-num":
          addCharTypeValidation(/^[０-９]+$/.test, "全角数字で入力してください。");
          break;
        case "num":
          addCharTypeValidation(/^[0-9０-９]+$/.test, "数字で入力してください。");
          break;
        case "h-alpha":
          addCharTypeValidation(StringUtils.isHalfWidthAlphabet, "半角英字で入力してください。");
          break;
        case "f-alpha":
          addCharTypeValidation(/^[ａ-ｚＡ-Ｚ]+$/.test, "全角英字で入力してください。");
          break;
        case "alpha":
          addCharTypeValidation(/^[a-zA-Zａ-ｚＡ-Ｚ]+$/.test, "英字で入力してください。");
          break;
        case "h-alpha-num":
          addCharTypeValidation(StringUtils.isHalfWidthAlphanumeric, "半角英数字で入力してください");
          break;
        case "h-alpha-num-syn":
          addCharTypeValidation(StringUtils.isHalfWidthAlphanumericAndSymbols, "半角英数字記号で入力してください。");
          break;
        case "int":
          addCharTypeValidation(StringUtils.isInteger, "数値で入力してください。");
          break;
        case "h-katakana":
          addCharTypeValidation(StringUtils.isHalfWidthKatakana, "半角カタカナで入力してください。");
          break;
        case "f-katakana":
          addCharTypeValidation(StringUtils.isKatakana, "全角カタカナで入力してください。");
          break;
        case "katakana":
          addCharTypeValidation(StringUtils.isFullOrHalfWidthKatakana, "カタカナで入力してください。");
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
    if (!form.editable) return;
    form.change(undefined);
    if (iref.current) iref.current.value = "";
  };

  const hasData = StringUtils.isNotEmpty(form.value);

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
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
        placeholder={form.editable ? props.placeholder : ""}
        disabled={form.disabled}
        readOnly={form.readOnly}
        maxLength={props.$maxLength ?? (props.$preventInputWithinLength ? undefined : props.$length)}
        tabIndex={props.tabIndex}
        defaultValue={form.value ?? ""}
        onChange={e => form.change(e.target.value)}
        data-round={props.$round}
        data-clear={form.editable && props.$hideClearButton !== true}
        autoComplete={props.$autoComplete ?? "off"}
      />
      {form.editable && props.$hideClearButton !== true &&
        <div
          className={Style.button}
          onClick={clear}
          data-disabled={!hasData}
          data-round={props.$round}
        >
          <VscClose />
        </div>
      }
      {props.$resize && <Resizer direction="x" />}
    </FormItemWrap>
  );
});

export default TextBox;