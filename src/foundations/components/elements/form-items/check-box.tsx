import { convertDataItemValidationToFormItemValidation, type FormItemProps, FormItemWrap, useDataItemMergedProps, useForm, useFormItemContext } from "#/components/elements/form";
import { type ForwardedRef, forwardRef, type FunctionComponent, type ReactElement, type ReactNode } from "react";
import Style from "#/styles/components/elements/form-items/check-box.module.scss";
import Text from "#/components/elements/text";
import { pressPositiveKey } from "#/components/utilities/attributes";

export type CheckBoxProps<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
> = Omit<FormItemProps<T, D>, "$tagPosition"> & {
  $checkedValue?: T;
  $uncheckedValue?: T;
  $borderCheck?: boolean;
  $outline?: boolean;
  $circle?: boolean;
  children?: ReactNode;
};

interface CheckBoxFC extends FunctionComponent<CheckBoxProps> {
  <T extends string | number | boolean = boolean, D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined>(attrs: CheckBoxProps<T, D>, ref?: ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const CheckBox: CheckBoxFC = forwardRef<HTMLDivElement, CheckBoxProps>(<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
>(p: CheckBoxProps<T, D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      switch (dataItem.type) {
        case "string":
          return {
            $checkedValue: "1" as T,
            $uncheckedValue: "0" as T,
          };
        case "number":
          return {
            $checkedValue: 1 as T,
            $uncheckedValue: 0 as T,
          };
        default:
          return {
            $checkedValue: dataItem.trueValue as T,
            $uncheckedValue: dataItem.falseValue as T,
          };
      }
    },
    over: ({ dataItem, props }) => {
      switch (dataItem.type) {
        case "string":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
          };
        case "number":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
          };
        default:
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
          };
      }
    }
  });

  const ctx = useFormItemContext(form, props, {
    preventRequiredValidation: true,
    validations: () => {
      if (!props.$required) return [];
      return [(v) => {
        if (v === checkedValue) return undefined;
        return props.$messages?.required ?? "チェックを入れてください。";
      }];
    },
  });
  const checkedValue = (props.$checkedValue ?? true) as T;
  const uncheckedValue = (props.$uncheckedValue ?? false) as T;

  const toggleCheck = (check?: boolean) => {
    if (check == null) {
      ctx.change(ctx.valueRef.current === checkedValue ? uncheckedValue : checkedValue);
      return;
    }
    ctx.change(check ? checkedValue : uncheckedValue);
  };

  const click = () => {
    if (!ctx.editable) return;
    toggleCheck();
  };
  const keydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!ctx.editable) return;
    pressPositiveKey(e, () => toggleCheck());
  };

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      $preventFieldLayout
      $clickable
      $useHidden
      $mainProps={{
        className: Style.main,
        onClick: click,
        onKeyDown: keydown,
        tabIndex: ctx.disabled ? undefined : props.tabIndex ?? 0,
        "data-outline": props.$outline,
      }}
    >
      <div
        className={Style.body}
        data-circle={props.$circle}
      >
        <div
          className={`${Style.box} bdc-${props.$color || "border"}`}
          data-editable={ctx.editable}
        />
        <div
          className={`${Style.check} ${props.$borderCheck ? `bdc-${props.$color || "input"}` : `bdc-${props.$color || "main"}_r bgc-${props.$color || "main"}`}`}
          data-checked={ctx.value === checkedValue}
        />
      </div>
      {props.children &&
        <Text className={Style.label}>{props.children}</Text>
      }
    </FormItemWrap>
  );
});

export default CheckBox;