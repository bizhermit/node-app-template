"use client";

import Style from "#/styles/components/elements/form/items/file-button.module.scss";
import Button, { type ButtonOptions } from "#/components/elements/button";
import { type ForwardedRef, forwardRef, type FunctionComponent, type ReactElement, type ReactNode, useEffect, useRef } from "react";
import { FileData } from "#/data-items/file";
import { CrossIcon } from "#/components/elements/icon";
import type { FormItemProps, FormItemValidation } from "#/components/elements/form/$types";
import useForm from "#/components/elements/form/context";
import { useDataItemMergedProps, useFormItemContext } from "#/components/elements/form/item-hook";
import { convertDataItemValidationToFormItemValidation } from "#/components/elements/form/utilities";
import { FormItemWrap } from "#/components/elements/form/item-wrap";

type FileButtonBaseProps<T, D extends DataItem_File | undefined = undefined> = FormItemProps<T, D> & ButtonOptions & {
  $typeof?: FileValueType;
  $accept?: string;
  $fileSize?: number;
  $totalFileSize?: number;
  $hideFileName?: boolean;
  $hideClearButton?: boolean;
  children?: ReactNode;
};

export type FileButtonProps_Single<D extends DataItem_File | undefined = undefined> = FileButtonBaseProps<File, D> & {
  $append?: false;
};

export type FileButtonProps_Multiple<D extends DataItem_File | undefined = undefined> = FileButtonBaseProps<Array<File>, D> & {
  $append?: boolean;
};

export type FileButtonProps<D extends DataItem_File | undefined = undefined> = (FileButtonProps_Single<D> & { $multiple?: false; }) | (FileButtonProps_Multiple<D> & { $multiple: true });

interface FileButtonFC extends FunctionComponent {
  <D extends DataItem_File | undefined = undefined>(attrs: FileButtonProps<D>, ref?: ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const FileButton: FileButtonFC = forwardRef<HTMLDivElement, FileButtonProps>(<
  D extends DataItem_File | undefined = undefined
>(p: FileButtonProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
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
    }
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
      if (props.$append) {
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

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      $preventFieldLayout
    >
      {ctx.editable &&
        <Button
          className={Style.button}
          $onClick={click}
          disabled={!ctx.editable}
          $fillLabel={props.$fillLabel}
          $icon={props.$icon}
          $iconPosition={props.$iconPosition}
          $outline={props.$outline}
          $round={props.$round}
          $size={props.$size}
          $color={props.$color}
          $fitContent={props.$fitContent}
        >
          {props.children ?? "ファイルを選択"}
        </Button>
      }
      {props.$hideFileName !== true && !props.$multiple && ctx.value != null &&
        <div className={Style.label}>
          {ctx.value.name}
        </div>
      }
      {ctx.editable && props.$hideClearButton !== true && ctx.value != null &&
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
        accept={props.$accept}
        onChange={change}
        multiple={props.$multiple}
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