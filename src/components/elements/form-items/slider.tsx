import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React from "react";
import Style from "$/components/elements/form-items/slider.module.scss";

export type SliderProps = FormItemProps<number> & {
  $max?: number;
  $min?: number;
  $step?: number;
};

const Slider = React.forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
  const form = useForm(props, {

  });

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      $useHidden
      $preventFieldLayout
    >
      <div
        className={Style.wrap}
      >
        <div
          className={Style.handle}
        />
      </div>
    </FormItemWrap>
  );
});

export default Slider;