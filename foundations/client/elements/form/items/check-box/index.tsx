"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, type ForwardedRef, type FunctionComponent, type ReactElement, type ReactNode } from "react";
import type { FormItemHook, FormItemProps, ValueType } from "../../$types";
import { pressPositiveKey } from "../../../../utilities/attributes";
import Text from "../../../text";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type CheckBoxHookAddon = {
  check: () => void;
  uncheck: () => void;
  toggle: () => void;
};
type CheckBoxHook<T extends string | number | boolean = string | number | boolean> = FormItemHook<T, CheckBoxHookAddon>;

export const useCheckBox = <
  T extends string | number | boolean = string | number | boolean
>() => useFormItemBase<CheckBoxHook<T>>(e => {
  return {
    check: () => {
      throw e;
    },
    uncheck: () => {
      throw e;
    },
    toggle: () => {
      throw e;
    },
  };
});

export type CheckBoxProps<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
> = Omit<FormItemProps<T, D>, "$tagPosition"> & {
  $ref?: CheckBoxHook<ValueType<T, D, T>> | CheckBoxHook<string | number | boolean>;
  $checkedValue?: T;
  $uncheckedValue?: T;
  $fill?: boolean;
  $outline?: boolean;
  $circle?: boolean;
  children?: ReactNode;
};

interface CheckBoxFC extends FunctionComponent<CheckBoxProps> {
  <T extends string | number | boolean = boolean, D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, CheckBoxProps<T, D>>
  ): ReactElement<any> | null;
}

const CheckBox = forwardRef<HTMLDivElement, CheckBoxProps>(<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
>(p: CheckBoxProps<T, D>, $ref: ForwardedRef<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);

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

  useEffect(() => {
    if (props.$focusWhenMounted) {
      (ref.current?.querySelector(`.${Style.main}[tabindex]`) as HTMLDivElement)?.focus();
    }
  }, []);

  if (props.$ref) {
    props.$ref.focus = () => (ref.current?.querySelector(`.${Style.main}[tabindex]`) as HTMLDivElement)?.focus();
    props.$ref.check = () => ctx.change(checkedValue, false);
    props.$ref.uncheck = () => ctx.change(uncheckedValue, false);
    props.$ref.toggle = () => ctx.change(ctx.valueRef.current === checkedValue ? uncheckedValue : checkedValue, false);
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      $useHidden
      $preventFieldLayout
      $clickable
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
        data-checked={ctx.value === checkedValue}
        data-circle={props.$circle}
        data-fill={props.$fill}
      />
      {props.children &&
        <div className={Style.content}>
          <Text className={Style.label}>
            {props.children}
          </Text>
        </div>
      }
    </FormItemWrap>
  );
}) as CheckBoxFC;

export default CheckBox;