import Style from "$/components/elements/form-items/text-box.module.scss";
import { convertDataItemValidationToFormItemValidation, FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import Resizer from "@/components/elements/resizer";
import { convertSizeNumToStr } from "@/components/utilities/attributes";
import { StringData } from "@/data-items/string";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import React, { FunctionComponent, ReactElement, useRef } from "react";
import { VscClose } from "react-icons/vsc";

export type TextBoxProps<D extends DataItem_String | DataItem_Number | undefined = undefined> = FormItemProps<string, null, D, string> & {
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

interface TextBoxFC extends FunctionComponent<TextBoxProps> {
  <D extends DataItem_String | DataItem_Number | undefined = undefined>(attrs: TextBoxProps<D>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const TextBox: TextBoxFC = React.forwardRef<HTMLDivElement, TextBoxProps>(<
  D extends DataItem_String | DataItem_Number | undefined = undefined
>(p: TextBoxProps<D>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const iref = useRef<HTMLInputElement>(null!);

  const form = useForm(p, {
    setDataItem: (d, m) => {
      const isSearch = m === "get";
      switch (d.type) {
        case "number":
          return {
            $charType: "h-num" as StringCharType,
            $validations: d.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, d, v => Number(v))),
            $width: d.width,
            $minWidth: d.minWidth,
            $maxWidth: d.maxWidth,
          };
        default:
          return {
            $length: isSearch ? undefined : d.length,
            $minLength: isSearch ? undefined : d.minLength,
            $maxLength: d.maxLength ?? d.length,
            $charType: d.charType,
            $validations: d.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, d, v => v)),
            $width: d.width,
            $minWidth: d.minWidth,
            $maxWidth: d.maxWidth,
          };
      }
    },
    effect: (v) => {
      if (iref.current) iref.current.value = v || "";
    },
    validations: (props) => {
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
        default:
          break;
      }
      return validations;
    },
    validationsDeps: (props) => [
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
      ref={ref}
      $$form={form}
      data-round={form.props.$round}
      $hasData={hasData}
      $mainProps={{
        style: {
          width: convertSizeNumToStr(form.props.$width),
          maxWidth: convertSizeNumToStr(form.props.$maxWidth),
          minWidth: convertSizeNumToStr(form.props.$minWidth),
        },
      }}
    >
      <input
        ref={iref}
        className={Style.input}
        name={form.props.name}
        type={form.props.$type || "text"}
        placeholder={form.editable ? form.props.placeholder : ""}
        disabled={form.disabled}
        readOnly={form.readOnly}
        maxLength={form.props.$maxLength ?? (form.props.$preventInputWithinLength ? undefined : form.props.$length)}
        tabIndex={form.props.tabIndex}
        defaultValue={form.value ?? ""}
        onChange={e => form.change(e.target.value)}
        data-round={form.props.$round}
        data-clear={form.editable && form.props.$hideClearButton !== true}
        autoComplete={form.props.$autoComplete ?? "off"}
      />
      {form.editable && form.props.$hideClearButton !== true &&
        <div
          className={Style.button}
          onClick={clear}
          data-disabled={!hasData}
          data-round={form.props.$round}
        >
          <VscClose />
        </div>
      }
      {form.props.$resize && <Resizer direction="x" />}
    </FormItemWrap>
  );
});

export default TextBox;