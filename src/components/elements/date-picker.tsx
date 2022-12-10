import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React from "react";

type DatePickerCommonProps<T> = {
};

type DatePickerStringProps = FormItemProps<string> & {
  $typeof?: "string";
} & DatePickerCommonProps<string>;

type DatePickerNumberProps = FormItemProps<number> & {
  $typeof: "number";
} & DatePickerCommonProps<number>;

type DatePickerDateProps = FormItemProps<Date> & {
  $typeof: "date";
} & DatePickerCommonProps<Date>;

export type DatePickerProps = DatePickerStringProps | DatePickerNumberProps | DatePickerDateProps;

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const form = useForm<string | number | Date | any>(props, {

  });
  
  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
      $preventFieldLayout
      $useHidden
    >

    </FormItemWrap>
  );
});

export default DatePicker;