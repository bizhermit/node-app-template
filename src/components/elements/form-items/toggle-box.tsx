import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { ReactNode, useRef } from "react";
import Style from "$/components/elements/form-items/toggle-box.module.scss";
import LabelText from "@/pages/sandbox/elements/label-text";

export type ToggleBoxProps = FormItemProps<string | number | boolean> & {
  $checkedValue?: string | number | boolean;
  $uncheckedValue?: string | number | boolean;
  $color?: Color;
  $outline?: boolean;
  children?: ReactNode;
};

const ToggleBox = React.forwardRef<HTMLDivElement, ToggleBoxProps>((props, ref) => {
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
        return "有効にしてください。";
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

  const color = props.$color || "sub";

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      $preventFieldLayout
      $clickable
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
      <div className={Style.body}>
        <div
          className={`${Style.box} bdc-${color} bgc-${color}`}
          data-editable={form.editable}
          data-checked={form.value === checkedValue}
        />
        <div
          className={`${Style.handle} bdc-${color}`}
          data-checked={form.value === checkedValue}
        />
      </div>
      {props.children && <LabelText>{props.children}</LabelText>}
    </FormItemWrap>
  );
});

export default ToggleBox;