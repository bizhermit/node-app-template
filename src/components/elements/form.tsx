import { attributes } from "@/utilities/attributes";
import React, { createContext, Dispatch, FormHTMLAttributes, SetStateAction, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useReducer, useRef, useState } from "react";

export type FormItemValidation<T> = (value: T, bindData: Struct | undefined, index: number) => (boolean | string | null);

export type FormItemProps<T = any, U = any> = {
  name?: string;
  $bind?: Struct;
  $disabled?: boolean;
  $readOnly?: boolean;
  $required?: boolean;
  $validations?: FormItemValidation<Nullable<T>> | Array<FormItemValidation<Nullable<T>>>;
  $placeholder?: string;
  $interlockValidation?: boolean;
  $tabIndex?: number;
  $defaultValue?: T;
  $value?: T;
  onChange?: (after: Nullable<T>, before: Nullable<T>, data?: U) => void;
};

type FormContextProps = {
  bind?: Struct;
  disabled?: boolean;
  readOnly?: boolean;
  errors: Struct;
  hasError: boolean;
  setErrors: Dispatch<SetStateAction<Struct>>;
  mount: (itemProps: FormItemProps, mountItemProps: FormItemMountProps) => void;
  unmount: (itemProps: FormItemProps) => void;
  validation: () => void;
};

export const FormContext = createContext<FormContextProps>({
  bind: {},
  disabled: false,
  readOnly: false,
  errors: {},
  hasError: false,
  setErrors: () => { },
  mount: () => { },
  unmount: () => { },
  validation: () => { },
});

type FormItemMountProps = {
  validation: () => void;
};

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & {
  $bind?: Struct;
  $disabled?: boolean;
  $readOnly?: boolean;
  onSubmit?: ((e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>) | boolean);
};

const Form = React.forwardRef<HTMLFormElement, FormProps>((props, $ref) => {
  const ref = useRef<HTMLFormElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const disabledRef = useRef(false);
  const [disabled, setDisabled] = useReducer((_: boolean, action: boolean) => {
    return disabledRef.current = action;
  }, false);
  const items = useRef<Struct<FormItemMountProps>>({});
  const [errors, setErrors] = useState<Struct>({});

  const mount = (itemProps: FormItemProps, mountItemProps: FormItemMountProps) => {
    if (!itemProps.name) return;
    items.current[itemProps.name] = mountItemProps;
  };

  const unmount = (itemProps: FormItemProps) => {
    if (!itemProps.name) return;
    delete items.current[itemProps.name];
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
    if (props.onSubmit == null) {
      setDisabled(false);
      return;
    }
    if (typeof props.onSubmit === "boolean") {
      if (!props.onSubmit) {
        e.preventDefault();
      }
      setDisabled(false);
      return;
    }
    const ret = props.onSubmit(e);
    if (ret == null || ret === true) {
      setDisabled(false);
      return;
    }
    e.preventDefault();
    if (ret === false) {
      setDisabled(false);
      return;
    }
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
    }}>
      <form
        {...attributes(props)}
        onSubmit={submit}
      >
      </form>
    </FormContext.Provider>
  );
});

export default Form;

type UseFormOptions<T = any, U = any> = {
  effect: (value: Nullable<T>) => void;
  validations?: Array<FormItemValidation<Nullable<T>>>;
  preventRequiredValidation?: boolean;
  interlockValidation?: boolean;
  generateChangeCallbackData?: (after?: Nullable<T>, before?: Nullable<T>) => U;
};

const validationMessages = {
  default: "入力エラーです。",
  required: "値を入力してください。",
} as const;

const equals = (v1: unknown, v2: unknown) => {
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
  const [value, setValue] = useReducer((_state: Nullable<T>, action: Nullable<T>) => {
    return valueRef.current = action;
  }, valueRef.current);

  const validations = useMemo(() => {
    const rets: Array<FormItemValidation<Nullable<T>>> = [];
    if (props?.$required && !options?.preventRequiredValidation) {
      rets.push((v) => {
        if (v == null || v === "") return validationMessages.required;
        return "";
      });
    }
    if (options?.validations) {
      rets.push(...options.validations);
    }
    if (props?.$validations) {
      if (Array.isArray(props.$validations)) {
        rets.push(...props.$validations);
      } else {
        rets.push(props.$validations);
      }
    }
    return rets;
  }, []);

  const validation = useCallback(() => {
    const value = valueRef.current;
    const msgs: Array<string> = [];
    for (let i = 0, il = validations.length; i < il; i++) {
      const result = validations[i](value, ctx.bind, i);
      if (result == null || result === "" || result === false) {
        continue;
      }
      if (typeof result === "string") msgs.push(result);
      msgs.push(validationMessages.default);
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
    valueRef.current = value;
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
    props?.onChange?.(valueRef.current, before, options?.generateChangeCallbackData?.(valueRef.current, before));
  }, [ctx.bind, props?.onChange, validation]);

  useEffect(() => {
    const name = props?.name;
    if (props == null || name == null || ctx.bind == null || "$bind" in props || "$value" in props) return;
    const before = valueRef.current;
    valueRef.current = ctx.bind[name];
    if (!equals(valueRef.current, before)) {
      props.onChange?.(valueRef.current, before, options?.generateChangeCallbackData?.(valueRef.current, before));
    }
    options?.effect(valueRef.current);
    validation();
  }, [ctx.bind]);

  useEffect(() => {
    const name = props?.name;
    if (props == null || name == null || props.$bind == null || "$value" in props) return;
    const before = valueRef.current;
    valueRef.current = props.$bind[name];
    if (!equals(valueRef.current, before)) {
      props.onChange?.(valueRef.current, before, options?.generateChangeCallbackData?.(valueRef.current, before));
    }
    options?.effect(valueRef.current);
    validation();
  }, [props?.$bind]);

  useEffect(() => {
    if (props == null || !("$value" in props) || equals(valueRef.current, props.$value)) return;
    valueRef.current = props.$value;
    options?.effect(valueRef.current);
    validation();
  }, [props?.$value]);

  useEffect(() => {
    if (props) {
      ctx.mount(props, { validation });
      return () => {
        ctx.unmount(props);
      };
    }
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
    validation,
    error,
    setError,
    effect: options?.effect,
  };
};