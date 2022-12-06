import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { useMemo, useRef } from "react";
import Style from "$/components/elements/form-items/slider.module.scss";
import { convertSizeNumToStr } from "@/utilities/attributes";

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

  const form = useForm(props, {

  });

  const rate = useMemo(() => {
    if (form.value == null) return "0%";
    return Math.round((form.value - min) * 100 / (max - min)) + "%";
  }, [form.value]);

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
        <div className={Style.rail}>
          <div
            className={Style.handle}
            style={{ left: rate }}
          />
        </div>
      </div>
    </FormItemWrap>
  );
});

export default Slider;