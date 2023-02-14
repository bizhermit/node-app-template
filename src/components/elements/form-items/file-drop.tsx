import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useRef } from "react";
import Style from "$/components/elements/form-items/file-drop.module.scss";
import LabelText from "@/components/elements/label-text";
import { VscClose } from "react-icons/vsc";
import { FileData } from "@/data-items/file";

type FileDropBaseProps<T, D extends DataItem_File | undefined = undefined> = FormItemProps<T, null, D> & {
  $accept?: string;
  $fileSize?: number;
  $totalFileSize?: number;
  $noFileDialog?: boolean;
  $hideClearButton?: boolean;
  children?: ReactNode;
};

export type FileDropProps_Single<D extends DataItem_File | undefined = undefined> = FileDropBaseProps<File, D> & {
  $append?: false;
};

export type FileDropProps_Multiple<D extends DataItem_File | undefined = undefined> = FileDropBaseProps<Array<File>, D> & {
  $append: true;
};

export type FileDropProps<D extends DataItem_File | undefined = undefined> = (FileDropProps_Single<D> & { $multiple?: false; }) | (FileDropProps_Multiple<D> & { $multiple: true });

interface FileDropFC extends FunctionComponent {
  <D extends DataItem_File | undefined = undefined>(attrs: FileDropProps<D>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const FileDrop: FileDropFC = React.forwardRef<HTMLDivElement, FileDropProps>(<
  D extends DataItem_File | undefined = undefined
>(p: FileDropProps<D>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const iref = useRef<HTMLInputElement>(null!);
  const href = useRef<HTMLInputElement>(null!);

  const form = useForm(p, {
    multipartFormData: true,
    multiple: (props) => props.$multiple,
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

  const multiable = form.props.$multiple === true;
  const fileDialog = form.props.$noFileDialog !== true;

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
      if (form.props.$append) {
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
        multiple={form.props.$multiple}
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
      <div
        className={Style.body}
        onClick={click}
        onDragOver={dragOver}
        onDragLeave={dragLeave}
        onDrop={drop}
        tabIndex={form.props.tabIndex ?? 0}
        data-dialog={fileDialog}
      >
        <LabelText>
          {form.props.children}
        </LabelText>
      </div>
      {form.editable && form.props.$hideClearButton !== true &&
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