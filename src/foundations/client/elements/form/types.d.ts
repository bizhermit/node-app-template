declare namespace F {

  type MessagePosition = "bottom" | "bottom-hide" | "hide" | "tooltip" | "none";

  type Message = {
    default: string;
    required: string;
    typeMissmatch: string;
  };

  type MessageSupplier = (key: keyof F.Message) => string;

  type Validation<T> = (
    value: T,
    bindData: { [v: string | number | symbol]: any } | undefined,
    index: number,
    getMessage: F.MessageSupplier
  ) => (boolean | string | null | undefined);

  type VType<T, D extends DataItem | undefined = undefined, V = undefined> =
    V extends undefined ? (D extends undefined ? T : DI.VType<Exclude<D, undefined>, true, "client">) : V;

  type ItemSurfaceOptions = {
    $focusWhenMounted?: boolean;
  };

  type ItemCoreOptions<
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
    $messages?: Partial<F.Message>;
    $error?: string | null | undefined;
    $required?: boolean;
    $validations?: F.Validation<F.VType<T, D, V> | null | undefined> | Array<F.Validation<F.VType<T, D, V> | null | undefined>>;
    $interlockValidation?: boolean;
    $defaultValue?: F.VType<T, D, V> | null | undefined;
    $value?: F.VType<T, D, V> | null | undefined;
    $onChange?: (
      after: F.VType<T, D, V> | null | undefined,
      before: F.VType<T, D, V> | null | undefined,
      data: U & { errorMessage: string | null | undefined }
    ) => void;
    $preventMemorizeOnChange?: boolean;
    $onEdit?: (
      after: F.VType<T, D, V> | null | undefined,
      before: F.VType<T, D, V> | null | undefined,
      data: U & { errorMessage: string | null | undefined }
    ) => void;
    $preventMemorizeOnEdit?: boolean;
    $preventFormBind?: boolean;
    // $bind?: { [v: string | number | symbol]: any };
    $ref?: F.ItemHook<F.VType<T, D, V> | null | undefined> | F.ItemHook<any | null | undefined>;
  };

  type ItemUnderOptions = {
    $tag?: React.ReactNode | boolean;
    $tagPosition?: "top" | "placeholder";
    $color?: Color;
    $messageWrap?: boolean;
    $messagePosition?: F.MessagePosition;
  };

  type ItemOptions<
    T = any,
    D extends DataItem | undefined = DataItem,
    V = undefined,
    U extends { [v: string | number | symbol]: any } = {}
  > = F.ItemCoreOptions<T, D, V, U> & F.ItemUnderOptions & F.ItemSurfaceOptions;

  type ItemProps<
    T = any,
    D extends DataItem | undefined = DataItem,
    V = undefined,
    U extends { [v: string | number | symbol]: any } = {}
  > = OverwriteAttrs<Omit<React.HTMLAttributes<HTMLDivElement>,
    | "name"
    | "inputMode"
    | "defaultValue"
    | "defaultChecked"
    | "color"
    | "onChange"
    | "children"
  >, F.ItemOptions<T, D, V, U>>;

  type ItemHook<T, Q extends { [v: string]: any } = {}> = Omit<{
    focus: () => void;
    getValue: () => (T | null | undefined);
    setValue: (v: T | null | undefined) => void;
    setDefaultValue: () => void;
    clear: () => void;
    hasError: () => boolean;
    getErrorMessage: () => (string | null | undefined);
  }, keyof Q> & Q;

  type ItemMountProps = {
    validation: () => string | null | undefined;
    change: (value: any | null | undefined, edit: boolean, absolute?: boolean) => void;
  };

}
