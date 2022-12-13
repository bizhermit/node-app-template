import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React from "react";

export type ElectronicSignatureProps = FormItemProps<ImageData> & {

};

const ElectronicSignature = React.forwardRef<HTMLDivElement, ElectronicSignatureProps>((props, ref) => {
  const form = useForm(props);

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
    >
      
    </FormItemWrap>
  );
});

export default ElectronicSignature;