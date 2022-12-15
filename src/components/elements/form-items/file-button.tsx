import Button, { ButtonOptions } from "@/components/elements/button";
import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import React, { ReactNode, useEffect, useRef } from "react";
import Style from "$/components/elements/form-items/file-button.module.scss";
import { fileTypeValidation, fileSizeValidation, totalFileSizeValidation } from "@/utilities/file-input";
import { VscClose } from "react-icons/vsc";

export type FileButtonProps = FormItemProps<File> & ButtonOptions & {
  $accept?: string;
  $fileSize?: number;
  $totalFileSize?: number;
  $hideFileName?: boolean;
  $hideClearButton?: boolean;
  children?: ReactNode;
};

const FileButton = React.forwardRef<HTMLDivElement, FileButtonProps>((props, ref) => {
  const iref = useRef<HTMLInputElement>(null!);
  const href = useRef<HTMLInputElement>(null!);

  const form = useForm(props, {
    multipartFormData: true,
    validations: () => {
      const validations: Array<FormItemValidation<any>> = [];
      if (props.$accept) {
        validations.push(fileTypeValidation(props.$accept));
      }
      if (props.$fileSize != null) {
        validations.push(fileSizeValidation(props.$fileSize));
      }
      if (props.$totalFileSize != null) {
        validations.push(totalFileSizeValidation(props.$totalFileSize));
      }
      return validations;
    },
  });

  const click = () => {
    if (!form.editable) return;
    if (iref.current) {
      iref.current.value = "";
      iref.current.click();
    }
  };

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    const files = Array.from(e.currentTarget.files ?? []);
    if (files?.length === 0) return;
    form.change(files[0]);
  };

  const clear = () => {
    form.change(undefined);
  };

  useEffect(() => {
    if (href.current) {
      const files = (Array.isArray(form.value) ? form.value : [form.value]).filter(file => file != null);
      const dt = new DataTransfer();
      files.forEach(file => dt.items.add(file));
      href.current.files = dt.files;
    }
  }, [form.value]);

  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
      $preventFieldLayout
    >
      {form.editable &&
        <Button
          className={Style.button}
          $onClick={click}
          disabled={!form.editable}
          $fillLabel={props.$fillLabel}
          $icon={props.$icon}
          $iconPosition={props.$iconPosition}
          $outline={props.$outline}
          $round={props.$round}
          $size={props.$size}
        >
          {props.children ?? "ファイルを選択"}
        </Button>
      }
      {props.$hideFileName !== true && form.value != null &&
        <div className={Style.label}>
          {form.value.name}
        </div>
      }
      {form.editable && props.$hideClearButton !== true && form.value != null &&
        <div
          className={Style.clear}
          onClick={clear}
        >
          <VscClose />
        </div>
      }
      <input
        ref={iref}
        type="file"
        className={Style.file}
        accept={props.$accept}
        onChange={change}
      />
      {props.name &&
        <input
          className={Style.file}
          ref={href}
          type="file"
          name={props.name}
        />
      }
    </FormItemWrap>
  );
});

export default FileButton;