import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { useMemo, useRef } from "react";
import Style from "$/components/elements/form-items/slider.module.scss";
import { convertSizeNumToStr } from "@/components/utilities/attributes";

export type SliderProps = FormItemProps<number> & {
  $max?: number;
  $min?: number;
  $step?: number;
  $width?: number | string;
  $minWidth?: number | string;
  $maxWidth?: number | string;
};

const defaultWidth = 160;
const defaultMax = 100;
const defaultMin = 0;

const Slider = React.forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
  const max = props.$max ?? defaultMax;
  const min = props.$min ?? defaultMin;
  const railRef = useRef<HTMLDivElement>(null!);

  const form = useForm(props, {
    preventRequiredValidation: true,
  });

  const rate = useMemo(() => {
    if (form.value == null) return "0%";
    return Math.round((form.value - min) * 100 / (max - min)) + "%";
  }, [form.value]);

  const changeStart = (clientX: number, isTouch?: boolean) => {
    if (!form.editable || railRef.current == null) return;
    const width = railRef.current.clientWidth;
    const cVal = form.value ?? min;
    const range = max - min;

    const moveImpl = (cx: number) => {
      form.change(Math.min(max, Math.max(min, cVal + Math.round(range * (cx - clientX) / width))));
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
    if (!form.editable) return;
    switch (e.key) {
      case "ArrowLeft":
        if (e.ctrlKey) form.change(min);
        else form.change(Math.max(min, (form.value ?? min) - (props.$step ?? 1)));
        e.preventDefault();
        break;
      case "ArrowRight":
        if (e.ctrlKey) form.change(max);
        else form.change(Math.min(max, (form.value ?? min) + (props.$step ?? 1)));
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
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
        tabIndex: props.tabIndex ?? 0,
      }}
    >
      <div
        className={Style.wrap}
      >
        <div className={Style.bar}>
          <div
            className={`${Style.rate} bgc-${props.$color || "main"}`}
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
});

export default Slider;