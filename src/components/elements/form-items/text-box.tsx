import Style from "$/components/elements/form-items/text-box.module.scss";
import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import Resizer from "@/components/elements/resizer";
import { convertSizeNumToStr } from "@/utilities/attributes";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import React, { useEffect, useRef } from "react";
import { VscClose } from "react-icons/vsc";

export type TextBoxProps = FormItemProps<string> & {
  $type?: "email" | "password" | "search" | "tel" | "text" | "url";
  $length?: number;
  $maxLength?: number;
  $minLength?: number;
  $round?: boolean;
  $resize?: boolean;
  $width?: number | string;
  $maxWidth?: number | string;
  $minWidth?: number | string;
  $hideClearButton?: boolean;
};

const TextBox = React.forwardRef<HTMLDivElement, TextBoxProps>((props, ref) => {
  const iref = useRef<HTMLInputElement>(null!);

  const form = useForm(props, {
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

  const clear = () => {
    form.change(undefined);
  };

  useEffect(() => {
    if (iref.current) iref.current.value = form.value || "";
  }, [form.value]);

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      data-round={props.$round}
      data-has={StringUtils.isNotEmpty(form.value)}
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
        maxLength={props.$maxLength}
        tabIndex={props.tabIndex}
        defaultValue={form.value ?? ""}
        onChange={e => form.change(e.target.value)}
        data-round={props.$round}
        data-clear={form.editable && props.$hideClearButton !== true}
      />
      {form.editable && props.$hideClearButton !== true &&
        <div
          className={Style.button}
          onClick={clear}
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