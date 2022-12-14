import Button, { ButtonOptions } from "@/components/elements/button";
import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { ReactNode } from "react";
import Style from "$/components/elements/form-items/file-button.module.scss";

export type FileButtonProps = FormItemProps<File> & ButtonOptions & {
  children?: ReactNode;
};

const FileButton = React.forwardRef<HTMLDivElement, FileButtonProps>((props, ref) => {
  const form = useForm(props);

  const click = () => {
    console.log("click");
  };

  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
    >
      <Button
        {...props as ButtonOptions}
        $onClick={click}
        disabled={!form.editable}
      >
        {props.children ?? "ファイルを選択"}
      </Button>
    </FormItemWrap>
  );
});

export default FileButton;