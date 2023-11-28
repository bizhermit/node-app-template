"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type ForwardedRef, type FunctionComponent, type ReactElement, type ReactNode } from "react";
import type { FormItemHook, FormItemProps, ValueType } from "../../$types";
import { equals, getValue, setValue } from "../../../../../data-items/utilities";
import useLoadableArray from "../../../../hooks/loadable-array";
import { joinClassNames, pressPositiveKey } from "../../../../utilities/attributes";
import Text from "../../..//text";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type RadioButtonsHookAddon<Q extends { [key: string]: any } = { [key: string]: any }> = {
  getData: () => (Q | null | undefined);
};
type RadioButtonsHook<
  T extends string | number | boolean,
  Q extends { [key: string]: any } = { [key: string]: any }
> = FormItemHook<T, RadioButtonsHookAddon<Q>>;

export const useRadioButtons = <
  T extends string | number | boolean,
  Q extends { [key: string]: any } = { [key: string]: any }
>() => useFormItemBase<RadioButtonsHook<T, Q>>(e => {
  return {
    getData: () => {
      throw e;
    },
  };
});

export type RadioButtonsProps<
  T extends string | number | boolean = string | number | boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined,
  S extends { [key: string]: any } = { [key: string]: any }
> = Omit<FormItemProps<T, D, undefined, { afterData: S | undefined; beforeData: S | undefined; }>, "$tagPosition"> & {
  $ref?: RadioButtonsHook<ValueType<T, D, T>, S> | RadioButtonsHook<string | number | boolean, S>;
  $labelDataName?: string;
  $valueDataName?: string;
  $colorDataName?: string;
  $stateDataName?: string;
  $direction?: "horizontal" | "vertical";
  $appearance?: "point" | "check" | "check-outline" | "button";
  $outline?: boolean;
  $source?: LoadableArray<S>;
  $preventSourceMemorize?: boolean;
  $allowNull?: boolean;
  $unselectable?: boolean;
  $tieInNames?: Array<string | { dataName: string; hiddenName: string; }>;
};

interface RadioButtonsFC extends FunctionComponent<RadioButtonsProps> {
  <T extends string | number | boolean = string | number | boolean, D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined, S extends { [key: string]: any } = { [key: string]: any }>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, RadioButtonsProps<T, D, S>>
  ): ReactElement<any> | null;
}

const RadioButtons = forwardRef<HTMLDivElement, RadioButtonsProps>(<
  T extends string | number | boolean = string | number | boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | undefined = undefined,
  S extends { [key: string]: any } = { [key: string]: any }
>(p: RadioButtonsProps<T, D, S>, $ref: ForwardedRef<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem, method }) => {
      return {
        $required: method === "get" ? undefined : dataItem.required,
        $source: dataItem.source as LoadableArray<S>,
      };
    },
    over: ({ dataItem, props }) => {
      return {
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
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
  const [selectedData, setSelectedData] = useState<S>();

  const ctx = useFormItemContext(form, props, {
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
    if (props.$allowNull && props.$unselectable) {
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

  const outline = props.$appearance !== "button" && props.$outline;

  const { nodes, selectedItem } = useMemo(() => {
    let selectedItem: { [key: string]: any } | undefined = undefined;
    const appearance = props.$appearance || "point";
    const nodes = source.map(item => {
      const v = item[vdn] as T;
      const l = item[ldn] as ReactNode;
      const c = (item[cdn] as string) || props.$color;
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
          className={joinClassNames(Style.item, c ? `bdc-${c}` : undefined)}
          data-selected={selected}
          tabIndex={s === "disabled" ? undefined : 0}
          onClick={(ctx.editable && s === "active") ? () => select(v) : undefined}
          onKeyDown={(ctx.editable && s === "active") ? e => pressPositiveKey(e, () => select(v)) : undefined}
          data-appearance={appearance}
          data-outline={outline}
          data-state={s}
        >
          {(appearance === "point" || appearance === "check" || appearance === "check-outline") &&
            <div
              className={`${Style.box} bdc-${c || "border"}`}
            >
              <div
                className={
                  `${Style.check} ${appearance === "check-outline" ?
                    `bdc-${c || "input"}` :
                    `bgc-${c || (appearance === "check" ? "main" : "input_r")} bdc-${c || "main"}_r`
                  }`
                }
                data-selected={selected}
              />
            </div>
          }
          <div
            className={
              `${Style.content} ${appearance === "button" ?
                `bdc-${c || "border"} ${selected ? `c-${c || "main"}` : `fgc-${c}`}` :
                `fgc-${c}`
              }`
            }
          >
            <Text className={Style.label}>{l}</Text>
          </div>
        </div>
      );
    });
    return { nodes, selectedItem };
  }, [source, ctx.editable, ctx.value, props.$appearance, outline, ctx.change]);

  useEffect(() => {
    ctx.change(ctx.valueRef.current, false, true);
  }, [source]);

  useEffect(() => {
    if (loading || props.$allowNull || selectedItem != null || source.length === 0) return;
    const v = ctx.valueRef.current ?? props.$defaultValue;
    const target = source.find(item => item[vdn] === v) ?? source[0];
    ctx.change(target[vdn], false);
  }, [selectedItem, source, props.$allowNull, ctx.change]);

  useEffect(() => {
    if (props.$tieInNames != null) {
      const item = source.find(item => equals(item[vdn], ctx.valueRef.current));
      setSelectedData(item);
      props.$tieInNames.forEach(tieItem => {
        const { dataName, hiddenName } =
          typeof tieItem === "string" ? { dataName: tieItem, hiddenName: tieItem } : tieItem;
        // setValue(props.$bind, hiddenName, item?.[dataName]);
        setValue(ctx.bind, hiddenName, item?.[dataName]);
      });
    }
  }, [ctx.value, source]);

  useEffect(() => {
    if (props.$focusWhenMounted) {
      ((ref.current?.querySelector(`.${Style.item}[data-selected="true"][tabindex]`) ??
        ref.current?.querySelector(`.${Style.item}[tabindex]`)) as HTMLDivElement)?.focus();
    }
  }, []);

  if (props.$ref) {
    props.$ref.focus = () => {
      ((ref.current?.querySelector(`.${Style.item}[data-selected="true"][tabindex]`) ??
        ref.current?.querySelector(`.${Style.item}[tabindex]`)) as HTMLDivElement)?.focus();
    };
    props.$ref.getData = () => {
      const v = ctx.valueRef.current;
      return source.find(item => item[vdn] === v) as S;
    };
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      $preventFieldLayout
      $useHidden
      $mainProps={{
        className: Style.main,
        onKeyDown: keydownMain,
        "data-direction": props.$direction || "horizontal",
        "data-outline": outline,
      }}
    >
      {nodes}
      {props.$tieInNames != null &&
        props.$tieInNames.map(item => {
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