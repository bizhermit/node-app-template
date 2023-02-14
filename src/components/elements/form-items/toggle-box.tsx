import { convertDataItemValidationToFormItemValidation, FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import Style from "$/components/elements/form-items/toggle-box.module.scss";
import LabelText from "@/components/elements/label-text";
import { pressPositiveKey } from "@/components/utilities/attributes";

export type ToggleBoxProps<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
> = Omit<FormItemProps<T, null, D>, "$tagPosition"> & {
  $checkedValue?: T;
  $uncheckedValue?: T;
  children?: ReactNode;
};

interface ToggleBoxFC extends FunctionComponent<ToggleBoxProps> {
  <T extends string | number | boolean = boolean, D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined>(attrs: ToggleBoxProps<T, D>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const ToggleBox: ToggleBoxFC = React.forwardRef<HTMLDivElement, ToggleBoxProps>(<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
>(p: ToggleBoxProps<T, D>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const form = useForm(p, {
    setDataItem: (d) => {
      switch (d.type) {
        case "string":
          return {
            $checkedValue: "1" as T,
            $uncheckedValue: "0" as T,
            $validations: d.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, d, v => v)),
          };
        case "number":
          return {
            $checkedValue: 1 as T,
            $uncheckedValue: 0 as T,
            $validations: d.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, d, v => v)),
          };
        default:
          return {
            $checkedValue: d.trueValue as T,
            $uncheckedValue: d.falseValue as T,
            $validations: d.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, d, v => v)),
          };
      }
    },
    preventRequiredValidation: true,
    validations: (props) => {
      if (!props.$required) return [];
      return [(v) => {
        if (v === (checkedValue)) return "";
        return "有効にしてください。";
      }];
    },
  });
  const checkedValue = (form.props.$checkedValue ?? true) as T;
  const uncheckedValue = (form.props.$uncheckedValue ?? false) as T;

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
      ref={ref}
      $$form={form}
      $preventFieldLayout
      $clickable
      $useHidden
      $mainProps={{
        className: Style.main,
        onClick: click,
        onKeyDown: keydown,
        tabIndex: form.props.tabIndex ?? 0,
      }}
    >
      <div className={Style.body}>
        <div
          className={`${Style.box} bdc-${form.props.$color || "border"} bgc-${form.props.$color || "main"}`}
          data-editable={form.editable}
          data-checked={form.value === checkedValue}
        />
        <div
          className={`${Style.handle} bdc-${form.props.$color || "border"}`}
          data-checked={form.value === checkedValue}
        />
      </div>
      {form.props.children && <LabelText>{form.props.children}</LabelText>}
    </FormItemWrap>
  );
});

export default ToggleBox;