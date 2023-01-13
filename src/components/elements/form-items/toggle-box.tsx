import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import Style from "$/components/elements/form-items/toggle-box.module.scss";
import LabelText from "@/components/elements/label-text";
import { pressPositiveKey } from "@/components/utilities/attributes";

export type ToggleBoxProps<T extends string | number | boolean = boolean> = Omit<FormItemProps<T>, "$tagPosition"> & {
  $checkedValue?: T;
  $uncheckedValue?: T;
  children?: ReactNode;
};

interface ToggleBoxFC extends FunctionComponent<ToggleBoxProps> {
  <T extends string | number | boolean = boolean>(attrs: ToggleBoxProps<T>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const ToggleBox: ToggleBoxFC = React.forwardRef<HTMLDivElement, ToggleBoxProps>(<T extends string | number | boolean = boolean>(props: ToggleBoxProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const checkedValue = (props.$checkedValue ?? true) as T;
  const uncheckedValue = (props.$uncheckedValue ?? false) as T;

  const form = useForm(props, {
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
          className={`${Style.box} bdc-${props.$color || "border"} bgc-${props.$color || "main"}`}
          data-editable={form.editable}
          data-checked={form.value === checkedValue}
        />
        <div
          className={`${Style.handle} bdc-${props.$color || "border"}`}
          data-checked={form.value === checkedValue}
        />
      </div>
      {props.children && <LabelText>{props.children}</LabelText>}
    </FormItemWrap>
  );
});

export default ToggleBox;