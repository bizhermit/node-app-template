import Style from "$/components/elements/form-items/text-box.module.scss";
import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import Resizer from "@/components/elements/resizer";
import { convertSizeNumToStr } from "@/components/utilities/attributes";
import StringValidation from "@/validations/string";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import React, { useRef } from "react";
import { VscClose } from "react-icons/vsc";

export type TextBoxProps = FormItemProps<string> & {
  $type?: "email" | "password" | "search" | "tel" | "text" | "url";
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
        validations.push(v => StringValidation.length(v, props.$length!));
      } else {
        if (props.$minLength != null) {
          validations.push(v => StringValidation.minLength(v, props.$minLength!));
        }
        if (props.$maxLength != null) {
          validations.push(v => StringValidation.maxLength(v, props.$maxLength!));
        }
      }
      switch (props.$charType) {
        case "h-num":
          validations.push(v => StringValidation.halfWidthNumeric(v));
          break;
        case "f-num":
          validations.push(v => StringValidation.fullWidthNumeric(v));
          break;
        case "num":
          validations.push(v => StringValidation.numeric(v));
          break;
        case "h-alpha":
          validations.push(v => StringValidation.halfWidthAlphabet(v));
          break;
        case "f-alpha":
          validations.push(v => StringValidation.fullWidthAlphabet(v));
          break;
        case "alpha":
          validations.push(v => StringValidation.alphabet(v));
          break;
        case "h-alpha-num":
          validations.push(v => StringValidation.halfWidthAlphaNumeric(v));
          break;
        case "h-alpha-num-syn":
          validations.push(v => StringValidation.halfWidthAlphaNumericAndSymbols(v));
          break;
        case "int":
          validations.push(v => StringValidation.integer(v));
          break;
        case "h-katakana":
          validations.push(v => StringValidation.halfWidthKatakana(v));
          break;
        case "f-katakana":
          validations.push(v => StringValidation.fullWidthKatakana(v));
          break;
        case "katakana":
          validations.push(v => StringValidation.katakana(v));
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