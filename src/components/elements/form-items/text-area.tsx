import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import React, { useRef } from "react";
import Style from "$/components/elements/form-items/text-area.module.scss";
import Resizer from "@/components/elements/resizer";
import { convertSizeNumToStr } from "@/components/utilities/attributes";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { StringData } from "@/data-items/string";

export type TextAreaProps = FormItemProps<string> & {
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

const TextArea = React.forwardRef<HTMLDivElement, TextAreaProps>((props, ref) => {
  const iref = useRef<HTMLTextAreaElement>(null!);

  const form = useForm(props, {
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
      return validations;
    },
    validationsDeps: [
      props.$length,
      props.$minLength,
      props.$maxLength,
    ],
  });

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      data-has={StringUtils.isNotEmpty(form.value)}
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
        placeholder={form.editable ? props.placeholder : ""}
        disabled={form.disabled}
        readOnly={form.readOnly}
        maxLength={props.$maxLength ?? (props.$preventInputWithinLength ? undefined : props.$length)}
        tabIndex={props.tabIndex}
        defaultValue={form.value ?? ""}
        onChange={e => form.change(e.target.value)}
        autoComplete={props.$autoComplete ?? "off"}
      />
      {props.$resize &&
        <Resizer direction={typeof props.$resize === "boolean" ? "xy" : props.$resize} />
      }
    </FormItemWrap>
  );
});

export default TextArea;