import Tooltip from "@/components/elements/tooltip";
import { attributes, attributesWithoutChildren } from "@/utilities/attributes";
import React, { createContext, Dispatch, FormHTMLAttributes, HTMLAttributes, ReactNode, SetStateAction, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useReducer, useRef, useState } from "react";
import Style from "$/components/elements/form-items/form-item.module.scss";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

export type FormItemValidation<T> = (value: T, bindData: Struct | undefined, index: number) => (boolean | string | null);

export type FormItemMessageDisplayMode = "tooltip" | "bottom" | "bottom-hide";

type InputOmitProps = "name"
  | "defaultValue"
  | "defaultChecked"
  | "color"
  | "onChange"
  | "children";

const inputAttributes = (props: Struct, ...classNames: Array<string | null | undefined>) => {
  const ret = attributesWithoutChildren(props, ...classNames);
  if ("name" in ret) delete ret.name;
  if ("tabIndex" in ret) delete ret.placeholder;
  if ("placeholder" in ret) delete ret.placeholder;
  return ret;
};

export type FormItemProps<T = any, U = any> = Omit<HTMLAttributes<HTMLDivElement>, InputOmitProps> & {
  name?: string;
  $bind?: Struct;
  $disabled?: boolean;
  $readOnly?: boolean;
  $required?: boolean;
  $validations?: FormItemValidation<Nullable<T>> | Array<FormItemValidation<Nullable<T>>>;
  $interlockValidation?: boolean;
  $defaultValue?: T;
  $value?: Nullable<T>;
  $messagePosition?: FormItemMessageDisplayMode;
  $messageWrap?: boolean;
  $onChange?: (after: Nullable<T>, before: Nullable<T>, data?: U) => void;
  $tag?: ReactNode;
  $tagPosition?: "top" | "placeholder";
  $color?: Color;
};

type FormContextProps = {
  bind?: Struct;
  disabled?: boolean;
  readOnly?: boolean;
  errors: Struct;
  hasError: boolean;
  setErrors: Dispatch<SetStateAction<Struct>>;
  mount: (itemProps: FormItemProps, mountItemProps: FormItemMountProps, options: UseFormOptions) => string;
  unmount: (name: string) => void;
  validation: () => void;
  messageDisplayMode: FormItemMessageDisplayMode;
  messageWrap?: boolean;
};

export const FormContext = createContext<FormContextProps>({
  bind: undefined,
  disabled: false,
  readOnly: false,
  errors: {},
  hasError: false,
  setErrors: () => { },
  mount: () => "",
  unmount: () => { },
  validation: () => { },
  messageDisplayMode: "tooltip",
});

type FormItemMountProps = {
  validation: () => void;
  change: (value: Nullable<any>, absolute?: boolean) => void;
};

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onReset"> & {
  $bind?: Struct;
  $disabled?: boolean;
  $readOnly?: boolean;
  $messageDisplayMode?: FormItemMessageDisplayMode;
  $messageWrap?: boolean;
  $onSubmit?: (((formData: FormData, e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>)) | boolean);
  $onReset?: (((e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>)) | boolean);
};

const Form = React.forwardRef<HTMLFormElement, FormProps>((props, $ref) => {
  const ref = useRef<HTMLFormElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const disabledRef = useRef(false);
  const [disabled, setDisabled] = useReducer((_: boolean, action: boolean) => {
    return disabledRef.current = action;
  }, false);
  const items = useRef<Struct<FormItemMountProps & { props: FormItemProps; options: UseFormOptions; }>>({});
  const [errors, setErrors] = useState<Struct>({});

  const mount = (itemProps: FormItemProps, mountItemProps: FormItemMountProps, options: UseFormOptions) => {
    const name = itemProps.name ?? StringUtils.generateUuidV4();
    items.current[name] = { ...mountItemProps, props: itemProps, options, };
    return name;
  };

  const unmount = (name: string) => {
    delete items.current[name];
  };

  const hasError = useMemo(() => {
    return Object.keys(errors).find(key => Boolean(errors[key])) != null;
  }, [errors]);

  const validation = () => {
    Object.keys(items.current).forEach(name => {
      items.current[name]?.validation();
    });
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    if (props.$disabled || disabledRef.current || hasError) {
      e.preventDefault();
      return;
    }
    setDisabled(true);
    if (props.$onSubmit == null) {
      setDisabled(false);
      return;
    }
    if (typeof props.$onSubmit === "boolean") {
      if (props.$onSubmit !== true) {
        e.preventDefault();
      }
      setDisabled(false);
      return;
    }
    const ret = props.$onSubmit(new FormData(e.currentTarget), e);
    if (ret == null || typeof ret === "boolean") {
      if (ret !== true) {
        e.preventDefault();
      }
      setDisabled(false);
      return;
    }
    e.preventDefault();
    if ("then" in ret) {
      ret.then(() => {
        setDisabled(false);
      });
    }
  };

  const resetItems = () => {
    setTimeout(() => {
      Object.keys(items.current).forEach(name => {
        const item = items.current[name];
        item.options.effect?.(item.props.$defaultValue);
        item.change(item.props.$defaultValue);
      });
    }, 0);
  };

  const reset = (e: React.FormEvent<HTMLFormElement>) => {
    if (props.$disabled || disabledRef.current) {
      e.preventDefault();
      return;
    }
    setDisabled(true);
    if (props.$onReset == null || typeof props.$onReset === "boolean") {
      if (props.$onReset === false) {
        e.preventDefault();
      } else {
        resetItems();
      }
      setDisabled(false);
      return;
    }
    const ret = props.$onReset(e);
    if (ret == null || typeof ret === "boolean") {
      if (ret === false) {
        e.preventDefault();
      } else {
        resetItems();
      }
      setDisabled(false);
      return;
    }
    e.preventDefault();
    if ("then" in ret) {
      ret.then(() => {
        setDisabled(false);
      });
    }
  };

  return (
    <FormContext.Provider value={{
      bind: props.$bind,
      disabled: props.$disabled || disabled,
      readOnly: props.$readOnly,
      errors,
      hasError,
      setErrors,
      mount,
      unmount,
      validation,
      messageDisplayMode: props.$messageDisplayMode ?? "tooltip",
      messageWrap: props.$messageWrap,
    }}>
      <form
        {...attributes(props)}
        onSubmit={submit}
        onReset={reset}
      >
      </form>
    </FormContext.Provider>
  );
});

export default Form;

type UseFormOptions<T = any, U = any> = {
  effect?: (value: Nullable<T>) => void;
  multiple?: boolean;
  validations?: () => Array<FormItemValidation<Nullable<T>>>;
  validationsDeps?: Array<any>;
  preventRequiredValidation?: boolean;
  interlockValidation?: boolean;
  generateChangeCallbackData?: (after?: Nullable<T>, before?: Nullable<T>) => U;
};

export const formValidationMessages = {
  default: "入力エラーです。",
  required: "値を入力してください。",
  typeMissmatch: "型が不適切です。",
} as const;

export const equals = (v1: unknown, v2: unknown) => {
  if (v1 == null && v2 == null) return true;
  return v1 === v2;
};

export const useForm = <T = any, U = any>(props?: FormItemProps<T>, options?: UseFormOptions<T, U>) => {
  const ctx = useContext(FormContext);
  const [error, setError] = useState("");
  const valueRef = useRef<Nullable<T>>((() => {
    if (props == null) return undefined;
    if ("$value" in props) return props.$value;
    if ("$defaultValue" in props) return props.$defaultValue;
    return undefined;
  })());
  const [value, setValueImpl] = useState(valueRef.current);
  const setValue = (value: Nullable<T>) => {
    setValueImpl(valueRef.current = value);
  };

  const validations = useMemo(() => {
    const rets: Array<FormItemValidation<Nullable<T>>> = [];
    if (props?.$required && !options?.preventRequiredValidation) {
      if (options?.multiple) {
        rets.push(v => {
          if (v == null) return formValidationMessages.required;
          if (!Array.isArray(v)) {
            return formValidationMessages.typeMissmatch;
          }
          if (v.length === 0 || v[0] === null) {
            return formValidationMessages.required;
          }
          return "";
        });
      } else {
        rets.push((v) => {
          if (v == null || v === "") return formValidationMessages.required;
          return "";
        });
      }
    }
    if (options?.validations) {
      rets.push(...options.validations());
    }
    if (props?.$validations) {
      if (Array.isArray(props.$validations)) {
        rets.push(...props.$validations);
      } else {
        rets.push(props.$validations);
      }
    }
    return rets;
  }, [props?.$required, options?.multiple, ...(options?.validationsDeps ?? [])]);

  const validation = useCallback(() => {
    const value = valueRef.current;
    const msgs: Array<string> = [];
    for (let i = 0, il = validations.length; i < il; i++) {
      const result = validations[i](value, ctx.bind, i);
      if (result == null || result === "" || result === false) {
        continue;
      }
      if (typeof result === "string") msgs.push(result);
      msgs.push(formValidationMessages.default);
      break;
    }
    const msg = msgs[0] || "";
    setError(msg);
    const name = props?.name;
    if (name) {
      ctx.setErrors(cur => {
        const ret = { ...cur };
        ret[name] = msg;
        return ret;
      });
    }
  }, [validations]);

  const change = useCallback((value: Nullable<T>, absolute?: boolean) => {
    if (equals(valueRef.current, value) && !absolute) return;
    const before = valueRef.current;
    setValue(value);
    const name = props?.name;
    if (name) {
      if (ctx.bind) {
        ctx.bind[name] = value;
      }
      if (props.$bind) {
        props.$bind[name] = value;
      }
    }
    if (props?.$interlockValidation || options?.interlockValidation) {
      ctx.validation();
    } else {
      validation();
    }
    props?.$onChange?.(valueRef.current, before, options?.generateChangeCallbackData?.(valueRef.current, before));
  }, [ctx.bind, props?.$bind, props?.$onChange, validation]);

  useEffect(() => {
    const name = props?.name;
    if (props == null || name == null || ctx.bind == null || "$bind" in props || "$value" in props) return;
    const before = valueRef.current;
    setValue(ctx.bind[name]);
    if (!equals(valueRef.current, before)) {
      props.$onChange?.(valueRef.current, before, options?.generateChangeCallbackData?.(valueRef.current, before));
    }
    options?.effect?.(valueRef.current);
    validation();
  }, [ctx.bind]);

  useEffect(() => {
    const name = props?.name;
    if (props == null || name == null || props.$bind == null || "$value" in props) return;
    const before = valueRef.current;
    setValue(props.$bind[name]);
    if (!equals(valueRef.current, before)) {
      props.$onChange?.(valueRef.current, before, options?.generateChangeCallbackData?.(valueRef.current, before));
    }
    options?.effect?.(valueRef.current);
    validation();
  }, [props?.$bind]);

  useEffect(() => {
    if (props == null || !("$value" in props) || equals(valueRef.current, props.$value)) return;
    setValue(props.$value);
    options?.effect?.(valueRef.current);
    validation();
  }, [props?.$value]);

  useEffect(() => {
    if (props) {
      const name = ctx.mount(props, {
        validation,
        change,
      }, options ?? { effect: () => { } });
      return () => {
        ctx.unmount(name);
      };
    }
  }, [validation, change]);

  useEffect(() => {
    options?.effect?.(valueRef.current);
    validation();
  }, []);

  const disabled = props?.$disabled || ctx.disabled;
  const readOnly = props?.$readOnly || ctx.readOnly;

  return {
    ...ctx,
    disabled,
    readOnly,
    editable: !disabled && !readOnly,
    change,
    valueRef,
    value,
    validation,
    hasValidator: validations.length > 0,
    error,
    setError,
    effect: options?.effect,
    messageDisplayMode: props?.$messagePosition ?? ctx.messageDisplayMode,
    messageWrap: props?.$messageWrap ?? ctx.messageWrap,
  };
};

export const FormItemWrap = React.forwardRef<HTMLDivElement, FormItemProps & {
  $$form: ReturnType<typeof useForm<any, any>>;
  $preventFieldLayout?: boolean;
  $className?: string;
  $clickable?: boolean;
  $mainProps?: HTMLAttributes<HTMLDivElement> & Struct;
  $useHidden?: boolean;
  children: ReactNode;
}>((props, ref) => {
  const errorNode = (Boolean(props.$$form.error) || props.$$form.messageDisplayMode === "bottom") && (
    <div
      className={Style.error}
      data-mode={props.$$form.messageDisplayMode}
    >
      <span
        className={Style.text}
        data-nowrap={!props.$$form.messageWrap}
      >
        {props.$$form.error}
      </span>
    </div>
  );

  const attrs = {
    ...attributes(props.$mainProps ?? {}, Style.main, props.$color ? `bdc-${props.$color}` : ""),
    "data-editable": props.$$form.editable,
    "data-field": props.$preventFieldLayout !== true,
    "data-disabled": props.$$form.disabled,
    "data-error": Boolean(props.$$form.error),
    "data-clickable": props.$clickable,
  };

  const tagPlaceholder = props.$$form.editable && props.$tag != null && props.$tagPosition === "placeholder";

  return (
    <div
      {...inputAttributes(props, Style.wrap, props.$className)}
      ref={ref}
      data-tagpad={tagPlaceholder}
    >
      {props.$tag &&
        <div
          className={`${Style.tag}${props.$color ? ` fgc-${props.$color}` : ""}`}
          data-pos={!tagPlaceholder ? "top" : props.$tagPosition || "top"}
        >
          {props.$tag}
        </div>
      }
      {props.$useHidden && props.name &&
        <input
          name={props.name}
          type="hidden"
          value={JSON.stringify(props.$$form.value ?? "")}
        />
      }
      {props.$$form.hasValidator && props.$$form.editable ?
        (props.$$form.messageDisplayMode.startsWith("bottom") ?
          <>
            <div {...attrs}>
              {props.children}
            </div>
            {errorNode}
          </>
          : <Tooltip
            {...attrs}
            $disabled={StringUtils.isEmpty(props.$$form.error)}
          >
            {props.children}
            {errorNode}
          </Tooltip>
        ) :
        <div {...attrs}>
          {props.children}
        </div>
      }
    </div>
  );
});

export const multiValidationIterator = (v: any, func: (value: string | number | Date) => string) => {
  if (v == null || !Array.isArray(v)) return "";
  for (let i = 0, il = v.length; i < il; i++) {
    const ret = func(v[i]);
    if (ret) return ret;
  }
  return "";
};