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
  bindData: { [v: string | number | symbol]: any } | undefined,
  index: number,
  getMessage: FormItemMessageFunc
) => (boolean | string | null | undefined);

export type ValueType<T, D extends DataItem | undefined = undefined, V = undefined> =
  V extends undefined ? (
    D extends undefined ? T : DataItemValueType<Exclude<D, undefined>, true, "client">
  ) : V;

type FormItemSurfaceOptions = {
  $focusWhenMounted?: boolean;
};

type FormItemCoreOptions<
  T = any,
  D extends DataItem | undefined = DataItem,
  V = undefined,
  U extends { [v: string | number | symbol]: any } = {}
> = {
  name?: string;
  $label?: string;
  $dataItem?: D;
  $disabled?: boolean;
  $readOnly?: boolean;
  $messages?: Partial<FormItemMessages>;
  $error?: string | null | undefined;
  $required?: boolean;
  $validations?: FormItemValidation<ValueType<T, D, V> | null | undefined> | Array<FormItemValidation<ValueType<T, D, V> | null | undefined>>;
  $interlockValidation?: boolean;
  $defaultValue?: ValueType<T, D, V> | null | undefined;
  $value?: ValueType<T, D, V> | null | undefined;
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
  $preventFormBind?: boolean;
  // $bind?: { [v: string | number | symbol]: any };
  $ref?: FormItemHook<ValueType<T, D, V> | null | undefined> | FormItemHook<any | null | undefined>;
};

type FormItemUnderOptions = {
  $tag?: ReactNode;
  $tagPosition?: "top" | "placeholder";
  $color?: Color;
  $messageWrap?: boolean;
  $messagePosition?: FormItemMessageDisplayMode;
};

type FormItemOptions<
  T = any,
  D extends DataItem | undefined = DataItem,
  V = undefined,
  U extends { [v: string | number | symbol]: any } = {}
> = FormItemCoreOptions<T, D, V, U> & FormItemUnderOptions & FormItemSurfaceOptions;

type InputOmitProps =
  | "name"
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
  U extends { [v: string | number | symbol]: any } = {}
> = OverwriteAttrs<Omit<HTMLAttributes<HTMLDivElement>, InputOmitProps>, FormItemOptions<T, D, V, U>>;

export type FormItemHook<T, Q extends { [key: string]: any } = {}> = Omit<{
  focus: () => void;
  getValue: () => (T | null | undefined);
  setValue: (v: T | null | undefined) => void;
  setDefaultValue: () => void;
  clear: () => void;
  hasError: () => boolean;
  getErrorMessage: () => (string | null | undefined);
}, keyof Q> & Q;

export type FormItemMountProps = {
  validation: () => string | null | undefined;
  change: (value: any | null | undefined, edit: boolean, absolute?: boolean) => void;
};
