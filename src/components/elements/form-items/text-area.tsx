import { convertDataItemValidationToFormItemValidation, FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import React, { FunctionComponent, ReactElement, useRef } from "react";
import Style from "$/components/elements/form-items/text-area.module.scss";
import Resizer from "@/components/elements/resizer";
import { convertSizeNumToStr } from "@/components/utilities/attributes";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { StringData } from "@/data-items/string";

export type TextAreaProps<D extends DataItem_String | undefined = undefined> = FormItemProps<string, null, D, string> & {
  $length?: number;
  $preventInputWithinLength?: boolean;
  $minLength?: number;
  $maxLength?: number;
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
  <D extends DataItem_String | undefined = undefined>(attrs: TextAreaProps<D>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const TextArea: TextAreaFC = React.forwardRef<HTMLDivElement, TextAreaProps>(<
  D extends DataItem_String | undefined = undefined
>(p: TextAreaProps<D>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const iref = useRef<HTMLTextAreaElement>(null!);

  const form = useForm(p, {
    setDataItem: (d, m) => {
      const isSearch = m === "get";
      return {
        $length: isSearch ? undefined : d.length,
        $minLength: isSearch ? undefined : d.minLength,
        $maxLength: d.maxLength ?? d.length,
        $validations: d.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, d, v => v)),
        $width: d.width,
        $minWidth: d.minWidth,
        $maxWidth: d.maxWidth,
      };
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
      return validations;
    },
    validationsDeps: (props) => [
      props.$length,
      props.$minLength,
      props.$maxLength,
    ],
  });

  return (
    <FormItemWrap
      ref={ref}
      $$form={form}
      $hasData={StringUtils.isNotEmpty(form.value)}
      $mainProps={{
        style: {
          width: convertSizeNumToStr(form.props.$width),
          maxWidth: convertSizeNumToStr(form.props.$maxWidth),
          minWidth: convertSizeNumToStr(form.props.$minWidth),
          height: convertSizeNumToStr(form.props.$height),
          maxHeight: convertSizeNumToStr(form.props.$maxHeight),
          minHeight: convertSizeNumToStr(form.props.$minHeight),
        }
      }}
    >
      <textarea
        ref={iref}
        className={Style.input}
        name={form.props.name}
        placeholder={form.editable ? form.props.placeholder : ""}
        disabled={form.disabled}
        readOnly={form.readOnly}
        maxLength={form.props.$maxLength ?? (form.props.$preventInputWithinLength ? undefined : form.props.$length)}
        tabIndex={form.props.tabIndex}
        defaultValue={form.value ?? ""}
        onChange={e => form.change(e.target.value)}
        autoComplete={form.props.$autoComplete ?? "off"}
      />
      {form.props.$resize &&
        <Resizer direction={typeof form.props.$resize === "boolean" ? "xy" : form.props.$resize} />
      }
    </FormItemWrap>
  );
});

export default TextArea;