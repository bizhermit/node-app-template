"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, type ForwardedRef, type FunctionComponent, type ReactElement, type ReactNode } from "react";
import { pressPositiveKey } from "../../../../utilities/press-positive-key";
import Text from "../../../text";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type ToggleSwitchHookAddon = {
  on: () => void;
  off: () => void;
  toggle: () => void;
};
type ToggleSwitchHook<T extends string | number | boolean = string | number | boolean> = F.ItemHook<T, ToggleSwitchHookAddon>;

export const useToggleSwitch = <
  T extends string | number | boolean = string | number | boolean
>() => useFormItemBase<ToggleSwitchHook<T>>(e => {
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

type ToggleSwitchOptions<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | undefined = undefined
> = {
  $ref?: ToggleSwitchHook<F.VType<T, D, T>> | ToggleSwitchHook<string | number | boolean>;
  $checkedValue?: T;
  $uncheckedValue?: T;
  children?: ReactNode;
};

type OmitAttrs = "$tagPosition" | "placeholder";
export type ToggleSwitchProps<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | undefined = undefined
> = OverwriteAttrs<Omit<F.ItemProps<T, D>, OmitAttrs>, ToggleSwitchOptions<T, D>>;

interface ToggleSwitchFC extends FunctionComponent<ToggleSwitchProps> {
  <T extends string | number | boolean = boolean, D extends DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, ToggleSwitchProps<T, D>>
  ): ReactElement<any> | null;
}

const ToggleSwitch = forwardRef(<
  T extends string | number | boolean = boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | undefined = undefined
>(p: ToggleSwitchProps<T, D>, r: ForwardedRef<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle(r, () => ref.current);

  const form = useForm();
  const {
    tabIndex,
    $checkedValue,
    $uncheckedValue,
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

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    preventRequiredValidation: true,
    validations: ({ required, getMessage }) => {
      if (!required) return [];
      return [(v) => {
        if (v === (checkedValue)) return undefined;
        return getMessage("required");
      }];
    },
    messages: {
      required: "有効にしてください。",
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

  const formEnable = !form.disabled && !form.readOnly;

  useEffect(() => {
    if ($focusWhenMounted && formEnable) {
      (ref.current?.querySelector(`.${Style.main}[tabindex]`) as HTMLDivElement)?.focus();
    }
  }, [formEnable]);

  if ($ref) {
    $ref.focus = () => (ref.current?.querySelector(`.${Style.main}[tabindex]`) as HTMLDivElement)?.focus();
    $ref.on = () => ctx.change(checkedValue, false);
    $ref.off = () => ctx.change(uncheckedValue, false);
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
      }}
    >
      <div
        className={Style.body}
        data-checked={ctx.value === checkedValue}
      >
        <div
          className={Style.box}
          data-editable={ctx.editable}
        />
        <div className={Style.handle} />
      </div>
      {children &&
        <div className={Style.content}>
          <Text className={Style.label}>
            {children}
          </Text>
        </div>
      }
    </FormItemWrap>
  );
}) as ToggleSwitchFC;

export default ToggleSwitch;
