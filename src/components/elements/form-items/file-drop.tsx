import { convertDataItemValidationToFormItemValidation, FormItemProps, FormItemValidation, FormItemWrap, useDataItemMergedProps, useForm, useFormItemContext } from "@/components/elements/form";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useRef } from "react";
import Style from "$/components/elements/form-items/file-drop.module.scss";
import LabelText from "@/components/elements/label-text";
import { VscClose } from "react-icons/vsc";
import { FileData } from "@/data-items/file";

type FileDropBaseProps<T, D extends DataItem_File | undefined = undefined> = FormItemProps<T, D> & {
  $typeof?: FileValueType;
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
  $append?: boolean;
};

export type FileDropProps<D extends DataItem_File | undefined = undefined> = (FileDropProps_Single<D> & { $multiple?: false; }) | (FileDropProps_Multiple<D> & { $multiple: true });

interface FileDropFC extends FunctionComponent {
  <D extends DataItem_File | undefined = undefined>(attrs: FileDropProps<D>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const FileDrop: FileDropFC = React.forwardRef<HTMLDivElement, FileDropProps>(<
  D extends DataItem_File | undefined = undefined
>(p: FileDropProps<D>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      return {
        $typeof: dataItem.typeof,
        $accept: dataItem.accept,
        $fileSize: dataItem.fileSize,
        $totalFileSize: dataItem.totalFileSize,
        $multiple: dataItem.multiple,
      };
    },
    over: ({ dataItem, props }) => {
      return {
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
      };
    },
  });

  const iref = useRef<HTMLInputElement>(null!);
  const href = useRef<HTMLInputElement>(null!);

  const ctx = useFormItemContext(form, props, {
    multipartFormData: true,
    multiple: props.$multiple,
    validations: () => {
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

  const multiable = props.$multiple === true;
  const fileDialog = props.$noFileDialog !== true;

  const click = () => {
    if (!ctx.editable || !fileDialog) return;
    iref.current?.click();
  };

  const commit = (fileList: FileList | null) => {
    if (fileList == null) {
      ctx.change(undefined);
      return;
    }
    const files = Array.from(fileList ?? []);
    if (multiable) {
      if (props.$append) {
        ctx.change([...(ctx.valueRef.current ?? []), ...files]);
        return;
      }
      ctx.change(files);
      return;
    }
    ctx.change(files?.[0]);
  };

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ctx.editable) return;
    const files = e.currentTarget.files;
    if (files?.length === 0) return;
    commit(files);
  };

  const dragLeave = (e: React.DragEvent) => {
    if (!ctx.editable) return;
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.removeAttribute("data-active");
  };

  const dragOver = (e: React.DragEvent) => {
    if (!ctx.editable) return;
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    e.currentTarget.setAttribute("data-active", "");
  };

  const drop = (e: React.DragEvent) => {
    if (!ctx.editable) return;
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.removeAttribute("data-active");
    commit(e.dataTransfer.files);
  };

  const clear = () => {
    ctx.change(undefined);
  };

  useEffect(() => {
    if (href.current) {
      const files = (Array.isArray(ctx.value) ? ctx.value : [ctx.value]).filter(file => file != null);
      const dt = new DataTransfer();
      files.forEach(file => dt.items.add(file));
      href.current.files = dt.files;
    }
  }, [ctx.value]);

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
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
      {ctx.editable && props.$hideClearButton !== true &&
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