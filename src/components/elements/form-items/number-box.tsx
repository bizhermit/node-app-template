import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { ChangeEvent } from "react";
import Style from "$/components/elements/form-items/form-item.module.scss";

type NumberBoxProps = FormItemProps<number> & {
  $max?: number;
  $min?: null;
  $sign?: "only-positive" | "only-negative";
  $float?: number;
  $preventThousandSeparate?: boolean;
  $incrementInterval?: number;
  $resize?: boolean;
};

const NumberBox = React.forwardRef<HTMLDivElement, NumberBoxProps>((props, ref) => {
  const form = useForm(props, {

  });

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    console.log(v);
  };

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      data-has={Boolean(form.value)}
    >
      <input
        type="text"
        className={Style.input}
        name={props.name}
        placeholder={form.editable ? props.placeholder : ""}
        disabled={form.disabled}
        readOnly={form.readOnly}
        tabIndex={props.tabIndex}
        defaultValue={form.value ?? ""}
        onChange={change}
      />
    </FormItemWrap>
  );
});

export default NumberBox;