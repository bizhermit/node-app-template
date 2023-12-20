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

type CheckBoxOptions<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
> = {
  $ref?: CheckBoxHook<ValueType<T, D, T>> | CheckBoxHook<string | number | boolean>;
  $checkedValue?: T;
  $uncheckedValue?: T;
  $fill?: boolean;
  $outline?: boolean;
  $circle?: boolean;
  children?: ReactNode;
};

type OmitAttrs = "$tagPosition" | "placeholder";
export type CheckBoxProps<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
> = OverwriteAttrs<Omit<FormItemProps<T, D>, OmitAttrs>, CheckBoxOptions<T, D>>;

interface CheckBoxFC extends FunctionComponent<CheckBoxProps> {
  <T extends string | number | boolean = boolean, D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, CheckBoxProps<T, D>>
  ): ReactElement<any> | null;
}

const CheckBox = forwardRef(<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
>(p: CheckBoxProps<T, D>, r: ForwardedRef<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle(r, () => ref.current);

  const form = useForm();
  const {
    tabIndex,
    $checkedValue,
    $uncheckedValue,
    $fill,
    $outline,
    $circle,
    $focusWhenMounted,
    children,
    ...$p
  } = useDataItemMergedProps(form, p, {
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

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    preventRequiredValidation: true,
    validations: ({ required, getMessage }) => {
      if (!required) return [];
      return [(v) => {
        if (v === checkedValue) return undefined;
        return getMessage("required");
      }];
    },
    messages: {
      required: "チェックを入れてください。",
    },
  });
  const checkedValue = ($checkedValue ?? true) as T;
  const uncheckedValue = ($uncheckedValue ?? false) as T;

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
    if ($focusWhenMounted) {
      (ref.current?.querySelector(`.${Style.main}[tabindex]`) as HTMLDivElement)?.focus();
    }
  }, []);

  if ($ref) {
    $ref.focus = () => (ref.current?.querySelector(`.${Style.main}[tabindex]`) as HTMLDivElement)?.focus();
    $ref.check = () => ctx.change(checkedValue, false);
    $ref.uncheck = () => ctx.change(uncheckedValue, false);
    $ref.toggle = () => ctx.change(ctx.valueRef.current === checkedValue ? uncheckedValue : checkedValue, false);
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $ctx={ctx}
      $useHidden
      $preventFieldLayout
      $clickable
      $mainProps={{
        className: Style.main,
        onClick: click,
        onKeyDown: keydown,
        tabIndex: ctx.disabled ? undefined : tabIndex ?? 0,
        "data-outline": $outline,
      }}
    >
      <div
        className={Style.body}
        data-checked={ctx.value === checkedValue}
        data-circle={$circle}
        data-fill={$fill}
      />
      {children &&
        <div className={Style.content}>
          <Text className={Style.label}>
            {children}
          </Text>
        </div>
      }
    </FormItemWrap>
  );
}) as CheckBoxFC;

export default CheckBox;