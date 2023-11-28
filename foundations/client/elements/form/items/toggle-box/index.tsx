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

type ToggleBoxHookAddon = {
  on: () => void;
  off: () => void;
  toggle: () => void;
};
type ToggleBoxHook<T extends string | number | boolean = string | number | boolean> = FormItemHook<T, ToggleBoxHookAddon>;

export const useToggleBox = <
  T extends string | number | boolean = string | number | boolean
>() => useFormItemBase<ToggleBoxHook<T>>(e => {
  return {
    on: () => {
      throw e;
    },
    off: () => {
      throw e;
    },
    toggle: () => {
      throw e;
    },
  };
});

export type ToggleBoxProps<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
> = Omit<FormItemProps<T, D>, "$tagPosition"> & {
  $ref?: ToggleBoxHook<ValueType<T, D, T>> | ToggleBoxHook<string | number | boolean>;
  $checkedValue?: T;
  $uncheckedValue?: T;
  children?: ReactNode;
};

interface ToggleBoxFC extends FunctionComponent<ToggleBoxProps> {
  <T extends string | number | boolean = boolean, D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, ToggleBoxProps<T, D>>
  ): ReactElement<any> | null;
}

const ToggleBox = forwardRef<HTMLDivElement, ToggleBoxProps>(<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
>(p: ToggleBoxProps<T, D>, $ref: ForwardedRef<HTMLDivElement>) => {
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
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => v)),
          };
        case "number":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => v)),
          };
        default:
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => v)),
          };
      }
    }
  });

  const ctx = useFormItemContext(form, props, {
    preventRequiredValidation: true,
    validations: () => {
      if (!props.$required) return [];
      return [(v) => {
        if (v === (checkedValue)) return undefined;
        return props.$messages?.required ?? "有効にしてください。";
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
    props.$ref.getValue = () => ctx.valueRef.current;
    props.$ref.setValue = (v: any) => ctx.change(v, false);
    props.$ref.setDefaultValue = () => ctx.change(props.$defaultValue, false);
    props.$ref.clear = () => ctx.change(undefined, false);
    props.$ref.on = () => ctx.change(checkedValue, false);
    props.$ref.off = () => ctx.change(uncheckedValue, false);
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
      }}
    >
      <div className={Style.body}>
        <div
          className={`${Style.box} bdc-${props.$color || "border"} bgc-${props.$color || "main"}`}
          data-editable={ctx.editable}
          data-checked={ctx.value === checkedValue}
        />
        <div
          className={`${Style.handle} bdc-${props.$color || "border"}`}
          data-checked={ctx.value === checkedValue}
        />
      </div>
      {props.children && <Text className={Style.label}>{props.children}</Text>}
    </FormItemWrap>
  );
}) as ToggleBoxFC;

export default ToggleBox;