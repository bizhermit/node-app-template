import { attributes } from "@/utilities/attributes";
import React, { createContext, Dispatch, FormHTMLAttributes, HTMLAttributes, SetStateAction, useContext, useImperativeHandle, useMemo, useReducer, useRef, useState } from "react";

export type FromItemValidation<T> = (value: T, bindData: Struct, index: number) => (boolean | string | null);

export type FormItemProps<T = any, U = any> = {
  name?: string;
  $bind?: Struct;
  $disabled?: boolean;
  $readOnly?: boolean;
  $required?: boolean;
  $validations?: FromItemValidation<T> | Array<FromItemValidation<T>>;
  $placeholder?: string;
  $interlockValidation?: boolean;
  $tabIndex?: number;
  $defaultValue?: T;
  $value?: T;
  onChange?: (after: T, before: T, data?: U) => void;
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

const FormContext = createContext<FormContextProps>({
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

  return {
    ...ctx
  }
};