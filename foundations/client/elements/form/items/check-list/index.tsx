"use client";

import { forwardRef, useImperativeHandle, useRef, type ForwardedRef, type FunctionComponent, type ReactElement } from "react";
import type { FormItemHook, FormItemProps, ValueType } from "../../$types";
import useLoadableArray from "../../../../hooks/loadable-array";
import { joinClassNames } from "../../../../utilities/attributes";
import useForm from "../../context";
import { convertHiddenValue } from "../../utilities";
import CheckBox from "../check-box";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type CheckListHookAddon<Q extends { [key: string]: any } = { [key: string]: any }> = {
  getData: () => Array<(Q | null | undefined)>;
  checkAll: () => void;
  uncheckAll: () => void;
};
type CheckListHook<
  T extends Array<string | number>,
  Q extends { [key: string]: any } = { [key: string]: any }
> = FormItemHook<T, CheckListHookAddon<Q>>;

export const useCheckList = <
  T extends Array<string | number>,
  Q extends { [key: string]: any } = { [key: string]: any }
>() => useFormItemBase<CheckListHook<T, Q>>(e => {
  return {
    getData: () => {
      throw e;
    },
    checkAll: () => {
      throw e;
    },
    uncheckAll: () => {
      throw e;
    },
  };
});

export type CheckListProps<
  T extends Array<string | number> = Array<string | number>,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
> = Omit<FormItemProps<T, D, Array<ValueType<T, D>>>, "$tagPosition"> & {
  $ref?: CheckListHook<ValueType<T, D, T>> | CheckListHook<Array<string | number>>;
  $labelDataName?: string;
  $valueDataName?: string;
  $nowrap?: boolean;
  $outline?: boolean;
  $circle?: boolean;
  $source?: LoadableArray<Struct>;
  $preventSourceMemorize?: boolean;
  $mainClassName?: string;
  $itemClassName?: string;
  $direction?: "horizontal" | "vertical";
};

interface CheckListFC extends FunctionComponent<CheckListProps> {
  <T extends Array<string | number> = Array<string | number>, D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, CheckListProps<T, D>>
  ): ReactElement<any> | null;
}

const CheckList = forwardRef<HTMLDivElement, CheckListProps>(<
  V extends string | number = string | number,
  T extends Array<V> = Array<V>,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
>(p: CheckListProps<T, D>, $ref: ForwardedRef<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem, method }) => {
      return {
        $required: method === "get" ? undefined : dataItem.required,
        $source: dataItem.source,
      };
    },
  });

  const vdn = props.$valueDataName ?? "value";
  const ldn = props.$labelDataName ?? "label";
  const [source, loading] = useLoadableArray(props.$source, {
    preventMemorize: props.$preventSourceMemorize,
  });

  const ctx = useFormItemContext(form, props, {
    multiple: true,
  });

  const getArrayValue = () => {
    const v = ctx.valueRef.current;
    if (v == null) return [];
    if (Array.isArray(v)) return v;
    return [v];
  };

  const focus = () => {
    (ref.current?.querySelector(`div[tabindex]`) as HTMLDivElement)?.focus();
  };

  if (props.$ref) {
    props.$ref.focus = () => focus();
    props.$ref.checkAll = () => ctx.change(source.map(item => item[vdn]), false);
    props.$ref.uncheckAll = () => ctx.change([], false);
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      $preventFieldLayout
      $clickable
      $mainProps={{
        className: joinClassNames(Style.main, props.$mainClassName),
        "data-nowrap": props.$nowrap,
        "data-direction": props.$direction || "horizontal",
      }}
    >
      {!loading && source.map((item, index) => {
        const v = item[vdn];
        const val = getArrayValue().find(val => val === v);
        return (
          <CheckBox
            key={v}
            className={props.$itemClassName}
            $preventFormBind
            $disabled={props.$disabled || ctx.disabled}
            $readOnly={props.$readOnly || ctx.readOnly}
            $value={v === val}
            $onChange={() => {
              const vals = [...getArrayValue()];
              const i = vals.findIndex(val => val === v);
              if (i < 0) vals.push(v);
              else vals.splice(i, 1);
              ctx.change(vals);
            }}
            $outline={props.$outline}
            $circle={props.$circle}
            $focusWhenMounted={index === 0 && props.$focusWhenMounted}
          >
            {item[ldn]}
          </CheckBox>
        );
      })}
      {props.name && !props.$preventFormBind &&
        getArrayValue().map((v, idx) => {
          return (
            <input
              key={v}
              type="hidden"
              name={`${props.name}[${idx}]`}
              value={convertHiddenValue(v)}
            />
          );
        })
      }
    </FormItemWrap>
  );
}) as CheckListFC;

export default CheckList;