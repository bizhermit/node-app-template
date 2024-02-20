"use client";

import { forwardRef, useImperativeHandle, useRef, type ForwardedRef, type FunctionComponent, type ReactElement } from "react";
import ArrayValidation from "../../../../../data-items/array/validations";
import useLoadableArray, { type LoadableArray } from "../../../../hooks/loadable-array";
import joinCn from "../../../../utilities/join-class-name";
import useForm from "../../context";
import { convertHiddenValue, isErrorObject } from "../../utilities";
import getSourceFromDataItem from "../../utilities/source";
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
  Q extends { [v: string]: any } = { [v: string]: any }
> = F.ItemHook<T, CheckListHookAddon<Q>>;

export const useCheckList = <
  T extends Array<string | number | boolean>,
  Q extends { [v: string]: any } = { [v: string]: any }
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
  D extends DataItem_Array<DataItem_String | DataItem_Number | DataItem_Boolean<any, any>> | DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | undefined = undefined
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
  $length?: number;
  $minLength?: number;
  $maxLength?: number;
};

type OmitAttrs = "$tagPosition" | "placeholder" | "tabIndex";
export type CheckListProps<
  T extends Array<string | number | boolean> = Array<string | number | boolean>,
  D extends DataItem_Array<DataItem_String | DataItem_Number | DataItem_Boolean<any, any>> | DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | undefined = undefined
> = OverwriteAttrs<Omit<F.ItemProps<T, D, Array<F.VType<T, D>>>, OmitAttrs>, CheckListOptions<T, D>>;

interface CheckListFC extends FunctionComponent<CheckListProps> {
  <T extends Array<string | number | boolean> = Array<string | number | boolean>, D extends DataItem_Array<DataItem_String | DataItem_Number | DataItem_Boolean<any, any>> | DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, CheckListProps<T, D>>
  ): ReactElement<any> | null;
}

const CheckList = forwardRef(<
  V extends string | number | boolean = string | number | boolean,
  T extends Array<V> = Array<V>,
  D extends DataItem_Array<DataItem_String | DataItem_Number | DataItem_Boolean<any, any>> | DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | undefined = undefined,
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
    $length,
    $minLength,
    $maxLength,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {
    under: ({ dataItem, props }) => {
      const sourceProps: Parameters<typeof getSourceFromDataItem>[1] = {
        vdn: props.$valueDataName,
        ldn: props.$labelDataName,
      };
      if (dataItem.type === "array") {
        const di = dataItem.item;
        return {
          $source: getSourceFromDataItem<S>(di, sourceProps),
          $length: dataItem.length,
          $minLength: dataItem.minLength,
          $maxLength: dataItem.maxLength,
        };
      }
      return {
        $source: getSourceFromDataItem<S>(dataItem, sourceProps),
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
      if (v == null || Array.isArray(v)) return v;
      return [v];
    },
    validations: ({ label }) => {
      const validations: Array<F.Validation<Array<string | number | boolean> | null | undefined>> = [];
      if ($length != null) {
        validations.push(v => ArrayValidation.length(v, $length, label));
      } else {
        if ($minLength != null && $maxLength != null) {
          validations.push(v => ArrayValidation.range(v, $minLength, $maxLength, label));
        } else {
          if ($minLength != null) {
            validations.push(v => ArrayValidation.minLength(v, $minLength, label));
          }
          if ($maxLength != null) {
            validations.push(v => ArrayValidation.maxLength(v, $maxLength, label));
          }
        }
      }
      return validations;
    },
    validationsDeps: [
      $length,
      $minLength,
      $maxLength,
    ],
    messages: {
      required: "{label}を選択してください。",
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

  const hasError = isErrorObject(ctx.error);

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
            $messagePosition="hide"
            $error={hasError ? "" : undefined}
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
