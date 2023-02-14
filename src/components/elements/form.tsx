import Tooltip from "@/components/elements/tooltip";
import { attributes, attributesWithoutChildren } from "@/components/utilities/attributes";
import React, { createContext, Dispatch, FormHTMLAttributes, HTMLAttributes, ReactNode, SetStateAction, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useReducer, useRef, useState } from "react";
import Style from "$/components/elements/form-items/form-item.module.scss";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { equals, getValue, setValue } from "@/data-items/utilities";

export type FormItemValidation<T> = (value: T, bindData: Struct | undefined, index: number) => (boolean | string | null | undefined);

export type FormItemMessageDisplayMode = "tooltip" | "bottom" | "bottom-hide";

const inputAttributes = (props: Struct, ...classNames: Array<string | null | undefined>) => {
  const ret = attributesWithoutChildren(props, ...classNames);
  if ("name" in ret) delete ret.name;
  if ("tabIndex" in ret) delete ret.placeholder;
  if ("placeholder" in ret) delete ret.placeholder;
  return ret;
};

type ValueType<T = null, D extends DataItem | undefined = undefined> =
  T extends any ? (D extends undefined ? T : DataItemValueType<Exclude<D, undefined>, true>) : T;

type InputOmitProps = "name"
  | "defaultValue"
  | "defaultChecked"
  | "color"
  | "onChange"
  | "children";
export type FormItemProps<T = any, U = any, D extends DataItem | undefined = DataItem> = Omit<HTMLAttributes<HTMLDivElement>, InputOmitProps> & {
  name?: string;
  $bind?: Struct;
  $disabled?: boolean;
  $readOnly?: boolean;
  $required?: boolean;
  $validations?: FormItemValidation<ValueType<T, D> | null | undefined> | Array<FormItemValidation<ValueType<T, D> | null | undefined>>;
  $interlockValidation?: boolean;
  $defaultValue?: ValueType<T, D> | null | undefined;
  $value?: ValueType<T, D> | null | undefined;
  $messagePosition?: FormItemMessageDisplayMode;
  $messageWrap?: boolean;
  $onChange?: (after: ValueType<T, D> | null | undefined, before: ValueType<T, D> | null | undefined, data?: U) => void;
  $tag?: ReactNode;
  $tagPosition?: "top" | "placeholder";
  $color?: Color;
  $preventFormBind?: boolean;
  $error?: string;
  $dataItem?: D;
};

type FormContextProps = {
  bind?: Struct;
  disabled?: boolean;
  readOnly?: boolean;
  method: string;
  errors: Struct;
  setErrors: Dispatch<SetStateAction<Struct>>;
  exErrors: Struct;
  setExErrors: Dispatch<SetStateAction<Struct>>;
  hasError: boolean;
  mount: (id: string, itemProps: FormItemProps, mountItemProps: FormItemMountProps, options: UseFormOptions<any, any, any>) => string;
  unmount: (name: string) => void;
  validation: () => void;
  messageDisplayMode: FormItemMessageDisplayMode;
  messageWrap?: boolean;
};

const defaultMethod = "get";

export const FormContext = createContext<FormContextProps>({
  bind: undefined,
  disabled: false,
  readOnly: false,
  method: defaultMethod,
  errors: {},
  setErrors: () => { },
  exErrors: {},
  setExErrors: () => { },
  hasError: false,
  mount: () => "",
  unmount: () => { },
  validation: () => { },
  messageDisplayMode: "tooltip",
});

type FormItemMountProps = {
  validation: () => void;
  change: (value: any | null | undefined, absolute?: boolean) => void;
};

type PlainFormProps = {
  $bind?: undefined | null | false;
  $onSubmit?: (((data: FormData, e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>)) | boolean);
};

type BindFormProps = {
  $bind: Struct | true;
  $onSubmit?: (((data: Struct, e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>)) | boolean);
};

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onReset" | "encType"> & {
  $disabled?: boolean;
  $readOnly?: boolean;
  $messageDisplayMode?: FormItemMessageDisplayMode;
  $messageWrap?: boolean;
  $onReset?: (((e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>)) | boolean);
  encType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
  $onError?: (error: Struct) => void;
} & (PlainFormProps | BindFormProps);

const Form = React.forwardRef<HTMLFormElement, FormProps>((props, $ref) => {
  const ref = useRef<HTMLFormElement>(null!);
  useImperativeHandle($ref, () => ref.current);
  const method = props.method ?? defaultMethod;

  const bind = useMemo(() => {
    if (!props.$bind || props.$bind === true) return {};
    return props.$bind;
  }, [props.$bind]);

  const disabledRef = useRef(false);
  const [disabled, setDisabled] = useReducer((_: boolean, action: boolean) => {
    return disabledRef.current = action;
  }, false);
  const items = useRef<Struct<FormItemMountProps & { props: FormItemProps; options: UseFormOptions; }>>({});
  const [errors, setErrors] = useState<Struct>({});
  const [exErrors, setExErrors] = useState<Struct>({});

  const mount = (id: string, itemProps: FormItemProps, mountItemProps: FormItemMountProps, options: UseFormOptions) => {
    items.current[id] = { ...mountItemProps, props: itemProps, options, };
    return id;
  };

  const unmount = (id: string) => {
    delete items.current[id];
    setErrors(cur => {
      if (!(id in cur)) return cur;
      const ret = { ...cur };
      delete ret[id];
      return ret;
    });
    setExErrors(cur => {
      if (!(id in cur)) return cur;
      const ret = { ...cur };
      delete ret[id];
      return ret;
    });
  };

  const hasError = useMemo(() => {
    return Object.keys(errors).find(key => Boolean(errors[key])) != null
      || Object.keys(exErrors).find(key => Boolean(exErrors[key])) != null;
  }, [errors, exErrors]);

  const validation = () => {
    Object.keys(items.current).forEach(id => {
      items.current[id]?.validation();
    });
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    if (props.$disabled || disabledRef.current || hasError) {
      e.preventDefault();
      return;
    }
    if (props.encType) {
      e.currentTarget.enctype = props.encType;
    } else {
      const hasMultipartFormData = (() => {
        if (props.encType) return false;
        const item = Object.keys(items.current).find(id => {
          return items.current[id].options?.multipartFormData === true;
        });
        return item != null;
      })();
      if (hasMultipartFormData) {
        e.currentTarget.enctype = "multipart/form-data";
      } else {
        e.currentTarget.removeAttribute("enctype");
      }
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
    const ret = props.$onSubmit((!props.$bind ? new FormData(e.currentTarget) : bind) as any, e);
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
      Object.keys(items.current).forEach(id => {
        const item = items.current[id];
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

  useEffect(() => {
    if (props.$onError) {
      const e = { ...errors };
      Object.keys(e).forEach(id => {
        if (e[id]) return;
        delete e[id];
      });
      const exE = { ...exErrors };
      Object.keys(exE).forEach(id => {
        if (exE[id]) return;
        delete exE[id];
      });
      props.$onError({ ...exE, ...e });
    }
  }, [errors, exErrors]);

  return (
    <FormContext.Provider value={{
      bind,
      disabled: props.$disabled || disabled,
      readOnly: props.$readOnly,
      method,
      errors,
      setErrors,
      exErrors,
      setExErrors,
      hasError,
      mount,
      unmount,
      validation,
      messageDisplayMode: props.$messageDisplayMode ?? "tooltip",
      messageWrap: props.$messageWrap,
    }}>
      <form
        {...attributes(props)}
        method={method}
        onSubmit={submit}
        onReset={reset}
      />
    </FormContext.Provider>
  );
});

export default Form;

type UseFormOptions<T = any, U = any, P extends FormItemProps = FormItemProps> = {
  setDataItem?: (dataItem: NonNullable<P["$dataItem"]>, method: string) => P,
  effect?: (value: T | null | undefined) => void;
  effectDeps?: (props: P) => Array<any>;
  multiple?: boolean;
  multipartFormData?: boolean;
  validations?: (props: P) => Array<FormItemValidation<T | null | undefined>>;
  validationsDeps?: (props: P) => Array<any>;
  preventRequiredValidation?: boolean;
  interlockValidation?: boolean;
  generateChangeCallbackData?: (after?: T | null | undefined, before?: T | null | undefined) => U;
  generateChangeCallbackDataDeps?: (props: P) => Array<any>;
};

export const formValidationMessages = {
  default: "入力エラーです。",
  required: "値を入力してください。",
  typeMissmatch: "型が不適切です。",
} as const;

export const useForm = <T = any, U = any, P extends FormItemProps = FormItemProps>($props?: P, options?: UseFormOptions<T, U, P>) => {
  const ctx = useContext(FormContext);
  const id = useRef(StringUtils.generateUuidV4());
  const [error, setError] = useState("");

  const props: P = {
    ...useMemo<P>(() => {
      const d = $props?.$dataItem;
      if (d == null) return {} as any;
      return {
        name: d.name,
        $required: ctx.method === "get" ? undefined : d.required,
        ...options?.setDataItem?.(d, ctx.method),
      };
    }, [$props?.$dataItem, ctx.method]),
    ...$props,
  };

  const valueRef = useRef<T | null | undefined>((() => {
    if (props == null) return undefined;
    if ("$value" in props) return props.$value;
    if ("$defaultValue" in props) return props.$defaultValue;
    return undefined;
  })());
  const [value, setValueImpl] = useState(valueRef.current);
  const setCurrentValue = (value: T | null | undefined) => {
    setValueImpl(valueRef.current = value);
  };

  const validations = useMemo(() => {
    const rets: Array<FormItemValidation<T | null | undefined>> = [];
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
      rets.push(...options.validations(props));
    }
    if (props?.$validations) {
      if (Array.isArray(props.$validations)) {
        rets.push(...props.$validations);
      } else {
        rets.push(props.$validations);
      }
    }
    return rets;
  }, [props?.$required, options?.multiple, ...(options?.validationsDeps?.(props) ?? [])]);

  const validation = useCallback(() => {
    const value = valueRef.current;
    const msgs: Array<string> = [];
    const bind = (() => {
      if (props == null) return {};
      if ("$bind" in props) return props.$bind;
      if (!props.$preventFormBind) return ctx.bind;
      return {};
    })();
    for (let i = 0, il = validations.length; i < il; i++) {
      const result = validations[i](value, bind, i);
      if (result == null || result === "" || result === false) continue;
      if (typeof result === "string") msgs.push(result);
      msgs.push(formValidationMessages.default);
      break;
    }
    const msg = msgs[0] || "";
    setError(msg);
    if (props?.name) {
      ctx.setErrors(cur => {
        if (msg) {
          if (cur[id.current] === msg) return cur;
          return {
            ...cur,
            [id.current]: msg,
          };
        }
        if (!(id.current in cur)) return cur;
        const ret = { ...cur };
        delete ret[id.current];
        return ret;
      });
    }
  }, [validations, ctx.bind, props?.name, props?.$bind, props?.$preventFormBind]);

  useEffect(() => {
    if (props?.name) {
      ctx.setExErrors(cur => {
        if (props?.$error) {
          return {
            ...cur,
            [id.current]: props.$error,
          };
        }
        if (!(id.current in cur)) return cur;
        const ret = { ...cur };
        delete ret[id.current];
        return ret;
      });
    }
  }, [props?.$error]);

  const change = useCallback((value: T | null | undefined, absolute?: boolean) => {
    if (equals(valueRef.current, value) && !absolute) return;
    const before = valueRef.current;
    setCurrentValue(value);
    const name = props?.name;
    if (name) {
      if (!props.$preventFormBind) {
        if (ctx.bind) {
          setValue(ctx.bind, name, value);
        }
      }
      if (props.$bind) {
        setValue(props.$bind, name, value);
      }
    }
    if (props?.$interlockValidation || options?.interlockValidation) {
      ctx.validation();
    } else {
      validation();
    }
    props?.$onChange?.(valueRef.current, before, options?.generateChangeCallbackData?.(valueRef.current, before));
  }, [ctx.bind, props?.name, props?.$bind, props?.$onChange, validation, props?.$preventFormBind, ...(options?.generateChangeCallbackDataDeps?.(props) ?? [])]);

  useEffect(() => {
    const name = props?.name;
    if (props == null || name == null || ctx.bind == null || "$bind" in props || "$value" in props || props.$preventFormBind) return;
    const before = valueRef.current;
    setCurrentValue(getValue(ctx.bind, name));
    if (!equals(valueRef.current, before)) {
      props.$onChange?.(valueRef.current, before, options?.generateChangeCallbackData?.(valueRef.current, before));
    }
    options?.effect?.(valueRef.current);
    validation();
  }, [ctx.bind, props?.$preventFormBind]);

  useEffect(() => {
    const name = props?.name;
    if (props == null || name == null || props.$bind == null || "$value" in props) return;
    const before = valueRef.current;
    setCurrentValue(getValue(props.$bind, name));
    if (!equals(valueRef.current, before)) {
      props.$onChange?.(valueRef.current, before, options?.generateChangeCallbackData?.(valueRef.current, before));
    }
    options?.effect?.(valueRef.current);
    validation();
  }, [props?.$bind]);

  useEffect(() => {
    if (props == null || !("$value" in props) || equals(valueRef.current, props.$value)) return;
    setCurrentValue(props.$value);
    options?.effect?.(valueRef.current);
    validation();
  }, [props?.$value]);

  useEffect(() => {
    if (props) {
      ctx.mount(id.current, props, {
        validation,
        change,
      }, options ?? { effect: () => { } });
      return () => {
        ctx.unmount(id.current);
      };
    }
  }, [validation, change]);

  useEffect(() => {
    options?.effect?.(valueRef.current);
  }, [...(options?.effectDeps?.(props) ?? [])]);

  useEffect(() => {
    validation();
  }, [validation]);

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
    error: error || props?.$error,
    setError,
    effect: options?.effect,
    messageDisplayMode: props?.$messagePosition ?? ctx.messageDisplayMode,
    messageWrap: props?.$messageWrap ?? ctx.messageWrap,
    props,
  };
};

const convertHiddenValue = (value: any) => {
  if (value == null) return "";
  const t = typeof value;
  if (t === "string" || t === "number" || t === "bigint" || t === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
};

export const FormItemWrap = React.forwardRef<HTMLDivElement, {
  $$form: ReturnType<typeof useForm<any, any>>;
  $preventFieldLayout?: boolean;
  $className?: string;
  $clickable?: boolean;
  $mainProps?: HTMLAttributes<HTMLDivElement> & Struct;
  $useHidden?: boolean;
  children: ReactNode;
}>((props, ref) => {
  const fprops = props.$$form.props;

  const errorNode = (StringUtils.isNotEmpty(props.$$form.error) || props.$$form.messageDisplayMode === "bottom") && (
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
    ...attributes(props.$mainProps ?? {}, Style.main, fprops.$color ? `bdc-${fprops.$color}` : ""),
    "data-editable": props.$$form.editable,
    "data-field": props.$preventFieldLayout !== true,
    "data-disabled": props.$$form.disabled,
    "data-error": Boolean(props.$$form.error),
    "data-clickable": props.$clickable,
  };

  const tagPlaceholder = props.$$form.editable && fprops.$tag != null && fprops.$tagPosition === "placeholder";

  return (
    <div
      {...inputAttributes(fprops, Style.wrap, props.$className)}
      ref={ref}
      data-tagpad={tagPlaceholder}
    >
      {fprops.$tag &&
        <div
          className={`${Style.tag}${fprops.$color ? ` fgc-${fprops.$color}` : ""}`}
          data-pos={!tagPlaceholder ? "top" : fprops.$tagPosition || "top"}
        >
          {fprops.$tag}
        </div>
      }
      {props.$useHidden && fprops.name &&
        <input
          name={fprops.name}
          type="hidden"
          value={convertHiddenValue(props.$$form.value)}
        />
      }
      {(props.$$form.hasValidator || ("$error" in props)) && props.$$form.editable ?
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

export const multiValidationIterator = (v: any, func: (value: string | number | Date) => (string | undefined | null)) => {
  if (v == null || !Array.isArray(v)) return "";
  for (let i = 0, il = v.length; i < il; i++) {
    const ret = func(v[i]);
    if (ret) return ret;
  }
  return "";
};

export const convertDataItemValidationToFormItemValidation = (func: DataItemValidation<any, any>[0], props: FormItemProps | undefined, $dataItem: DataItem, convertValue: (v: any) => any): FormItemValidation<any> => {
  return (v: string | null | undefined, bindData: Struct | undefined) => {
    const res = func(convertValue(v), props?.name || $dataItem.name || "", $dataItem, bindData, undefined, undefined);
    if (res == null) return undefined;
    if (typeof res === "string") return res;
    return res.body;
  };
};