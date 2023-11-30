"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, type ForwardedRef, type FunctionComponent, type ReactElement } from "react";
import type { FormItemHook, FormItemProps, ValueType } from "../../$types";
import { convertSizeNumToStr } from "../../../../utilities/attributes";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type SliderHookAddon = {
  up: () => number;
  down: () => number;
  add: (v: number) => number;
};
type SliderHook<T extends string | number = number> = FormItemHook<T, SliderHookAddon>;

export const useSlider = <T extends string | number = number>() => useFormItemBase<SliderHook<T>>(e => {
  return {
    up: () => {
      throw e;
    },
    down: () => {
      throw e;
    },
    add: () => {
      throw e;
    },
  };
});

export type SliderProps<D extends DataItem_Number | DataItem_String | undefined = undefined> = FormItemProps<number, D, number> & {
  $ref?: SliderHook<ValueType<number, D, number>> | SliderHook<number | string>;
  $max?: number;
  $min?: number;
  $step?: number;
  $width?: number | string;
  $minWidth?: number | string;
  $maxWidth?: number | string;
};

interface SliderFC extends FunctionComponent<SliderProps> {
  <D extends DataItem_Number | DataItem_String | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, SliderProps<D>>
  ): ReactElement<any> | null;
}

const defaultWidth = 160;
const defaultMax = 100;
const defaultMin = 0;

const Slider = forwardRef<HTMLDivElement, SliderProps>(<
  D extends DataItem_Number | DataItem_String | undefined = undefined
>(p: SliderProps<D>, $ref: ForwardedRef<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const railRef = useRef<HTMLDivElement>(null!);
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      switch (dataItem.type) {
        case "string":
          return {
            $min: 0,
            $width: dataItem.width,
            $minWidth: dataItem.minWidth,
            $maxWidth: dataItem.maxWidth,
          };
        default:
          return {
            $min: dataItem.min,
            $max: dataItem.max,
            $width: dataItem.width,
            $minWidth: dataItem.minWidth,
            $maxWidth: dataItem.maxWidth,
          };
      }
    },
    over: ({ dataItem, props }) => {
      switch (dataItem.type) {
        case "string":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => v?.toString())),
          };
        default:
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
          };
      }
    },
  });

  const ctx = useFormItemContext(form, props, {
    preventRequiredValidation: true,
  });

  const max = props.$max ?? defaultMax;
  const min = props.$min ?? defaultMin;

  const rate = useMemo(() => {
    if (ctx.value == null) return "0%";
    return Math.round((ctx.value - min) * 100 / (max - min)) + "%";
  }, [ctx.value]);

  const changeStart = (clientX: number, isTouch?: boolean) => {
    if (!ctx.editable || railRef.current == null) return;
    const width = railRef.current.clientWidth;
    const cVal = ctx.value ?? min;
    const range = max - min;

    const moveImpl = (cx: number) => {
      ctx.change(Math.min(max, Math.max(min, cVal + Math.round(range * (cx - clientX) / width))));
    };
    if (isTouch) {
      const move = (e: TouchEvent) => moveImpl(e.touches[0].clientX);
      const end = () => {
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", end);
      };
      window.addEventListener("touchend", end);
      window.addEventListener("touchmove", move);
    } else {
      const move = (e: MouseEvent) => moveImpl(e.clientX);
      const end = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", end);
      };
      window.addEventListener("mouseup", end);
      window.addEventListener("mousemove", move);
    }
  };

  const keydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!ctx.editable) return;
    switch (e.key) {
      case "ArrowLeft":
        if (e.ctrlKey) ctx.change(min);
        else ctx.change(Math.max(min, (ctx.value ?? min) - (props.$step ?? 1)));
        e.preventDefault();
        break;
      case "ArrowRight":
        if (e.ctrlKey) ctx.change(max);
        else ctx.change(Math.min(max, (ctx.value ?? min) + (props.$step ?? 1)));
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (props.$focusWhenMounted) {
      ref.current?.focus();
    }
  }, []);

  if (props.$ref) {
    props.$ref.focus = () => ref.current?.focus();
    props.$ref.up = () => {
      const v = Math.min(props.$max ?? max, Math.max(props.$min ?? min, (ctx.valueRef.current ?? min + (props.$step ?? 1))));
      ctx.change(v, false);
      return v;
    };
    props.$ref.down = () => {
      const v = Math.min(props.$max ?? max, Math.max(props.$min ?? min, (ctx.valueRef.current ?? min + (props.$step ?? 1))));
      ctx.change(v, false);
      return v;
    };
    props.$ref.add = (num) => {
      const v = Math.min(props.$max ?? max, Math.max(props.$min ?? min, (ctx.valueRef.current ?? min + num)));
      ctx.change(v, false);
      return v;
    };
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      $useHidden
      $preventFieldLayout
      $mainProps={{
        className: Style.main,
        style: {
          width: convertSizeNumToStr(props.$width ?? defaultWidth),
          maxWidth: convertSizeNumToStr(props.$maxWidth),
          minWidth: convertSizeNumToStr(props.$minWidth),
        },
        onKeyDown: keydown,
        tabIndex: ctx.disabled ? undefined : props.tabIndex ?? 0,
      }}
    >
      <div
        className={Style.wrap}
      >
        <div className={Style.bar}>
          <div
            className={Style.rate}
            style={{ width: rate }}
          />
        </div>
        <div
          ref={railRef}
          className={Style.rail}
        >
          <div
            className={Style.handle}
            style={{ left: rate }}
            onMouseDown={e => changeStart(e.clientX)}
            onTouchStart={e => changeStart(e.touches[0].clientX, true)}
          />
        </div>
      </div>
    </FormItemWrap>
  );
}) as SliderFC;

export default Slider;