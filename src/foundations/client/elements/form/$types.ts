import type { HTMLAttributes, ReactNode } from "react";

export type FormItemMessageDisplayMode = "tooltip" | "bottom" | "bottom-hide" | "hide" | "none";

export type FormItemMessages = {
  default: string;
  required: string;
  typeMissmatch: string;
};

export type FormItemMessageFunc = (key: keyof FormItemMessages) => string;

export type FormItemValidation<T> = (
  value: T,
  bindData: Struct | undefined,
  index: number,
  getMessage: FormItemMessageFunc
) => (boolean | string | null | undefined);

export type ValueType<T, D extends DataItem | undefined = undefined, V = undefined> =
  V extends undefined ? (
    D extends undefined ? T : DataItemValueType<Exclude<D, undefined>, true, "client">
  ) : V;

type InputOmitProps = "name"
  | "inputMode"
  | "defaultValue"
  | "defaultChecked"
  | "color"
  | "onChange"
  | "children";

export type FormItemProps<
  T = any,
  D extends DataItem | undefined = DataItem,
  V = undefined,
  U extends Struct = {}
> = Omit<HTMLAttributes<HTMLDivElement>, InputOmitProps> & {
  name?: string;
  $bind?: Struct;
  $disabled?: boolean;
  $readOnly?: boolean;
  $required?: boolean;
  $validations?: FormItemValidation<ValueType<T, D, V> | null | undefined> | Array<FormItemValidation<ValueType<T, D, V> | null | undefined>>;
  $interlockValidation?: boolean;
  $defaultValue?: ValueType<T, D, V> | null | undefined;
  $value?: ValueType<T, D, V> | null | undefined;
  $messagePosition?: FormItemMessageDisplayMode;
  $messageWrap?: boolean;
  $onChange?: (
    after: ValueType<T, D, V> | null | undefined,
    before: ValueType<T, D, V> | null | undefined,
    data: U & { errorMessage: string | null | undefined }
  ) => void;
  $preventMemorizeOnChange?: boolean;
  $onEdit?: (
    after: ValueType<T, D, V> | null | undefined,
    before: ValueType<T, D, V> | null | undefined,
    data: U & { errorMessage: string | null | undefined }
  ) => void;
  $preventMemorizeOnEdit?: boolean;
  $tag?: ReactNode;
  $tagPosition?: "top" | "placeholder";
  $color?: Color;
  $preventFormBind?: boolean;
  $error?: string | null | undefined;
  $dataItem?: D;
  $messages?: Partial<FormItemMessages>;
};

export type FormItemMountProps = {
  validation: () => string | null | undefined;
  change: (value: any | null | undefined, edit: boolean, absolute?: boolean) => void;
};
