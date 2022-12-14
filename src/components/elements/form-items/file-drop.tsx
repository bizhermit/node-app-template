import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { ReactNode } from "react";
import Style from "$/components/elements/form-items/file-drop.module.scss";

type FileDropCommonProps = {
  children?: ReactNode;
};

export type FileDropProps = FileDropCommonProps &
  ((FormItemProps<File> & { $multiable?: false; }) | (FormItemProps<Array<File>> & { $multiable: true; }));

const FileDrop = React.forwardRef<HTMLDivElement, FileDropProps>((props, ref) => {
  const form = useForm<File | Array<File> | any>(props);

  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
    >
      {props.children}
    </FormItemWrap>
  );
});

export default FileDrop;