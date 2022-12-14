import { FormItemProps, FormItemValidation, FormItemWrap, formValidationMessages, useForm } from "@/components/elements/form";
import React, { ReactNode, useEffect, useRef } from "react";
import Style from "$/components/elements/form-items/file-drop.module.scss";
import { fileTypeValidation, fileSizeValidation, totalFileSizeValidation } from "@/utilities/file-input";
import LabelText from "@/components/elements/label-text";

type FileDropCommonProps = {
  $accept?: string;
  $fileSize?: number;
  $totalFileSize?: number;
  children?: ReactNode;
};

export type FileDropProps = FileDropCommonProps &
  ((FormItemProps<File> & { $multiple?: false; }) | (FormItemProps<Array<File>> & { $multiple: true; }));

const FileDrop = React.forwardRef<HTMLDivElement, FileDropProps>((props, ref) => {
  const iref = useRef<HTMLInputElement>(null!);
  const href = useRef<HTMLInputElement>(null!);
  const multiable = props.$multiple === true;

  const form = useForm<File | Array<File> | any>(props, {
    preventRequiredValidation: multiable,
    multiple: props.$multiple,
    validations: () => {
      const validations: Array<FormItemValidation<any>> = [];
      if (props.$accept) {
        validations.push(fileTypeValidation(props.$accept))
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
    iref.current?.click();
  };

  const commit = (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);
    if (files == null) {
      form.change(undefined);
      return;
    }
    if (multiable) {
      form.change(files);
      return;
    }
    form.change(files?.[0]);
  };

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    commit(e.currentTarget.files);
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

  useEffect(() => {
    const files = (Array.isArray(form.value) ? form.value : [form.value]).filter(file => file != null);
    const dt = new DataTransfer();
    files.forEach(file => dt.items.add(file));
    href.current.files = dt.files;
  }, [form.value]);

  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
      $mainProps={{
        className: Style.main,
        onClick: click,
        onDragOver: dragOver,
        onDragLeave: dragLeave,
        onDrop: drop,
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
      <input
        ref={href}
        type="hidden"
        name={props.name}
      />
      <div className={Style.body}>
        <LabelText>
          {props.children}
        </LabelText>
      </div>
    </FormItemWrap>
  );
});

export default FileDrop;