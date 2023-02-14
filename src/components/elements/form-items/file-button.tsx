import Button, { ButtonOptions } from "@/components/elements/button";
import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useRef } from "react";
import Style from "$/components/elements/form-items/file-button.module.scss";
import { VscClose } from "react-icons/vsc";
import { FileData } from "@/data-items/file";

export type FileButtonProps<D extends DataItem_File | undefined = undefined> = FormItemProps<File, null, D> & ButtonOptions & {
  $accept?: string;
  $fileSize?: number;
  $totalFileSize?: number;
  $hideFileName?: boolean;
  $hideClearButton?: boolean;
  children?: ReactNode;
};

interface FileButtonFC extends FunctionComponent {
  <D extends DataItem_File | undefined = undefined>(attrs: FileButtonProps<D>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const FileButton: FileButtonFC = React.forwardRef<HTMLDivElement, FileButtonProps>(<
  D extends DataItem_File | undefined = undefined
>(p: FileButtonProps<D>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const iref = useRef<HTMLInputElement>(null!);
  const href = useRef<HTMLInputElement>(null!);

  const form = useForm(p, {
    multipartFormData: true,
    validations: (props) => {
      const validations: Array<FormItemValidation<any>> = [];
      if (props.$accept) {
        validations.push(FileData.fileTypeValidation(props.$accept));
      }
      if (props.$fileSize != null) {
        validations.push(FileData.fileSizeValidation(props.$fileSize));
      }
      if (props.$totalFileSize != null) {
        validations.push(FileData.totalFileSizeValidation(props.$totalFileSize));
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
      $$form={form}
      ref={ref}
      $preventFieldLayout
    >
      {form.editable &&
        <Button
          className={Style.button}
          $onClick={click}
          disabled={!form.editable}
          $fillLabel={form.props.$fillLabel}
          $icon={form.props.$icon}
          $iconPosition={form.props.$iconPosition}
          $outline={form.props.$outline}
          $round={form.props.$round}
          $size={form.props.$size}
        >
          {form.props.children ?? "ファイルを選択"}
        </Button>
      }
      {form.props.$hideFileName !== true && form.value != null &&
        <div className={Style.label}>
          {form.value.name}
        </div>
      }
      {form.editable && form.props.$hideClearButton !== true && form.value != null &&
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
        accept={form.props.$accept}
        onChange={change}
      />
      {form.props.name &&
        <input
          className={Style.file}
          ref={href}
          type="file"
          name={form.props.name}
        />
      }
    </FormItemWrap>
  );
});

export default FileButton;