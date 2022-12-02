import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import React, { useRef } from "react";
import Style from "$/components/elements/form-items/text-area.module.scss";

export type TextAreaProps = FormItemProps<string> & {
  $length?: number;
  $maxLength?: number;
  $minLength?: number;
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
      return validations;
    },
  });

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      data-has={Boolean(form.value)}
    >
      <textarea
        ref={iref}
        className={Style.input}
        name={props.name}
        placeholder={form.editable ? props.placeholder : ""}
        disabled={form.disabled}
        readOnly={form.readOnly}
        maxLength={props.$maxLength}
        tabIndex={props.tabIndex}
        defaultValue={form.value ?? ""}
        onChange={e => form.change(e.target.value)}
      />
    </FormItemWrap>
  );
});

export default TextArea;