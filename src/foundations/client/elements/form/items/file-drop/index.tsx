"use client";

import { forwardRef, useEffect, useRef, type ForwardedRef, type FunctionComponent, type ReactElement, type ReactNode } from "react";
import FileValidation from "../../../../../data-items/file/validations";
import { pressPositiveKey } from "../../../../utilities/press-positive-key";
import { CrossIcon } from "../../../icon";
import Text from "../../../text";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type FileDropHookAddon = {
  picker: () => void;
};
type FileDropHook<T extends File | Array<File>> = F.ItemHook<T, FileDropHookAddon>;

export const useFileDrop = <T extends File | Array<File>>() => useFormItemBase<FileDropHook<T>>((e) => {
  return {
    picker: () => {
      throw e;
    },
  };
});

type FileDropBaseProps = {
  // $typeof?: FileValueType;
  $accept?: string;
  $fileSize?: number;
  $totalFileSize?: number;
  $noFileDialog?: boolean;
  $hideClearButton?: boolean;
  children?: ReactNode;
};

type FileDropSingleOptions<D extends DataItem_File | undefined = undefined> = FileDropBaseProps & {
  $ref?: FileDropHook<F.VType<File, D, File>> | FileDropHook<File | Array<File>>;
  $append?: false;
  $multiple?: false;
};
type FileDropMultipleOptions<D extends DataItem_File | undefined = undefined> = FileDropBaseProps & {
  $ref?: FileDropHook<F.VType<Array<File>, D, Array<File>>> | FileDropHook<File | Array<File>>;
  $append?: boolean;
  $multiple: true;
};

type OmitAttrs = "placeholder";
type FileDropSingleProps<D extends DataItem_File | undefined = undefined> =
  OverwriteAttrs<Omit<F.ItemProps<File, D>, OmitAttrs>, FileDropSingleOptions<D>>;
type FileDropMultipleProps<D extends DataItem_File | undefined = undefined> =
  OverwriteAttrs<Omit<F.ItemProps<Array<File>, D>, OmitAttrs>, FileDropMultipleOptions<D>>;

export type FileDropProps<D extends DataItem_File | undefined = undefined> =
  FileDropSingleProps<D> | FileDropMultipleProps<D>;

interface FileDropFC extends FunctionComponent {
  <D extends DataItem_File | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, FileDropProps<D>>
  ): ReactElement<any> | null;
}

const FileDrop = forwardRef(<
  D extends DataItem_File | undefined = undefined
>(p: FileDropProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const {
    tabIndex,
    $append,
    $multiple,
    // $typeof,
    $accept,
    $fileSize,
    $totalFileSize,
    $noFileDialog,
    $hideClearButton,
    $focusWhenMounted,
    children,
    ...$p
  } = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      return {
        // $typeof: dataItem.typeof,
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
  const bref = useRef<HTMLDivElement>(null);

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    multipartFormData: true,
    multiple: $multiple,
    validations: () => {
      const validations: Array<F.Validation<any>> = [];
      if ($accept) {
        validations.push(FileValidation.type($accept));
      }
      if ($fileSize != null) {
        validations.push(FileValidation.size($fileSize));
      }
      if ($totalFileSize != null) {
        validations.push(FileValidation.totalSize($totalFileSize));
      }
      return validations;
    },
    validationsDeps: [
      $accept,
      $fileSize,
      $totalFileSize,
    ],
    messages: {
      required: "ファイルを選択してください。",
    },
  });

  const multiable = $multiple === true;
  const fileDialog = $noFileDialog !== true;

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
      if ($append) {
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

  const formEnable = !form.disabled && !form.readOnly;

  useEffect(() => {
    if ($focusWhenMounted && formEnable) {
      bref.current?.focus();
    }
  }, [formEnable]);

  if ($ref) {
    $ref.focus = () => bref.current?.focus();
    $ref.picker = () => click();
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $ctx={ctx}
      $mainProps={{
        className: Style.main,
        tabIndex: undefined,
      }}
    >
      <input
        ref={iref}
        type="file"
        className={Style.file}
        multiple={$multiple}
        accept={$accept}
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
        ref={bref}
        onClick={click}
        onDragOver={dragOver}
        onDragLeave={dragLeave}
        onDrop={drop}
        tabIndex={ctx.disabled ? undefined : tabIndex ?? 0}
        data-dialog={fileDialog}
        onKeyDown={keydown}
      >
        <Text>
          {children}
        </Text>
      </div>
      {ctx.editable && $hideClearButton !== true && ctx.value != null &&
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
