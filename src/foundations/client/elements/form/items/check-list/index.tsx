"use client";

import { forwardRef, useImperativeHandle, useRef, type ForwardedRef, type FunctionComponent, type ReactElement } from "react";
import useLoadableArray, { type LoadableArray } from "../../../../hooks/loadable-array";
import joinCn from "../../../../utilities/join-class-name";
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
> = F.ItemHook<T, CheckListHookAddon<Q>>;

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

type CheckListOptions<
  T extends Array<string | number | boolean> = Array<string | number | boolean>,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
> = {
  $ref?: CheckListHook<F.VType<T, D, T>> | CheckListHook<Array<string | number | boolean>>;
  $labelDataName?: string;
  $valueDataName?: string;
  $colorDataName?: string;
  $stateDataName?: string;
  $nowrap?: boolean;
  $fill?: boolean;
  $outline?: boolean;
  $circle?: boolean;
  $source?: LoadableArray<{ [v: string | number | symbol]: any }>;
  $preventSourceMemorize?: boolean;
  $mainClassName?: string;
  $itemClassName?: string;
  $direction?: "horizontal" | "vertical";
};

type OmitAttrs = "$tagPosition" | "placeholder" | "tabIndex";
export type CheckListProps<
  T extends Array<string | number | boolean> = Array<string | number | boolean>,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined
> = OverwriteAttrs<Omit<F.ItemProps<T, D, Array<F.VType<T, D>>>, OmitAttrs>, CheckListOptions<T, D>>;

interface CheckListFC extends FunctionComponent<CheckListProps> {
  <T extends Array<string | number | boolean> = Array<string | number | boolean>, D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, CheckListProps<T, D>>
  ): ReactElement<any> | null;
}

const CheckList = forwardRef(<
  V extends string | number | boolean = string | number | boolean,
  T extends Array<V> = Array<V>,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined,
  S extends { [v: string | number]: any } = { [v: string | number]: any }
>(p: CheckListProps<T, D>, r: ForwardedRef<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle(r, () => ref.current);

  const form = useForm();
  const {
    $labelDataName,
    $valueDataName,
    $colorDataName,
    $stateDataName,
    $nowrap,
    $fill,
    $outline,
    $circle,
    $source,
    $preventSourceMemorize,
    $mainClassName,
    $itemClassName,
    $direction,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {
    under: ({ dataItem, props }) => {
      if (dataItem.type === "boolean") {
        return {
          $source: (() => {
            if (dataItem.source) return dataItem.source;
            return [dataItem.trueValue, dataItem.falseValue].map((v: any) => {
              return {
                [props.$valueDataName ?? "value"]: v,
                [props.$labelDataName ?? "label"]: String(v ?? ""),
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

  const vdn = $valueDataName ?? "value";
  const ldn = $labelDataName ?? "label";
  const cdn = $colorDataName ?? "color";
  const sdn = $stateDataName ?? "state";
  const [source, loading] = useLoadableArray($source, {
    preventMemorize: $preventSourceMemorize,
  });

  const { ctx, props, $ref, $preventFormBind } = useFormItemContext(form, $p, {
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

  if ($ref) {
    $ref.focus = () => focus();
    $ref.checkAll = () => ctx.change(source.map(item => item[vdn]), false);
    $ref.uncheckAll = () => ctx.change([], false);
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $ctx={ctx}
      $preventFieldLayout
      $clickable
      $mainProps={{
        className: joinCn(Style.main, $mainClassName),
        "data-nowrap": $nowrap,
        "data-direction": $direction || "horizontal",
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
            className={$itemClassName}
            $preventFormBind
            $disabled={ctx.disabled || s === "disabled"}
            $readOnly={ctx.readOnly || s === "readonly"}
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
            $fill={$fill}
            $outline={$outline}
            $circle={$circle}
            $focusWhenMounted={index === 0 && $focusWhenMounted}
          >
            {item[ldn]}
          </CheckBox>
        );
      })}
      {props.name && !$preventFormBind &&
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