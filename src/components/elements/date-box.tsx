import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React from "react";

type DateBoxCommonProps<T> = {

};

type DateBoxStringProps = FormItemProps<string> & {
  $typeof?: "string";
} & DateBoxCommonProps<string>;

type DateBoxNumberProps = FormItemProps<number> & {
  $typeof: "number";
} & DateBoxCommonProps<number>;

type DateBoxDateProps = FormItemProps<Date> & {
  $typeof: "date";
} & DateBoxCommonProps<Date>;

export type DateBoxProps = DateBoxStringProps | DateBoxNumberProps | DateBoxDateProps;

const DateBox = React.forwardRef<HTMLDivElement, DateBoxProps>((props, ref) => {
  const form = useForm<string | number | Date | any>(props, {
  });

  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
      $useHidden
    >
      <span>datebox</span>
    </FormItemWrap>
  );
});

export default DateBox;