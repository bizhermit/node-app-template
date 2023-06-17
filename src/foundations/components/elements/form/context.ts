import type { FormItemMessageDisplayMode, FormItemMessageFunc, FormItemMessages, FormItemMountProps, FormItemProps, FormItemValidation } from "#/components/elements/form/$types";
import { setValue } from "#/data-items/utilities";
import { type Dispatch, type SetStateAction, createContext, useContext, useReducer, useEffect } from "react";

export type UseFormItemContextOptions<T = any, U extends Struct = {}> = {
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
  mount: (
    id: string,
    itemProps: FormItemProps<any, any, any, any>,
    mountItemProps: FormItemMountProps,
    options: UseFormItemContextOptions<any, any>
  ) => string;
  unmount: (name: string) => void;
  validation: (returnId: string) => string | null | undefined;
  messageDisplayMode: FormItemMessageDisplayMode;
  messageWrap?: boolean;
  getValue: <T>(name: string) => T;
  setValue: (name: string, value: any, absolute?: boolean) => void;
  render: (name?: string) => void;
  getErrorMessages: (name?: string) => Array<string>;
};

export const FormContext = createContext<FormContextProps>({
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

export const useForm = () => {
  return useContext(FormContext);
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