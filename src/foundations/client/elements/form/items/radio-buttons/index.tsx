"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type ForwardedRef, type FunctionComponent, type ReactElement, type ReactNode } from "react";
import equals from "../../../../../objects/equal";
import { getValue } from "../../../../../objects/struct/get";
import { setValue } from "../../../../../objects/struct/set";
import useLoadableArray, { type LoadableArray } from "../../../../hooks/loadable-array";
import { pressPositiveKey } from "../../../../utilities/press-positive-key";
import Text from "../../..//text";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import getSourceFromDataItem from "../../utilities/source";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type Data = { [v: string]: any };

type RadioButtonsHookAddon<Q extends Data = Data> = {
  getData: () => (Q | null | undefined);
};
type RadioButtonsHook<
  T extends string | number | boolean,
  Q extends Data = Data
> = F.ItemHook<T, RadioButtonsHookAddon<Q>>;

export const useRadioButtons = <
  T extends string | number | boolean,
  Q extends Data = Data
>() => useFormItemBase<RadioButtonsHook<T, Q>>(e => {
  return {
    getData: () => {
      throw e;
    },
  };
});

type RadioButtonsOptions<
  T extends string | number | boolean = string | number | boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined,
  S extends Data = Data
> = {
  $ref?: RadioButtonsHook<F.VType<T, D, T>, S> | RadioButtonsHook<string | number | boolean, S>;
  $labelDataName?: string;
  $valueDataName?: string;
  $colorDataName?: string;
  $stateDataName?: string;
  $direction?: "horizontal" | "vertical";
  $appearance?: "point" | "check" | "check-fill" | "button";
  $outline?: boolean;
  $source?: LoadableArray<S>;
  $preventSourceMemorize?: boolean;
  $allowNull?: boolean;
  $unselectable?: boolean;
  $tieInNames?: Array<string | { dataName: string; hiddenName: string; }>;
};

type OmitAttrs = "$tagPosition" | "placeholder" | "tabIndex";
export type RadioButtonsProps<
  T extends string | number | boolean = string | number | boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined,
  S extends Data = Data
> = OverwriteAttrs<Omit<F.ItemProps<T, D, undefined, { afterData: S | undefined; beforeData: S | undefined; }>, OmitAttrs>, RadioButtonsOptions<T, D, S>>;

interface RadioButtonsFC extends FunctionComponent<RadioButtonsProps> {
  <T extends string | number | boolean = string | number | boolean, D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined, S extends Data = Data>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, RadioButtonsProps<T, D, S>>
  ): ReactElement<any> | null;
}

const RadioButtons = forwardRef(<
  T extends string | number | boolean = string | number | boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined,
  S extends Data = Data
>(p: RadioButtonsProps<T, D, S>, r: ForwardedRef<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle(r, () => ref.current);

  const form = useForm();
  const {
    $labelDataName,
    $valueDataName,
    $colorDataName,
    $stateDataName,
    $direction,
    $appearance,
    $outline,
    $source,
    $preventSourceMemorize,
    $allowNull,
    $unselectable,
    $tieInNames,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      return {
        $source: getSourceFromDataItem<S>(
          dataItem,
          { vdn: p.$valueDataName, ldn: p.$labelDataName }
        ),
      };
    },
    over: ({ dataItem, props }) => {
      return {
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
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
  const [selectedData, setSelectedData] = useState<S>();

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    generateChangeCallbackData: (a, b) => {
      return {
        afterData: source.find(item => equals(item[vdn], a)),
        beforeData: source.find(item => equals(item[vdn], b)),
      };
    },
    generateChangeCallbackDataDeps: [source],
    messages: {
      required: "{label}を選択してください。"
    },
  });

  const select = (value: T) => {
    if (!ctx.editable || loading) return;
    if ($allowNull && $unselectable) {
      if (ctx.valueRef.current === value) {
        ctx.change(undefined);
        return;
      }
    }
    ctx.change(value);
  };

  const moveFocus = (next?: boolean) => {
    const aelem = document.activeElement;
    if (aelem == null) return;
    if (next) (aelem.nextElementSibling as HTMLDivElement)?.focus();
    else (aelem.previousElementSibling as HTMLDivElement)?.focus();
  };

  const keydownMain = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        moveFocus(true);
        e.preventDefault();
        break;
      case "ArrowLeft":
      case "ArrowUp":
        moveFocus(false);
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const outline = $appearance !== "button" && $outline;

  const { nodes, selectedItem } = useMemo(() => {
    let selectedItem: Data | undefined = undefined;
    const appearance = $appearance || "point";
    const nodes = source.map(item => {
      const v = item[vdn] as T;
      const l = item[ldn] as ReactNode;
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
      const selected = equals(v, ctx.value);
      if (selected) selectedItem = item;
      if (s === "hidden") return null;
      return (
        <div
          key={typeof v === "boolean" ? String(v) : v ?? null}
          className={Style.item}
          data-selected={selected}
          tabIndex={s === "disabled" ? undefined : 0}
          onClick={(ctx.editable && s === "active") ? () => select(v) : undefined}
          onKeyDown={(ctx.editable && s === "active") ? e => pressPositiveKey(e, () => select(v)) : undefined}
          data-appearance={appearance}
          data-outline={outline}
          data-state={s}
          data-color={c}
        >
          {(appearance === "point" || appearance === "check" || appearance === "check-fill") &&
            <div className={Style.check} />
          }
          <div className={Style.content}>
            <Text className={Style.label}>{l}</Text>
          </div>
        </div>
      );
    });
    return { nodes, selectedItem };
  }, [
    source,
    ctx.editable,
    ctx.value,
    $appearance,
    outline,
    ctx.change,
  ]);

  useEffect(() => {
    ctx.change(ctx.valueRef.current, false, true);
  }, [source]);

  useEffect(() => {
    if (loading || $allowNull || selectedItem != null || source.length === 0) return;
    const v = ctx.valueRef.current ?? props.$defaultValue;
    const target = source.find(item => item[vdn] === v) ?? source[0];
    ctx.change(target[vdn], false);
  }, [
    selectedItem,
    source,
    $allowNull,
    ctx.change,
  ]);

  useEffect(() => {
    if ($tieInNames != null) {
      const item = source.find(item => equals(item[vdn], ctx.valueRef.current));
      setSelectedData(item);
      $tieInNames.forEach(tieItem => {
        const { dataName, hiddenName } =
          typeof tieItem === "string" ? { dataName: tieItem, hiddenName: tieItem } : tieItem;
        // setValue($bind, hiddenName, item?.[dataName]);
        setValue(ctx.bind, hiddenName, item?.[dataName]);
      });
    }
  }, [ctx.value, source]);

  const focus = () => {
    ((ref.current?.querySelector(`.${Style.item}[data-selected="true"][tabindex]`) ??
      ref.current?.querySelector(`.${Style.item}[tabindex]`)) as HTMLDivElement)?.focus();
  };

  useEffect(() => {
    if ($focusWhenMounted) focus();
  }, []);

  if ($ref) {
    $ref.focus = focus;
    $ref.getData = () => {
      const v = ctx.valueRef.current;
      return source.find(item => item[vdn] === v) as S;
    };
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $ctx={ctx}
      $preventFieldLayout
      $useHidden
      $mainProps={{
        className: Style.main,
        onKeyDown: keydownMain,
        "data-direction": $direction || "horizontal",
        "data-outline": outline,
      }}
    >
      {nodes}
      {$tieInNames != null &&
        $tieInNames.map(item => {
          const { dataName, hiddenName } =
            typeof item === "string" ? { dataName: item, hiddenName: item } : item;
          return (
            <input
              type="hidden"
              key={hiddenName}
              name={hiddenName}
              value={getValue(selectedData, dataName) ?? ""}
            />
          );
        })
      }
    </FormItemWrap>
  );
}) as RadioButtonsFC;

export default RadioButtons;