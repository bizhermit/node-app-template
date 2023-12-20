"use client";

import { forwardRef, useEffect, useRef, type ForwardedRef, type FunctionComponent, type ReactElement, type ReactNode } from "react";
import type { FormItemHook, FormItemProps, FormItemValidation, ValueType } from "../../$types";
import FileValidation from "../../../../../data-items/file/validations";
import Button, { type ButtonOptions } from "../../../button";
import { CrossIcon } from "../../../icon";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type FileButtonHookAddon = {
  click: () => void;
};
type FileButtonHook<T extends File | Array<File>> = FormItemHook<T, FileButtonHookAddon>;

export const useFileButton = <T extends File | Array<File>>() => useFormItemBase<FileButtonHook<T>>((e) => {
  return {
    click: () => {
      throw e;
    },
  };
});

type FileButtonBaseOptions = Omit<ButtonOptions, "onClick" | "$notDependsOnForm"> & {
  // $typeof?: FileValueType;
  $accept?: string;
  $fileSize?: number;
  $totalFileSize?: number;
  $hideFileName?: boolean;
  $hideClearButton?: boolean;
  children?: ReactNode;
};

type FileButtonSingleOptions<D extends DataItem_File | undefined = undefined> = FileButtonBaseOptions & {
  $ref?: FileButtonHook<ValueType<File, D, File>> | FileButtonHook<File | Array<File>>;
  $append?: false;
  $multiple?: false;
};
type FileButtonMultipleOptions<D extends DataItem_File | undefined = undefined> = FileButtonBaseOptions & {
  $ref?: FileButtonHook<ValueType<Array<File>, D, Array<File>>> | FileButtonHook<File | Array<File>>;
  $append?: boolean;
  $multiple: true;
};

type OmitAttrs = "placeholder";
type FileButtonSingleProps<D extends DataItem_File | undefined = undefined> =
  OverwriteAttrs<Omit<FormItemProps<File, D>, OmitAttrs>, FileButtonSingleOptions<D>>;
type FileButtonMultipleProps<D extends DataItem_File | undefined = undefined> =
  OverwriteAttrs<Omit<FormItemProps<Array<File>, D>, OmitAttrs>, FileButtonMultipleOptions<D>>;

export type FileButtonProps<D extends DataItem_File | undefined = undefined> =
  FileButtonSingleProps<D> | FileButtonMultipleProps<D>;

interface FileButtonFC extends FunctionComponent {
  <D extends DataItem_File | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, FileButtonProps<D>>
  ): ReactElement<any> | null;
}

const FileButton = forwardRef(<
  D extends DataItem_File | undefined = undefined
>(p: FileButtonProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const {
    tabIndex,
    $size,
    $color,
    $round,
    $outline,
    $text,
    $icon,
    $iconPosition,
    $fillLabel,
    $fitContent,
    $noPadding,
    $focusWhenMounted,
    $append,
    $multiple,
    // $typeof,
    $accept,
    $fileSize,
    $totalFileSize,
    $hideFileName,
    $hideClearButton,
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
        } : {})
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
  const bref = useRef<HTMLButtonElement>(null!);

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    multipartFormData: true,
    multiple: $multiple,
    validations: () => {
      const validations: Array<FormItemValidation<any>> = [];
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
    messages: {
      required: "ファイルを選択してください。",
    },
  });

  const multiable = $multiple === true;

  const click = () => {
    if (!ctx.editable) return;
    if (iref.current) {
      iref.current.value = "";
      iref.current.click();
    }
  };

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ctx.editable) return;
    const files = Array.from(e.currentTarget.files ?? []);
    if (files?.length === 0) return;
    if (multiable) {
      if ($append) {
        ctx.change([...(ctx.valueRef.current ?? []), ...files]);
        return;
      }
      ctx.change(files);
      return;
    }
    ctx.change(files[0]);
  };

  const clear = () => {
    ctx.change(undefined);
  };

  useEffect(() => {
    if (href.current) {
      const files = (Array.isArray(ctx.value) ? ctx.value : [ctx.value]).filter(file => file != null);
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
  }, [ctx.value]);

  if ($ref) {
    $ref.focus = () => bref.current?.focus();
    $ref.click = () => click();
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $ctx={ctx}
      $preventFieldLayout
    >
      {ctx.editable &&
        <Button
          ref={bref}
          className={Style.button}
          onClick={click}
          disabled={!ctx.editable}
          tabIndex={tabIndex}
          $fillLabel={$fillLabel}
          $icon={$icon}
          $iconPosition={$iconPosition}
          $outline={$outline}
          $text={$text}
          $round={$round}
          $size={$size}
          $color={$color}
          $fitContent={$fitContent}
          $noPadding={$noPadding}
          $focusWhenMounted={$focusWhenMounted}
          $notDependsOnForm
        >
          {children ?? "ファイルを選択"}
        </Button>
      }
      {$hideFileName !== true && !$multiple && ctx.value != null &&
        <div className={Style.label}>
          {ctx.value.name}
        </div>
      }
      {ctx.editable && $hideClearButton !== true && ctx.value != null &&
        <div
          className={Style.clear}
          onClick={clear}
        >
          <CrossIcon />
        </div>
      }
      <input
        ref={iref}
        type="file"
        className={Style.file}
        accept={$accept}
        onChange={change}
        multiple={$multiple}
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
}) as FileButtonFC;

export default FileButton;