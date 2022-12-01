import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { FunctionComponent, ReactElement, ReactNode, useRef } from "react";
import Style from "$/components/elements/form-items/check-box.module.scss";
import LabelText from "@/components/elements/label-text";

export type CheckBoxProps<T extends string | number | boolean = boolean> = Omit<FormItemProps<T>, "$tagPosition"> & {
  $checkedValue?: T;
  $uncheckedValue?: T;
  $outline?: boolean;
  children?: ReactNode;
};

interface CheckBoxFC extends FunctionComponent {
  <T extends string | number | boolean = boolean>(attrs: CheckBoxProps<T>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const CheckBox: CheckBoxFC = React.forwardRef<HTMLDivElement, CheckBoxProps>(<T extends string | number | boolean = boolean>(props: CheckBoxProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const iref = useRef<HTMLInputElement>(null!);
  const checkedValue = (props.$checkedValue ?? true) as T;
  const uncheckedValue = (props.$uncheckedValue ?? false) as T;

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

  const color = props.$color || "main";

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
          className={`${Style.box} bdc-${color}`}
          data-editable={form.editable}
        />
        <div
          className={`${Style.check} ${props.$outline ? `bdc-${color}` : `bdc-${color}_r bgc-${color}`}`}
          data-checked={form.value === checkedValue}
        />
      </div>
      {props.children &&
        <LabelText>{props.children}</LabelText>
      }
    </FormItemWrap>
  );
});

export default CheckBox;