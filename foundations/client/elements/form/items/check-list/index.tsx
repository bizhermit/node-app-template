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

type CheckListHookAddon<Q extends { [v: string]: any } = { [v: string]: any }> = {
  getData: () => Array<(Q | null | undefined)>;
  checkAll: () => void;
  uncheckAll: () => void;
};
type CheckListHook<
  T extends Array<string | number | boolean>,
  Q extends { [key: string]: any } = { [key: string]: any }
> = FormItemHook<T, CheckListHookAddon<Q>>;

export const useCheckList = <
  T extends Array<string | number | boolean>,
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
  T extends Array<string | number | boolean> = Array<string | number | boolean>,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
> = Omit<FormItemProps<T, D, Array<ValueType<T, D>>>, "$tagPosition"> & {
  $ref?: CheckListHook<ValueType<T, D, T>> | CheckListHook<Array<string | number | boolean>>;
  $labelDataName?: string;
  $valueDataName?: string;
  $colorDataName?: string;
  $stateDataName?: string;
  $nowrap?: boolean;
  $fill?: boolean;
  $outline?: boolean;
  $circle?: boolean;
  $source?: LoadableArray<Struct>;
  $preventSourceMemorize?: boolean;
  $mainClassName?: string;
  $itemClassName?: string;
  $direction?: "horizontal" | "vertical";
};

interface CheckListFC extends FunctionComponent<CheckListProps> {
  <T extends Array<string | number | boolean> = Array<string | number | boolean>, D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, CheckListProps<T, D>>
  ): ReactElement<any> | null;
}

const CheckList = forwardRef<HTMLDivElement, CheckListProps>(<
  V extends string | number | boolean = string | number | boolean,
  T extends Array<V> = Array<V>,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined,
  S extends { [v: string | number]: any } = { [v: string | number]: any }
>(p: CheckListProps<T, D>, $ref: ForwardedRef<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      if (dataItem.type === "boolean") {
        return {
          $source: (() => {
            if (dataItem.source) return dataItem.source;
            return [dataItem.trueValue, dataItem.falseValue].map((v: any) => {
              return {
                [p.$valueDataName ?? "value"]: v,
                [p.$labelDataName ?? "label"]: String(v ?? ""),
              };
            });
          })() as LoadableArray<S>,
        };
      }
      return {
        $source: dataItem.source,
      };
    },
  });

  const vdn = props.$valueDataName ?? "value";
  const ldn = props.$labelDataName ?? "label";
  const cdn = props.$colorDataName ?? "color";
  const sdn = props.$stateDataName ?? "state";
  const [source, loading] = useLoadableArray(props.$source, {
    preventMemorize: props.$preventSourceMemorize,
  });

  const ctx = useFormItemContext(form, props, {
    multiple: true,
    receive: (v) => {
      if (v === null || Array.isArray(v)) return v;
      return [v];
    },
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
        const c = (item[cdn] as Color) || props.$color;
        const s = (() => {
          switch (item[sdn]) {
            case "readonly":
              return "readonly";
            case "disabled":
              return "disabled";
            case "hidden":
              return "hidden";
            default:
              return "active";
          }
        })();
        if (s === "hidden") return null;
        return (
          <CheckBox
            key={v}
            className={props.$itemClassName}
            $preventFormBind
            $disabled={props.$disabled || ctx.disabled || s === "disabled"}
            $readOnly={props.$readOnly || ctx.readOnly || s === "readonly"}
            $value={v === val}
            $onChange={(checked) => {
              const vals = getArrayValue();
              const i = vals.findIndex(val => val === v);
              if (checked) {
                if (i >= 0) return;
                ctx.change([...vals, v]);
              } else {
                if (i < 0) return;
                const newVals = [...vals];
                newVals.splice(i, 1);
                ctx.change(newVals);
              }
            }}
            $color={c}
            $fill={props.$fill}
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