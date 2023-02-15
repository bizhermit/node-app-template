import Button, { ButtonOptions } from "@/components/elements/button";
import { convertDataItemValidationToFormItemValidation, FormItemProps, FormItemValidation, FormItemWrap, useDataItemMergedProps, useForm, useFormItemContext } from "@/components/elements/form";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useRef } from "react";
import Style from "$/components/elements/form-items/file-button.module.scss";
import { VscClose } from "react-icons/vsc";
import { FileData } from "@/data-items/file";

export type FileButtonProps<D extends DataItem_File | undefined = undefined> = FormItemProps<File, D, File> & ButtonOptions & {
  $typeof?: FileValueType;
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
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      return {
        $typeof: dataItem.typeof,
        $accept: dataItem.accept,
        $fileSize: dataItem.fileSize,
        $totalFileSize: dataItem.totalFileSize,
      };
    },
    over: ({ dataItem, props }) => {
      return {
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
      };
    }
  });

  const iref = useRef<HTMLInputElement>(null!);
  const href = useRef<HTMLInputElement>(null!);

  const ctx = useFormItemContext(form, props, {
    multipartFormData: true,
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
    ctx.change(files[0]);
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
        >
          {props.children ?? "ファイルを選択"}
        </Button>
      }
      {props.$hideFileName !== true && ctx.value != null &&
        <div className={Style.label}>
          {ctx.value.name}
        </div>
      }
      {ctx.editable && props.$hideClearButton !== true && ctx.value != null &&
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