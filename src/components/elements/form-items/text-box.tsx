import Style from "@/styles/components/elements/form-items/common.module.scss";
import { FormItemProps, FormItemValidation, useForm } from "@/components/elements/form";
import { inputAttributes } from "@/utilities/attributes";
import React, { HTMLAttributes, useRef } from "react";

export type TextBoxProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & FormItemProps<string> & {
  $type?: "email" | "password" | "search" | "tel" | "text" | "url";
  $length?: number;
  $maxLength?: number;
  $minLength?: number;
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
      return validations;
    },
  });

  return (
    <div
      {...inputAttributes(props, Style.wrap)}
      title={form.error}
      data-editable={form.editable}
      data-error={Boolean(form.error)}
    >
      <input
        ref={iref}
        className={Style.input}
        name={props.name}
        type={props.$type || "text"}
        placeholder={form.editable ? props.placeholder : ""}
        disabled={form.disabled}
        readOnly={form.readOnly}
        maxLength={props.$maxLength}
        minLength={props.$minLength}
        tabIndex={props.tabIndex}
        onChange={e => form.change(e.target.value)}
      />
    </div>
  );
});

export default TextBox;