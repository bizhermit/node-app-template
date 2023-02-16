import { convertDataItemValidationToFormItemValidation, FormItemProps, FormItemWrap, useDataItemMergedProps, useForm, useFormItemContext } from "@/components/elements/form";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useMemo } from "react";
import Style from "$/components/elements/form-items/radio-buttons.module.scss";
import useLoadableArray, { LoadableArray } from "@/hooks/loadable-array";
import LabelText from "@/components/elements/label-text";
import { pressPositiveKey } from "@/components/utilities/attributes";
import { equals } from "@/data-items/utilities";

export type RadioButtonsProps<
  T extends string | number = string | number,
  D extends DataItem_String | DataItem_Number | undefined = undefined,
  S extends Struct = Struct
> = Omit<FormItemProps<T, D, undefined, { afterData: S | undefined; beforeData: S | undefined; }>, "$tagPosition"> & {
  $labelDataName?: string;
  $valueDataName?: string;
  $colorDataName?: string;
  $direction?: "horizontal" | "vertical";
  $appearance?: "point" | "check" | "check-outline" | "button";
  $source?: LoadableArray<S>;
  $preventSourceMemorize?: boolean;
};

interface RadioButtonsFC extends FunctionComponent<RadioButtonsProps> {
  <T extends string | number = string | number, D extends DataItem_String | DataItem_Number | undefined = undefined, S extends Struct = Struct>
    (attrs: RadioButtonsProps<T, D, S>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const RadioButtons: RadioButtonsFC = React.forwardRef<HTMLDivElement, RadioButtonsProps>(<
  T extends string | number = string | number,
  D extends DataItem_String | DataItem_Number | undefined = undefined,
  S extends Struct = Struct
>(p: RadioButtonsProps<T, D, S>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      return {
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
  const [source, loading] = useLoadableArray(props.$source, {
    preventMemorize: props.$preventSourceMemorize,
  });

  const ctx = useFormItemContext(form, props, {
    preventRequiredValidation: true,
    generateChangeCallbackData: (a, b) => {
      return {
        afterData: source.find(item => equals(item[vdn], a)),
        beforeData: source.find(item => equals(item[vdn], b)),
      };
    },
    generateChangeCallbackDataDeps: [source],
  });

  const select = (value: T) => {
    if (!ctx.editable || loading) return;
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

  const { nodes, selectedItem } = useMemo(() => {
    let selectedItem: Struct | undefined = undefined;
    const appearance = props.$appearance || "point";
    const nodes = source.map(item => {
      const v = item[vdn] as T;
      const l = item[ldn] as ReactNode;
      const c = (item[cdn] as string) || props.$color;
      const selected = equals(v, ctx.value);
      if (selected) selectedItem = item;
      return (
        <div
          key={v ?? null}
          className={Style.item}
          data-selected={selected}
          tabIndex={0}
          onClick={ctx.editable ? () => select(v) : undefined}
          onKeyDown={ctx.editable ? e => pressPositiveKey(e, () => select(v)) : undefined}
          data-appearance={appearance}
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
              `${Style.label} ${appearance === "button" ?
                `bdc-${c || "border"} ${selected ? `c-${c || "main"}` : `fgc-${c}`}` :
                `fgc-${c}`
              }`
            }
          >
            <LabelText>{l}</LabelText>
          </div>
        </div>
      );
    });
    return { nodes, selectedItem };
  }, [source, ctx.editable, ctx.value, props.$appearance]);

  useEffect(() => {
    ctx.change(ctx.valueRef.current, true);
  }, [source]);

  useEffect(() => {
    if (selectedItem == null && source.length > 0) {
      ctx.change(source[0][vdn]);
      if (!loading && selectedItem == null && source.length > 0) {
        let target = source[0];
        if ("$defaultValue" in props && props.$defaultValue != null) {
          target = source.find(item => item[vdn] === props.$defaultValue) ?? source[0];
        }
        ctx.change(target[vdn]);
      }
    }
  }, [selectedItem, source]);

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
      }}
    >
      {nodes}
    </FormItemWrap>
  );
});

export default RadioButtons;