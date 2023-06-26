import type { FormItemMessageDisplayMode, FormItemMessageFunc, FormItemMessages, FormItemMountProps, FormItemProps, FormItemValidation } from "#/components/elements/form/$types";
import { equals } from "#/data-items/utilities";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { type Dispatch, type SetStateAction, createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

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
  effectSameNameItem: (id: string, value: any) => void;
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
  effectSameNameItem: () => {},
  getErrorMessages: () => [],
});

const useForm = () => {
  return useContext(FormContext);
};

type FormBindStateValue<D extends DataItem | any> = D extends DataItem ? (DataItemValueType<D, true, "client"> | undefined) : (D | undefined);

export const useFormBindState = <
  D extends DataItem | any
>(dataItemOrName: D | string, init?: FormBindStateValue<D> | (() => FormBindStateValue<D>)) => {
  const id = useRef(StringUtils.generateUuidV4());
  const name = typeof dataItemOrName === "string" ?
    dataItemOrName :
    (dataItemOrName as D extends DataItem ? D : { name: string; }).name!;
  const form = useForm();
  const [_, rerender] = useState(0);

  useEffect(() => {
    form.mount(id.current, { name }, {
      change: () => rerender(c => c + 1),
      validation: () => undefined,
    }, { effect: () => rerender(c => c + 1) });
    return () => {
      form.unmount(id.current);
    };
  }, []);

  const set = useCallback((value: FormBindStateValue<D> | ((c: FormBindStateValue<D>) => FormBindStateValue<D>)) => {
    form.setValue(name, typeof value === "function" ? (value as ((c: FormBindStateValue<D>) => FormBindStateValue<D>))(form.getValue(name)) : value);
  }, []);

  useEffect(() => {
    if (init == null) return;
    const v = form.getValue(name);
    const iv = typeof init === "function" ? (init as (() => FormBindStateValue<D>))() : init;
    if (equals(v, iv)) return;
    form.setValue(name, iv);
  }, []);

  return {
    value: form.getValue(name) as FormBindStateValue<D>,
    set,
    name,
    bind: form.bind,
  } as const;
};

export default useForm;