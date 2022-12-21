import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import Style from "$/components/elements/form-items/check-box.module.scss";
import LabelText from "@/components/elements/label-text";
import { pressPositiveKey } from "@/components/utilities/attributes";

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
  const checkedValue = (props.$checkedValue ?? true) as T;
  const uncheckedValue = (props.$uncheckedValue ?? false) as T;

  const form = useForm(props, {
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
    pressPositiveKey(e, () => toggleCheck());
  };

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      $preventFieldLayout
      $clickable
      $useHidden
      $mainProps={{
        className: Style.main,
        onClick: click,
        onKeyDown: keydown,
        tabIndex: props.tabIndex ?? 0,
      }}
    >
      <div className={Style.body}>
        <div
          className={`${Style.box} bdc-${props.$color || "border"}`}
          data-editable={form.editable}
        />
        <div
          className={`${Style.check} ${props.$outline ? `bdc-${props.$color || "input"}` : `bdc-${props.$color || "border"}_r bgc-${props.$color || "main"}`}`}
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