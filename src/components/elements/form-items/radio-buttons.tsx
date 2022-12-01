import { equals, FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useMemo } from "react";
import Style from "$/components/elements/form-items/radio-buttons.module.scss";
import useLoadableArray, { LoadableArray } from "@/hooks/loadable-array";
import LabelText from "@/components/elements/label-text";

export type RadioButtonsProps<T extends string | number = string | number> = Omit<FormItemProps<T, { afterData: Struct; beforeData: Struct; }>, "$tagPosition"> & {
  $labelDataName?: string;
  $valueDataName?: string;
  $colorDataName?: string;
  $direction?: "horizontal" | "vertical";
  $appearance?: "check" | "button";
  $source?: LoadableArray<Struct>;
  $preventSourceMemorize?: boolean;
};

interface RadioButtonsFC extends FunctionComponent {
  <T extends string | number = string | number>(attrs: RadioButtonsProps<T>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const RadioButtons: RadioButtonsFC = React.forwardRef<HTMLDivElement, RadioButtonsProps>(<T extends string | number = string | number>(props: RadioButtonsProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const vdn = props.$valueDataName ?? "value";
  const ldn = props.$labelDataName ?? "label";
  const cdn = props.$colorDataName ?? "color";
  const [source, loading] = useLoadableArray(props.$source, {
    preventMemorize: props.$preventSourceMemorize,
  });

  const form = useForm(props, {
    preventRequiredValidation: true,
    generateChangeCallbackData: (a, b) => {
      return {
        afterData: source.find(item => equals(item[vdn], a)),
        beforeData: source.find(item => equals(item[vdn], b)),
      };
    }
  });

  const select = (value: T) => {
    if (!form.editable || loading) return;
    form.change(value);
  };

  const keydown = (e: React.KeyboardEvent<HTMLDivElement>, value: T) => {
    if (e.key === " " || e.key === "Enter") {
      select(value);
    }
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
        break;
      case "ArrowLeft":
      case "ArrowUp":
        moveFocus(false);
        break;
      default:
        break;
    }
  };

  const { nodes, selectedItem } = useMemo(() => {
    let selectedItem: Struct | undefined = undefined;
    const nodes = source.map(item => {
      const v = item[vdn] as T;
      const l = item[ldn] as ReactNode
      const c = (item[cdn] as string) || props.$color;
      const selected = equals(v, form.value);
      if (selected) selectedItem = item;
      return (
        <div
          key={v ?? null}
          className={Style.item}
          data-selected={selected}
          tabIndex={0}
          onClick={form.editable ? () => select(v) : undefined}
          onKeyDown={form.editable ? (e) => keydown(e, v) : undefined}
        >
          <div
            className={`${Style.box} bdc-${c || "border"}`}
          >
            <div
              className={`${Style.check} bgc-${c || "base_r"}`}
              data-selected={selected}
            />
          </div>
          <div
            className={Style.label}
          >
            <LabelText>{l}</LabelText>
          </div>
        </div>
      );
    });
    return { nodes, selectedItem };
  }, [source, form.editable, form.value]);

  useEffect(() => {
    if (selectedItem == null && source.length > 0) {
      form.change(source[0][vdn]);
    }
  }, [selectedItem]);

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      $preventFieldLayout
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