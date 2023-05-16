import Tooltip from "@/components/elements/tooltip";
import { attributes, attributesWithoutChildren } from "@/components/utilities/attributes";
import { createContext, type Dispatch, type FormHTMLAttributes, forwardRef, type HTMLAttributes, type ReactNode, type SetStateAction, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useReducer, useRef, useState, type FunctionComponent, type ForwardedRef, type ReactElement } from "react";
import Style from "$/components/elements/form-items/form-item.module.scss";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { equals, getValue, setValue } from "@/data-items/utilities";

type FormItemMessages = {
  default: string;
  required: string;
  typeMissmatch: string;
};
type FormItemMessageFunc = (key: keyof FormItemMessages) => string;

export type FormItemValidation<T> = (value: T, bindData: Struct | undefined, index: number, getMessage: FormItemMessageFunc) => (boolean | string | null | undefined);

export type FormItemMessageDisplayMode = "tooltip" | "bottom" | "bottom-hide" | "hide" | "none";

const inputAttributes = (props: Struct, ...classNames: Array<string | null | undefined>) => {
  const ret = attributesWithoutChildren(props, ...classNames);
  if ("name" in ret) delete ret.name;
  if ("tabIndex" in ret) delete ret.placeholder;
  if ("placeholder" in ret) delete ret.placeholder;
  return ret;
};

type ValueType<T, D extends DataItem | undefined = undefined, V = undefined> =
  V extends undefined ? (
    T extends any ? (D extends undefined ? T : DataItemValueType<Exclude<D, undefined>, true, "client">) : T
  ) : V;

type InputOmitProps = "name"
  | "defaultValue"
  | "defaultChecked"
  | "color"
  | "onChange"
  | "children";
export type FormItemProps<T = any, D extends DataItem | undefined = DataItem, V = T, U extends Struct = {}> = Omit<HTMLAttributes<HTMLDivElement>, InputOmitProps> & {
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
  $onChange?: (after: ValueType<T, D, V> | null | undefined, before: ValueType<T, D, V> | null | undefined, data: U & { errorMessage: string | undefined }) => void;
  $onEdit?: (after: ValueType<T, D, V> | null | undefined, before: ValueType<T, D, V> | null | undefined, data: U & { errorMessage: string | undefined }) => void;
  $tag?: ReactNode;
  $tagPosition?: "top" | "placeholder";
  $color?: Color;
  $preventFormBind?: boolean;
  $error?: string;
  $dataItem?: D;
  $messages?: Partial<FormItemMessages>;
};

type UseFormItemContextOptions<T = any, U extends Struct = {}> = {
  effect?: (value: T | null | undefined) => void;
  effectDeps?: Array<any>;
  multiple?: boolean;
  multipartFormData?: boolean;
  validations?: (getMessage: FormItemMessageFunc) => Array<FormItemValidation<T | null | undefined>>;
  validationsDeps?: Array<any>;
  preventRequiredValidation?: boolean;
  interlockValidation?: boolean;
  generateChangeCallbackData?: (after?: T | null | undefined, before?: T | null | undefined) => U;
  generateChangeCallbackDataDeps?: Array<any>;
  messages?: Partial<FormItemMessages>;
};

type FormContextProps = {
  bind?: Struct;
  disabled?: boolean;
  readOnly?: boolean;
  method?: string;
  errors: Struct;
  setErrors: Dispatch<SetStateAction<Struct>>;
  exErrors: Struct;
  setExErrors: Dispatch<SetStateAction<Struct>>;
  hasError: boolean;
  mount: (id: string, itemProps: FormItemProps<any, any, any, any>, mountItemProps: FormItemMountProps, options: UseFormItemContextOptions<any, any>) => string;
  unmount: (name: string) => void;
  validation: (returnId: string) => string | undefined;
  messageDisplayMode: FormItemMessageDisplayMode;
  messageWrap?: boolean;
  getValue: <T>(name: string) => T;
  setValue: (name: string, value: any, absolute?: boolean) => void;
  render: (name?: string) => void;
  getErrorMessages: (name?: string) => Array<string>;
};

const FormContext = createContext<FormContextProps>({
  bind: undefined,
  disabled: false,
  readOnly: false,
  errors: {},
  setErrors: () => { },
  exErrors: {},
  setExErrors: () => { },
  hasError: false,
  mount: () => "",
  unmount: () => { },
  validation: () => undefined,
  messageDisplayMode: "tooltip",
  // eslint-disable-next-line comma-spacing
  getValue: <T,>() => undefined as T,
  setValue: () => { },
  render: () => { },
  getErrorMessages: () => [],
});

type FormItemMountProps = {
  validation: () => string | undefined;
  change: (value: any | null | undefined, edit: boolean, absolute?: boolean) => void;
};

type PlainFormProps = {
  $submitDataType: "formData";
  $onSubmit?: (((data: FormData, e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>)) | boolean);
};

type BindFormProps<T extends Struct = Struct> = {
  $submitDataType?: "struct";
  $onSubmit?: (((data: T, e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>)) | boolean);
};

export type FormProps<T extends Struct = Struct> = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onReset" | "encType"> & {
  $bind?: boolean | Struct | null | undefined;
  $disabled?: boolean;
  $readOnly?: boolean;
  $messageDisplayMode?: FormItemMessageDisplayMode;
  $messageWrap?: boolean;
  $onReset?: (((e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>)) | boolean);
  encType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
  $onError?: (error: Struct) => void;
} & (PlainFormProps | BindFormProps<T>);

interface FormFC extends FunctionComponent<FormProps> {
  <T extends Struct = Struct>(attrs: FormProps<T>, ref?: ForwardedRef<HTMLFormElement>): ReactElement<any> | null;
}

const Form: FormFC = forwardRef<HTMLFormElement, FormProps>(<T extends Struct = Struct>(props: FormProps<T>, $ref: ForwardedRef<HTMLFormElement>) => {
  const ref = useRef<HTMLFormElement>(null!);
  useImperativeHandle($ref, () => ref.current);
  const method = props.method ?? "get";

  const bind = useMemo(() => {
    if (props.$bind === false) return undefined;
    if (props.$bind == null || props.$bind === true) return {};
    return props.$bind;
  }, [props.$bind]);

  const disabledRef = useRef(false);
  const [disabled, setDisabled] = useReducer((_: boolean, action: boolean) => {
    return disabledRef.current = action;
  }, false);
  const items = useRef<Struct<FormItemMountProps & { props: FormItemProps; options: UseFormItemContextOptions; }>>({});
  const [errors, setErrors] = useState<Struct>({});
  const [exErrors, setExErrors] = useState<Struct>({});

  const mount = (id: string, itemProps: FormItemProps, mountItemProps: FormItemMountProps, options: UseFormItemContextOptions) => {
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

  const validation = (returnId?: string) => {
    let errMsg: string | undefined = undefined;
    Object.keys(items.current).forEach(id => {
      const ret = items.current[id]?.validation();
      if (returnId === id) errMsg = ret;
    });
    return errMsg || undefined;
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
    const ret = props.$onSubmit((props.$submitDataType === "formData" ? new FormData(e.currentTarget) : bind) as any, e);
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
        item.change(item.props.$defaultValue, false);
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

  const get = (name: string) => {
    if (bind == null) return undefined;
    return getValue(bind, name);
  };

  const set = (name: string, value: any) => {
    if (bind == null) return;
    const id = Object.keys(items.current).find(id => items.current[id].props.name === name);
    if (id == null) return;
    items.current[id]?.change(value, false);
  };

  const render = (name?: string) => {
    if (name) {
      const id = Object.keys(items.current).find(id => items.current[id].props.name === name);
      if (id == null) return;
      const item = items.current[id];
      if (item == null || item.props.name == null) return;
      item.options?.effect?.(getValue(bind, item.props.name));
      return;
    }
    Object.keys(items.current).forEach(id => {
      const item = items.current[id];
      if (item.props.name == null) return;
      item.options?.effect?.(getValue(bind, item.props.name));
    });
  };

  const getErrorMessages = (name?: string) => {
    if (name) {
      const id = Object.keys(items.current).find(id => items.current[id].props.name === name);
      if (id == null) return [];
      if (id in errors) return [errors[id]];
      return [];
    }
    return Object.keys(items.current).map(id => errors[id]).filter(err => err);
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
      getValue: get,
      setValue: set,
      render,
      getErrorMessages,
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

export const formValidationMessages: FormItemMessages = {
  default: "入力エラーです。",
  required: "値を入力してください。",
  typeMissmatch: "型が不適切です。",
};

export const useForm = () => {
  return useContext(FormContext);
};

export const useDataItemMergedProps = <T, D extends DataItem | undefined, P extends FormItemProps<T, D, any, any>>(form: ReturnType<typeof useForm>, props: P, merge?: {
  under?: (ctx: { props: P; dataItem: NonNullable<P["$dataItem"]>; method?: string; }) => Partial<P>;
  over?: (ctx: { props: P; dataItem: NonNullable<P["$dataItem"]>; method?: string; }) => Partial<P>;
}) => {
  const p = {
    ...useMemo(() => {
      const dataItem = props.$dataItem;
      if (dataItem == null) return {};
      return {
        name: dataItem.name,
        $required: form.method === "get" ? false : dataItem.required,
        ...merge?.under?.({ props, dataItem, method: form.method }),
      };
    }, [props.$dataItem]),
    ...props,
  };
  return {
    ...p,
    ...useMemo(() => {
      const dataItem = props.$dataItem;
      if (dataItem == null || merge?.over == null) return {};
      return merge.over({ props: p, dataItem, method: form.method });
    }, [props.$dataItem]),
  } as P;
};

export const useFormItemContext = <T, D extends DataItem | undefined, V = undefined, U extends Struct = any, P extends FormItemProps<T, D, V, U> = FormItemProps<T, D, V, U>>(
  form: ReturnType<typeof useForm>,
  props: P,
  options?: UseFormItemContextOptions<ValueType<T, D, V>, U>
) => {
  const id = useRef(StringUtils.generateUuidV4());
  const [error, setError] = useState("");

  const valueRef = useRef<ValueType<T, D, V> | null | undefined>((() => {
    if (props == null) return undefined;
    if ("$value" in props) return props.$value;
    if ("$defaultValue" in props) return props.$defaultValue;
    if (props.name) {
      if (props.$bind) return getValue(props.$bind, props.name);
      if (form.bind) return getValue(form.bind, props.name);
    }
    return undefined;
  })());
  const [value, setValueImpl] = useState(valueRef.current);
  const setCurrentValue = (value: ValueType<T, D, V> | null | undefined) => {
    setValueImpl(valueRef.current = value);
  };
  const setBind = useCallback((value: ValueType<T, D, V> | null | undefined) => {
    if (!props.name) return;
    if (props.$bind) {
      setValue(props.$bind, props.name, value);
    }
    if (form.bind && !props.$preventFormBind) {
      setValue(form.bind, props.name, value);
    }
  }, [props.name, props.$bind, form.bind, props.$preventFormBind]);
  useMemo(() => {
    setBind(value);
  }, []);

  const getMessage = useCallback((key: keyof FormItemMessages) => {
    return props.$messages?.[key] ?? options?.messages?.[key] ?? formValidationMessages[key];
  }, []);

  const validations = useMemo(() => {
    const rets: Array<FormItemValidation<ValueType<T, D, V> | null | undefined>> = [];
    if (props.$required && !options?.preventRequiredValidation) {
      if (options?.multiple) {
        rets.push(v => {
          if (v == null) return getMessage("required");
          if (!Array.isArray(v)) return getMessage("typeMissmatch");
          if (v.length === 0 || v[0] === null) return getMessage("required");
          return "";
        });
      } else {
        rets.push((v) => {
          if (v == null || v === "") return getMessage("required");
          return "";
        });
      }
    }
    if (options?.validations) {
      rets.push(...options.validations(getMessage));
    }
    if (props?.$validations) {
      if (Array.isArray(props.$validations)) {
        rets.push(...props.$validations);
      } else {
        rets.push(props.$validations);
      }
    }
    return rets;
  }, [props.$required, options?.multiple, props?.$validations, getMessage, ...(options?.validationsDeps ?? [])]);

  const validation = useCallback(() => {
    const value = valueRef.current;
    const msgs: Array<string> = [];
    const bind = (() => {
      if (props == null) return {};
      if ("$bind" in props) return props.$bind;
      if (!props.$preventFormBind) return form.bind;
      return {};
    })();
    for (let i = 0, il = validations.length; i < il; i++) {
      const result = validations[i](value, bind, i, getMessage);
      if (result == null || result === "" || result === false) continue;
      if (typeof result === "string") msgs.push(result);
      else msgs.push(getMessage("default"));
      break;
    }
    const msg = msgs[0] || "";
    setError(msg);
    if (!props?.$preventFormBind) {
      form.setErrors(cur => {
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
    return msg || undefined;
  }, [validations, form.bind, props?.name, props?.$bind, props?.$preventFormBind, getMessage]);

  useEffect(() => {
    form.setExErrors(cur => {
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
  }, [props?.$error]);

  const change = useCallback((value: ValueType<T, D, V> | null | undefined, edit = true, absolute?: boolean) => {
    if (equals(valueRef.current, value) && !absolute) return;
    const before = valueRef.current;
    setCurrentValue(value);
    setBind(value);
    const errorMessage = (props?.$interlockValidation || options?.interlockValidation) ? form.validation(id.current) : validation();
    if (props.$onChange != null || (props.$onEdit != null && edit)) {
      const data = options?.generateChangeCallbackData?.(valueRef.current, before) as U;
      props?.$onChange?.(valueRef.current, before, { ...data, errorMessage });
      if (edit) {
        props?.$onEdit?.(valueRef.current, before, { ...data, errorMessage });
      }
    }
    if (!edit) options?.effect?.(valueRef.current);
  }, [setBind, props?.$onChange, validation, ...(options?.generateChangeCallbackDataDeps ?? [])]);

  useEffect(() => {
    const name = props?.name;
    if (props == null || name == null || form.bind == null || "$bind" in props || "$value" in props || props.$preventFormBind) return;
    const before = valueRef.current;
    setCurrentValue(getValue(form.bind, name));
    const errorMessage = validation();
    props.$onChange?.(valueRef.current, before, { ...options?.generateChangeCallbackData?.(valueRef.current, before) as U, errorMessage });
    options?.effect?.(valueRef.current);
  }, [form.bind, props?.$preventFormBind]);

  useEffect(() => {
    const name = props?.name;
    if (props == null || name == null || props.$bind == null || "$value" in props) return;
    const before = valueRef.current;
    setCurrentValue(getValue(props.$bind, name));
    const errorMessage = validation();
    props.$onChange?.(valueRef.current, before, { ...options?.generateChangeCallbackData?.(valueRef.current, before) as U, errorMessage });
    options?.effect?.(valueRef.current);
  }, [props?.$bind]);

  useEffect(() => {
    if (props == null || !("$value" in props) || equals(valueRef.current, props.$value)) return;
    setCurrentValue(props.$value);
    setBind(props.$value);
    options?.effect?.(valueRef.current);
    validation();
  }, [props?.$value, setBind]);

  useEffect(() => {
    if (props) {
      form.mount(id.current, props, {
        validation,
        change,
      }, options ?? { effect: () => { } });
      return () => {
        form.unmount(id.current);
      };
    }
  }, [validation, change]);

  useEffect(() => {
    options?.effect?.(valueRef.current);
  }, [...(options?.effectDeps ?? [])]);

  useEffect(() => {
    validation();
  }, [validation]);

  const disabled = props?.$disabled || form.disabled;
  const readOnly = props?.$readOnly || form.readOnly;

  return {
    ...form,
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
    messageDisplayMode: props?.$messagePosition ?? form.messageDisplayMode,
    messageWrap: props?.$messageWrap ?? form.messageWrap,
    getMessage,
  };
};

export const convertHiddenValue = (value: any) => {
  if (value == null) return "";
  const t = typeof value;
  if (t === "string" || t === "number" || t === "bigint" || t === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
};

type FormItemWrapProps = FormItemProps<any, any, any, any> & {
  $context: ReturnType<typeof useFormItemContext<any, any, any, any>>;
  $preventFieldLayout?: boolean;
  $className?: string;
  $clickable?: boolean;
  $mainProps?: HTMLAttributes<HTMLDivElement> & Struct;
  $useHidden?: boolean;
  children?: ReactNode;
};

export const FormItemWrap = forwardRef<HTMLDivElement, FormItemWrapProps>((props, ref) => {
  const errorNode = props.$context.messageDisplayMode !== "none" && props.$context.messageDisplayMode !== "hide" && (StringUtils.isNotEmpty(props.$context.error) || props.$context.messageDisplayMode === "bottom") && (
    <div
      className={Style.error}
      data-mode={props.$context.messageDisplayMode}
    >
      <span
        className={Style.text}
        data-nowrap={!props.$context.messageWrap}
      >
        {props.$context.error}
      </span>
    </div>
  );

  const attrs = {
    ...attributes(props.$mainProps ?? {}, Style.main, `bdc-${props.$color || "border"}`),
    "data-editable": props.$context.editable,
    "data-field": props.$preventFieldLayout !== true,
    "data-disabled": props.$context.disabled,
    "data-error": props.$context.messageDisplayMode === "none" ? undefined : Boolean(props.$context.error),
    "data-clickable": props.$clickable,
  };

  const tagPlaceholder = props.$context.editable && props.$tag != null && props.$tagPosition === "placeholder";

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
          value={convertHiddenValue(props.$context.value)}
        />
      }
      {(props.$context.hasValidator || ("$error" in props)) && props.$context.editable ?
        (props.$context.messageDisplayMode.startsWith("bottom") ?
          <>
            <div {...attrs}>
              {props.children}
            </div>
            {errorNode}
          </>
          : <Tooltip
            {...attrs}
            $disabled={StringUtils.isEmpty(props.$context.error)}
            $popupClassName={Style.tooltip}
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

export const convertDataItemValidationToFormItemValidation = <T, U, P extends FormItemProps<T, any, any, any>, D extends DataItem, V = P["$value"]>(
  func: DataItemValidation<any, any>[number],
  props: P,
  $dataItem: D,
  convertValue?: (v: ValueType<T, D, V>) => U | null | undefined
) => {
  return (v: any | null | undefined, bindData: Struct | undefined) => {
    const res = func(
      convertValue ? convertValue(v) : v as U | null | undefined,
      props?.name || $dataItem.name || "",
      $dataItem,
      bindData,
      undefined,
      undefined
    );
    if (res == null) return undefined;
    if (typeof res === "string") return res;
    return res.body;
  };
};

export const useFormBindState = <T extends any>(name: string, init?: T | (() => T)) => {
  const form = useForm();

  const getBindValue = () => {
    const v = form.getValue<T>(name);
    if (v != null || init == null) return v;
    return typeof init === "function" ? (init as (() => T))() : init;
  };

  const state = useReducer((state: T, action: (T | ((c: T) => T))) => {
    const v = setValue(form.bind, name, typeof action === "function" ? (action as ((c: T) => T))(state) : action);
    form.render(name);
    return v;
  }, undefined, getBindValue);

  useEffect(() => {
    state[1](getBindValue);
  }, [form.bind]);

  return {
    value: state[0],
    set: state[1],
    name,
    bind: form.bind,
  } as const;
};