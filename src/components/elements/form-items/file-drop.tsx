import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import React, { ReactNode, useEffect, useRef } from "react";
import Style from "$/components/elements/form-items/file-drop.module.scss";
import { fileTypeValidation, fileSizeValidation, totalFileSizeValidation } from "@/components/utilities/file-input";
import LabelText from "@/components/elements/label-text";
import { VscClose } from "react-icons/vsc";

type FileDropCommonProps = {
  $accept?: string;
  $fileSize?: number;
  $totalFileSize?: number;
  $noFileDialog?: boolean;
  $hideClearButton?: boolean;
  children?: ReactNode;
};

export type FileDropProps = FileDropCommonProps &
  ((FormItemProps<File> & { $multiple?: false; }) | (FormItemProps<Array<File>> & { $multiple: true; $append?: boolean }));

const FileDrop = React.forwardRef<HTMLDivElement, FileDropProps>((props, ref) => {
  const iref = useRef<HTMLInputElement>(null!);
  const href = useRef<HTMLInputElement>(null!);
  const multiable = props.$multiple === true;
  const fileDialog = props.$noFileDialog !== true;

  const form = useForm<File | Array<File> | any>(props, {
    multipartFormData: true,
    multiple: props.$multiple,
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
    if (!form.editable || !fileDialog) return;
    iref.current?.click();
  };

  const commit = (fileList: FileList | null) => {
    if (fileList == null) {
      form.change(undefined);
      return;
    }
    const files = Array.from(fileList ?? []);
    if (multiable) {
      if (props.$append) {
        form.change([...(form.valueRef.current ?? []), ...files]);
        return;
      }
      form.change(files);
      return;
    }
    form.change(files?.[0]);
  };

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    const files = e.currentTarget.files;
    if (files?.length === 0) return;
    commit(files);
  };

  const dragLeave = (e: React.DragEvent) => {
    if (!form.editable) return;
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.removeAttribute("data-active");
  };

  const dragOver = (e: React.DragEvent) => {
    if (!form.editable) return;
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    e.currentTarget.setAttribute("data-active", "");
  };

  const drop = (e: React.DragEvent) => {
    if (!form.editable) return;
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.removeAttribute("data-active");
    commit(e.dataTransfer.files);
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
      $mainProps={{
        className: Style.main,
      }}
    >
      <input
        ref={iref}
        type="file"
        className={Style.file}
        multiple={props.$multiple}
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
      <div
        className={Style.body}
        onClick={click}
        onDragOver={dragOver}
        onDragLeave={dragLeave}
        onDrop={drop}
        tabIndex={props.tabIndex ?? 0}
        data-dialog={fileDialog}
      >
        <LabelText>
          {props.children}
        </LabelText>
      </div>
      {form.editable && props.$hideClearButton !== true &&
        <div
          className={Style.clear}
          onClick={clear}
        >
          <VscClose />
        </div>
      }
    </FormItemWrap >
  );
});

export default FileDrop;