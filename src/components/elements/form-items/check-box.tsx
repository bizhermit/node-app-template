import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { ReactNode, useRef } from "react";
import Style from "@/styles/components/elements/form-items/check-box.module.scss";

export type CheckBoxProps = FormItemProps<string | number | boolean> & {
  $checkedValue?: string | number | boolean;
  $uncheckedValue?: string | number | boolean;
  $color?: Color;
  children?: ReactNode;
};

const CheckBox = React.forwardRef<HTMLDivElement, CheckBoxProps>((props, ref) => {
  const iref = useRef<HTMLInputElement>(null!);
  const checkedValue = props.$checkedValue ?? true;
  const uncheckedValue = props.$uncheckedValue ?? false;

  const form = useForm(props, {
    effect: (v) => {
      if (iref.current) iref.current.value = String(v ?? "");
    },
    preventRequiredValidation: true,
    validations: () => {
      if (!props.$required) return [];
      return [(v) => {
        if (v === (checkedValue)) return "";
        return "チェックを入れてください。";
      }];
    },
  });

  const toggleCheck = (check?: boolean) => {
    if (check == null) {
      form.change(form.valueRef.current === checkedValue ? uncheckedValue : checkedValue);
      return;
    }
    form.change(check ? checkedValue : uncheckedValue);
  };

  const click = () => {
    if (!form.editable) return;
    toggleCheck();
  };
  const keydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!form.editable) return;
    if (e.key === "Enter" || e.key === " ") toggleCheck();
  };

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      $editableLayout={false}
      $mainProps={{
        className: Style.main,
        onClick: click,
        onKeyDown: keydown,
        tabIndex: props.tabIndex ?? 0,
      }}
    >
      {props.name &&
        <input
          ref={iref}
          name={props.name}
          type="hidden"
        />
      }
      <div
        className={Style.body}
        data-disabled={form.disabled}
        data-readonly={form.readOnly}
      >
        <div
          data-checked={form.value === checkedValue}
          className={`${Style.box} bgc-${props.color || "main"} bdc-${props.color || "main"}_r`}
        />
      </div>
    </FormItemWrap>
  );
});

export default CheckBox;