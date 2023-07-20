"use client";

import Style from "#/styles/components/elements/form/items/file-drop.module.scss";
import { type ForwardedRef, forwardRef, type FunctionComponent, type ReactElement, type ReactNode, useEffect, useRef } from "react";
import Text from "#/components/elements/text";
import { FileData } from "#/data-items/file";
import { CrossIcon } from "#/components/elements/icon";
import { pressPositiveKey } from "#/components/utilities/attributes";
import type { FormItemProps, FormItemValidation } from "#/components/elements/form/$types";
import useForm from "#/components/elements/form/context";
import { useDataItemMergedProps, useFormItemContext } from "#/components/elements/form/item-hook";
import { convertDataItemValidationToFormItemValidation } from "#/components/elements/form/utilities";
import { FormItemWrap } from "#/components/elements/form/item-wrap";

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

export type FileDropProps<D extends DataItem_File | undefined = undefined> =
  (FileDropProps_Single<D> & { $multiple?: false; }) | (FileDropProps_Multiple<D> & { $multiple: true });

interface FileDropFC extends FunctionComponent {
  <D extends DataItem_File | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, FileDropProps<D>>
  ): ReactElement<any> | null;
}

const FileDrop = forwardRef<HTMLDivElement, FileDropProps>(<
  D extends DataItem_File | undefined = undefined
>(p: FileDropProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      return {
        $typeof: dataItem.typeof,
        $accept: dataItem.accept,
        $fileSize: dataItem.fileSize,
        ...(dataItem.multiple ? {
          $totalFileSize: dataItem.totalFileSize,
          $multiple: dataItem.multiple,
        } : {}),
      };
    },
    over: ({ dataItem, props }) => {
      return {
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => {
          if (v == null || Array.isArray(v)) return v;
          return [v];
        })),
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
    messages: {
      required: "ファイルを選択してください。",
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

  const keydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    pressPositiveKey(e, () => click());
  };

  const clear = () => {
    ctx.change(undefined);
  };

  useEffect(() => {
    if (href.current) {
      if (ctx.value == null) {
        href.current.files = null;
      } else {
        const files = (Array.isArray(ctx.value) ? ctx.value : [ctx.value]).filter(file => file != null);
        if (files.length === 0) {
          href.current.files = null;
        } else {
          const dt = new DataTransfer();
          files.forEach((file, index) => {
            if (file == null) return;
            if (file instanceof File) {
              dt.items.add(file);
              return;
            }
            if (file instanceof Blob) {
              dt.items.add(new File([file], `${props.name || "img"}-${index}`, { type: file.type }));
              return;
            }
            // eslint-disable-next-line no-console
            console.warn(`file-drop [${props.name}]: failed to convert for DataTransfer. no file/blob`);
          });
          href.current.files = dt.files;
        }
      }
    }
    if (iref.current) iref.current.value = "";
  }, [ctx.value]);

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      $mainProps={{
        className: Style.main,
        tabIndex: undefined,
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
      {props.name && ctx.value != null &&
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
        tabIndex={ctx.disabled ? undefined : props.tabIndex ?? 0}
        data-dialog={fileDialog}
        onKeyDown={keydown}
      >
        <Text>
          {props.children}
        </Text>
      </div>
      {ctx.editable && props.$hideClearButton !== true && ctx.value != null &&
        <div
          className={Style.clear}
          onClick={clear}
        >
          <CrossIcon />
        </div>
      }
    </FormItemWrap >
  );
}) as FileDropFC;

export default FileDrop;